import asyncio
import json
import sqlite3

from app.config import get_manifest_db_path


def _hash_to_id(hash_value: int) -> int:
    id_ = int(hash_value)
    if id_ & (1 << 31):
        id_ -= 1 << 32
    return id_


def _query(table: str, hash_value: int, lang: str = "en") -> dict | None:
    id_ = _hash_to_id(hash_value)
    try:
        con = sqlite3.connect(get_manifest_db_path(lang))
        cur = con.execute(f"SELECT json FROM {table} WHERE id = ?", (id_,))  # noqa: S608
        row = cur.fetchone()
        con.close()
        if not row:
            return None
        return json.loads(row[0])
    except Exception:
        return None


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
    for table in HASH_LOOKUP_TABLES:
        data = _query(table, hash_value, lang)
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
