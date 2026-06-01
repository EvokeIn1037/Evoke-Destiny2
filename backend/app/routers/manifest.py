from fastapi import APIRouter, HTTPException

from app.services import manifest

router = APIRouter(prefix="/manifest")


@router.get("/activity/{hash_value}")
async def get_activity(hash_value: int) -> dict:
    name = await manifest.get_activity_name(hash_value)
    if not name:
        raise HTTPException(status_code=404, detail="Activity hash not found")
    return {"name": name}


@router.get("/item/{hash_value}")
async def get_item(hash_value: int) -> dict:
    name, icon_path = await manifest.get_item_display(hash_value)
    if not name:
        raise HTTPException(status_code=404, detail="Item hash not found")
    return {"name": name, "iconPath": icon_path}
