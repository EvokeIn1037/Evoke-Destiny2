import asyncio
import json
import os
import shutil
import sqlite3
import tempfile
import urllib.request
import zipfile
from contextlib import contextmanager
from dataclasses import dataclass
from datetime import datetime, timedelta, timezone
from typing import Generator

from app.config import get_manifest_db_path, SUPPORTED_LOCALES

BUNGIE_ROOT = "https://www.bungie.net"
_DB_DIR = "./app/db"


@dataclass
class _LocaleState:
    timestamp: datetime | None  # UTC time the DB was last downloaded
    updating: bool              # True while a download is in progress
    event: asyncio.Event        # Set when idle, cleared while updating


_locale_states: dict[str, _LocaleState] = {}


def _get_state(lang: str) -> _LocaleState:
    if lang not in _locale_states:
        db_path = os.path.join(_DB_DIR, f"manifest_{lang}.db")
        ts = (
            datetime.fromtimestamp(os.path.getmtime(db_path), tz=timezone.utc)
            if os.path.exists(db_path)
            else None
        )
        ev = asyncio.Event()
        ev.set()
        _locale_states[lang] = _LocaleState(timestamp=ts, updating=False, event=ev)
    return _locale_states[lang]


def _last_tuesday_17_utc(now: datetime) -> datetime:
    """Return the most recent Tuesday 17:00:00 UTC that is at or before *now*."""
    days_since = (now.weekday() - 1) % 7  # Monday=0, Tuesday=1 → 0 days since Tuesday when today is Tuesday
    candidate = (now - timedelta(days=days_since)).replace(
        hour=17, minute=0, second=0, microsecond=0
    )
    if candidate > now:
        candidate -= timedelta(weeks=1)
    return candidate


def _is_fresh(state: _LocaleState) -> bool:
    if state.timestamp is None:
        return False
    return state.timestamp > _last_tuesday_17_utc(datetime.now(timezone.utc))


def _download_db_sync(lang: str, api_key: str) -> None:
    req = urllib.request.Request(
        f"{BUNGIE_ROOT}/Platform/Destiny2/Manifest/",
        headers={"X-API-Key": api_key},
    )
    with urllib.request.urlopen(req) as resp:
        data = json.loads(resp.read())

    content_paths = data["Response"]["mobileWorldContentPaths"]
    content_path = content_paths.get(lang)
    if not content_path:
        raise RuntimeError(f"No manifest path for locale '{lang}' in Bungie API response")

    os.makedirs(_DB_DIR, exist_ok=True)

    with tempfile.TemporaryDirectory() as tmp_dir:
        content_file = os.path.join(tmp_dir, "content.content")
        dl_req = urllib.request.Request(
            f"{BUNGIE_ROOT}{content_path}",
            headers={"X-API-Key": api_key},
        )
        with urllib.request.urlopen(dl_req) as resp:
            with open(content_file, "wb") as f:
                f.write(resp.read())

        zip_file = content_file.replace(".content", ".zip")
        os.rename(content_file, zip_file)

        with zipfile.ZipFile(zip_file, "r") as zf:
            names = zf.namelist()
            if not names:
                raise RuntimeError("Manifest zip is empty")
            zf.extract(names[0], tmp_dir)
            extracted = os.path.join(tmp_dir, names[0])

        dest = os.path.join(_DB_DIR, f"manifest_{lang}.db")
        if os.path.exists(dest):
            os.remove(dest)
        shutil.move(extracted, dest)


async def _ensure_db(lang: str) -> str:
    """Return lang if its DB is fresh; re-download if stale. Falls back to 'en'."""
    from app.config import settings

    if lang not in SUPPORTED_LOCALES:
        return "en"

    db_path = os.path.join(_DB_DIR, f"manifest_{lang}.db")
    state = _get_state(lang)

    # DB was downloaded after the last weekly reset — nothing to do.
    if _is_fresh(state):
        return lang

    # Another coroutine is already downloading; join the FIFO wait queue.
    if state.updating:
        await state.event.wait()
        return lang if os.path.exists(db_path) else "en"

    # We are responsible for this download.
    state.updating = True
    state.event.clear()
    try:
        await asyncio.to_thread(_download_db_sync, lang, settings.bungie_api_key)
        state.timestamp = datetime.now(timezone.utc)
        return lang
    except Exception:
        if os.path.exists(db_path):
            return lang  # use stale DB rather than failing
        raise
    finally:
        state.updating = False
        state.event.set()


def _hash_to_id(hash_value: int) -> int:
    id_ = int(hash_value)
    if id_ & (1 << 31):
        id_ -= 1 << 32
    return id_


