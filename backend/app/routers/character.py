import asyncio

from fastapi import APIRouter, HTTPException, Query

from app.models.player import CharacterDetail, GearItem, StatEntry
from app.services import bungie, manifest

router = APIRouter()

_VALID_BUCKETS = frozenset({
    1498876634,  # kinetic
    2465295065,  # energy
    953998645,   # power
    3448274439,  # helmet
    3551918588,  # gauntlets
    14239492,    # chest
    20886954,    # legs
    1585787867,  # class
})


async def _build_gear_item(item: dict, instances: dict, lang: str = "en") -> GearItem | None:
    bucket_hash = item.get("bucketHash", 0)
    if bucket_hash not in _VALID_BUCKETS:
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
        bucketHash=bucket_hash,
        name=name,
        iconPath=icon,
        light=light,
    )


@router.get("/character/{membership_id}/{character_id}", response_model=CharacterDetail)
async def get_character(
    membership_id: str,
    character_id: str,
    membership_type: int = Query(default=3),
    lang: str = Query(...),
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
    instances = response.get("itemComponents", {}).get("instances", {}).get("data", {})

    gender_type = char_data.get("genderType", 0)
    race_type = char_data.get("raceType", 0)
    class_type = char_data.get("classType", 0)
    raw_stats = {str(k): int(v) for k, v in char_data.get("stats", {}).items()}
    stat_hashes = list(raw_stats.keys())

    stat_names, gear_results, race_info, class_name = await asyncio.gather(
        asyncio.gather(*(manifest.get_stat_display(int(h), lang) for h in stat_hashes)),
        asyncio.gather(*(_build_gear_item(item, instances, lang) for item in equip_items)),
        manifest.get_race_info(race_type, gender_type, lang),
        manifest.get_class_name(class_type, gender_type, lang),
    )

    stats = [StatEntry(name=n or h, value=raw_stats[h]) for h, n in zip(stat_hashes, stat_names)]
    gear = [g for g in gear_results if g is not None]
    race_name, race_desc = race_info
    if race_type == 0:
        race_desc = ""

    return CharacterDetail(
        characterId=character_id,
        classType=class_type,
        raceType=race_type,
        genderType=gender_type,
        light=char_data.get("light", 0),
        emblemBackgroundPath=char_data.get("emblemBackgroundPath", ""),
        dateLastPlayed=char_data.get("dateLastPlayed", ""),
        minutesPlayedTotal=int(char_data.get("minutesPlayedTotal", 0)),
        stats=stats,
        gear=gear,
        race_name=race_name,
        race_description=race_desc,
        class_name=class_name,
    )
