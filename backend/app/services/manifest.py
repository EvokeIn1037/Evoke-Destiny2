import asyncio
import json
import sqlite3
from contextlib import contextmanager
from typing import Generator

from app.config import get_manifest_db_path


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
    data = await asyncio.to_thread(_query, "DestinyActivityDefinition", hash_value, lang)
    if not data:
        return ""
    return data.get("displayProperties", {}).get("name", "")


async def get_item_display(hash_value: int, lang: str = "en") -> tuple[str, str]:
    """Returns (name, iconPath). iconPath starts with '/' for prepending bungie.net."""
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
    return await asyncio.to_thread(_lookup_hash, hash_value, lang)


async def get_stat_display(hash_value: int, lang: str = "en") -> str:
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
    return await asyncio.to_thread(_get_class_name, class_type_int, gender_type_int, lang)
