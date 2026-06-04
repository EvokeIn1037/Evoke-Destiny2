import asyncio
from typing import Literal

from fastapi import APIRouter, HTTPException, Query

from app.models.player import Character, CharacterDetail, CharacterStats, GearItem
from app.services import bungie, manifest

router = APIRouter()

_STAT_HASHES = {
    "mobility": "2996146975",
    "resilience": "392767087",
    "recovery": "1943323491",
    "discipline": "1735777505",
    "intellect": "144602215",
    "strength": "4244567218",
}

# Maps Bungie bucket hash → GearItem slot name, in display order
_SLOT_ORDER: list[tuple[int, Literal["kinetic", "energy", "power", "helmet", "gauntlets", "chest", "legs", "class"]]] = [
    (1498876634, "kinetic"),
    (2465295065, "energy"),
    (953998645, "power"),
    (3448274439, "helmet"),
    (3551918588, "gauntlets"),
    (14239492, "chest"),
    (20886954, "legs"),
    (1585787867, "class"),
]
_BUCKET_TO_SLOT = {bucket: slot for bucket, slot in _SLOT_ORDER}
_SLOT_RANK = {slot: i for i, (_, slot) in enumerate(_SLOT_ORDER)}


async def _build_gear_item(
    item: dict,
    instances: dict,
    lang: str = "en",
) -> GearItem | None:
    bucket_hash = item.get("bucketHash", 0)
    slot = _BUCKET_TO_SLOT.get(bucket_hash)
    if slot is None:
        return None

    item_hash: int = item["itemHash"]
    override_hash: int = item.get("overrideStyleItemHash", 0)
    instance_id: str = item.get("itemInstanceId", "")

    name, base_icon = await manifest.get_item_display(item_hash, lang)
    icon = base_icon
    if override_hash:
        _, override_icon = await manifest.get_item_display(override_hash, lang)
        if override_icon:
            icon = override_icon

    instance = instances.get(instance_id, {})
    light = instance.get("primaryStat", {}).get("value", 0)

    return GearItem(
        itemHash=item_hash,
        name=name,
        iconPath=icon,
        light=light,
        slot=slot,
    )


@router.get("/character/{membership_id}/{character_id}", response_model=CharacterDetail)
async def get_character(
    membership_id: str,
    character_id: str,
    membership_type: int = Query(default=3),
    lang: str = Query(default="en"),
):
    resp = await bungie.get(
        f"/Destiny2/{membership_type}/Profile/{membership_id}/Character/{character_id}/",
        params={"components": "200,205,300"},
    )

    response = resp.get("Response", {})
    char_data = response.get("character", {}).get("data", {})
    if not char_data:
        raise HTTPException(status_code=404, detail="Character not found")

    equip_items = response.get("equipment", {}).get("data", {}).get("items", [])
    instances = (
        response.get("itemComponents", {}).get("instances", {}).get("data", {})
    )

    raw = char_data.get("stats", {})
    character = Character(
        characterId=character_id,
        classType=char_data.get("classType", 0),
        raceType=char_data.get("raceType", 0),
        genderType=char_data.get("genderType", 0),
        light=char_data.get("light", 0),
        emblemBackgroundPath=char_data.get("emblemBackgroundPath", ""),
        dateLastPlayed=char_data.get("dateLastPlayed", ""),
        minutesPlayedTotal=int(char_data.get("minutesPlayedTotal", 0)),
        stats=CharacterStats(
            mobility=raw.get(_STAT_HASHES["mobility"], 0),
            resilience=raw.get(_STAT_HASHES["resilience"], 0),
            recovery=raw.get(_STAT_HASHES["recovery"], 0),
            discipline=raw.get(_STAT_HASHES["discipline"], 0),
            intellect=raw.get(_STAT_HASHES["intellect"], 0),
            strength=raw.get(_STAT_HASHES["strength"], 0),
        ),
    )

    gear_results = await asyncio.gather(
        *(_build_gear_item(item, instances, lang) for item in equip_items)
    )
    gear = sorted(
        (g for g in gear_results if g is not None),
        key=lambda g: _SLOT_RANK.get(g.slot, 99),
    )

    return CharacterDetail(**character.model_dump(), gear=gear)
