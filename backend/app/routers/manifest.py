import asyncio

from fastapi import APIRouter, HTTPException, Query

from app.config import SUPPORTED_LOCALES
from app.services import manifest

router = APIRouter(prefix="/manifest")


@router.get("/activity/{hash_value}")
async def get_activity(hash_value: int, lang: str = Query(default="en")) -> dict:
    if lang not in SUPPORTED_LOCALES:
        raise HTTPException(status_code=400, detail="Unsupported language")
    name = await manifest.get_activity_name(hash_value, lang)
    if not name:
        raise HTTPException(status_code=404, detail="Activity hash not found")
    return {"name": name}


@router.get("/item/{hash_value}")
async def get_item(hash_value: int, lang: str = Query(default="en")) -> dict:
    if lang not in SUPPORTED_LOCALES:
        raise HTTPException(status_code=400, detail="Unsupported language")
    name, icon_path = await manifest.get_item_display(hash_value, lang)
    if not name:
        raise HTTPException(status_code=404, detail="Item hash not found")
    return {"name": name, "iconPath": icon_path}


@router.get("/hash/{hash_value}")
async def get_hash(hash_value: int, lang: str = Query(default="en")) -> dict:
    if lang not in SUPPORTED_LOCALES:
        raise HTTPException(status_code=400, detail="Unsupported language")
    result = await manifest.get_hash_display(hash_value, lang)
    if not result:
        raise HTTPException(status_code=404, detail="Hash not found")
    return result


@router.get("/batch")
async def get_batch(hashes: str = Query(...), lang: str = Query(default="en")) -> dict[str, str]:
    if lang not in SUPPORTED_LOCALES:
        raise HTTPException(status_code=400, detail="Unsupported language")
    hash_list: list[int] = []
    for raw in hashes.split(","):
        raw = raw.strip()
        if not raw:
            continue
        try:
            hash_list.append(int(raw))
        except ValueError:
            continue
    if not hash_list:
        return {}
    names = await asyncio.gather(*(manifest.get_activity_name(h, lang) for h in hash_list))
    return {str(h): name for h, name in zip(hash_list, names)}
