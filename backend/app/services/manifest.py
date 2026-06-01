import asyncio
import json
import sqlite3

from app.config import settings


def _hash_to_id(hash_value: int) -> int:
    id_ = int(hash_value)
    if id_ & (1 << 31):
        id_ -= 1 << 32
    return id_


def _query(table: str, hash_value: int) -> dict | None:
    id_ = _hash_to_id(hash_value)
    try:
        con = sqlite3.connect(settings.manifest_db_path)
        cur = con.execute(f"SELECT json FROM {table} WHERE id = ?", (id_,))  # noqa: S608
        row = cur.fetchone()
        con.close()
        if not row:
            return None
        return json.loads(row[0])
    except Exception:
        return None


async def get_activity_name(hash_value: int) -> str:
    data = await asyncio.to_thread(_query, "DestinyActivityDefinition", hash_value)
    if not data:
        return ""
    return data.get("displayProperties", {}).get("name", "")


async def get_item_display(hash_value: int) -> tuple[str, str]:
    """Returns (name, iconPath). iconPath starts with '/' for prepending bungie.net."""
    data = await asyncio.to_thread(_query, "DestinyInventoryItemDefinition", hash_value)
    if not data:
        return "", ""
    props = data.get("displayProperties", {})
    return props.get("name", ""), props.get("icon", "")