@contextmanager
def _open_db(lang: str) -> Generator[sqlite3.Connection, None, None]:
    con = sqlite3.connect(get_manifest_db_path(lang), check_same_thread=False)
    try:
        yield con
    finally:
        con.close()


def _query_con(con: sqlite3.Connection, table: str, hash_value: int) -> dict | None:
    id_ = _hash_to_id(hash_value)
    try:
        cur = con.execute(f"SELECT json FROM {table} WHERE id = ?", (id_,))  # noqa: S608
        row = cur.fetchone()
        if not row:
            return None
        return json.loads(row[0])
    except sqlite3.OperationalError:
        return None


def _query(table: str, hash_value: int, lang: str = "en") -> dict | None:
    with _open_db(lang) as con:
        return _query_con(con, table, hash_value)


async def get_activity_name(hash_value: int, lang: str = "en") -> str:
    lang = await _ensure_db(lang)
    data = await asyncio.to_thread(_query, "DestinyActivityDefinition", hash_value, lang)
    if not data:
        return ""
    return data.get("displayProperties", {}).get("name", "")


async def get_item_display(hash_value: int, lang: str = "en") -> tuple[str, str]:
    """Returns (name, iconPath). iconPath starts with '/' for prepending bungie.net."""
    lang = await _ensure_db(lang)
    data = await asyncio.to_thread(_query, "DestinyInventoryItemDefinition", hash_value, lang)
    if not data:
        return "", ""
    props = data.get("displayProperties", {})
    return props.get("name", ""), props.get("icon", "")


HASH_LOOKUP_TABLES = [
    "DestinyInventoryItemDefinition",
    "DestinyActivityDefinition",
    "DestinyActivityModeDefinition",
    "DestinyDestinationDefinition",
    "DestinyPlaceDefinition",
    "DestinyVendorDefinition",
    "DestinyClassDefinition",
    "DestinyRaceDefinition",
    "DestinyFactionDefinition",
    "DestinyMilestoneDefinition",
]


def _lookup_hash(hash_value: int, lang: str) -> dict | None:
    with _open_db(lang) as con:
        for table in HASH_LOOKUP_TABLES:
            data = _query_con(con, table, hash_value)
            if not data:
                continue
            props = data.get("displayProperties", {})
            name = props.get("name", "")
            if name:
                return {"name": name, "iconPath": props.get("icon", ""), "type": table}
    return None


async def get_hash_display(hash_value: int, lang: str = "en") -> dict | None:
    """Resolve an arbitrary hash by scanning common definition tables.

    Returns {name, iconPath, type} for the first table with a named match, else None.
    """
    lang = await _ensure_db(lang)
    return await asyncio.to_thread(_lookup_hash, hash_value, lang)


async def get_stat_display(hash_value: int, lang: str = "en") -> str:
    lang = await _ensure_db(lang)
    data = await asyncio.to_thread(_query, "DestinyStatDefinition", hash_value, lang)
    if not data:
        return ""
    return data.get("displayProperties", {}).get("name", "")


def _scan_enum_table(table: str, field: str, value: int, lang: str) -> dict | None:
    with _open_db(lang) as con:
        try:
            cur = con.execute(f"SELECT json FROM {table}")  # noqa: S608
            for (row_json,) in cur:
                data = json.loads(row_json)
                if data.get(field) == value:
                    return data
        except sqlite3.OperationalError:
            pass
    return None


def _get_race_info(race_type_int: int, gender_type_int: int, lang: str) -> tuple[str, str]:
    data = _scan_enum_table("DestinyRaceDefinition", "raceType", race_type_int, lang)
    if not data:
        return "", ""
    gender_key = "Male" if gender_type_int == 0 else "Female"
    race_name = data.get("genderedRaceNames", {}).get(
        gender_key, data.get("displayProperties", {}).get("name", "")
    )
    race_desc = data.get("displayProperties", {}).get("description", "")
    return race_name, race_desc


async def get_race_info(race_type_int: int, gender_type_int: int, lang: str = "en") -> tuple[str, str]:
    lang = await _ensure_db(lang)
    return await asyncio.to_thread(_get_race_info, race_type_int, gender_type_int, lang)


def _get_class_name(class_type_int: int, gender_type_int: int, lang: str) -> str:
    data = _scan_enum_table("DestinyClassDefinition", "classType", class_type_int, lang)
    if not data:
        return ""
    gender_key = "Male" if gender_type_int == 0 else "Female"
    return data.get("genderedClassNames", {}).get(
        gender_key, data.get("displayProperties", {}).get("name", "")
    )


async def get_class_name(class_type_int: int, gender_type_int: int, lang: str = "en") -> str:
    lang = await _ensure_db(lang)
    return await asyncio.to_thread(_get_class_name, class_type_int, gender_type_int, lang)
