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
