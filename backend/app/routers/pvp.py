import asyncio

from fastapi import APIRouter, Query

from app.models.pvp import PvpActivity
from app.services import bungie, manifest

router = APIRouter()

# Trials of Osiris lab map director hash
_TRIALS_LAB_HASH = 1728343233
_TRIALS_MODE = 84


async def _resolve_activities(activities: list[dict], mode: int, lang: str = "en") -> list[PvpActivity]:
    hashes = list({a["activityDetails"]["referenceId"] for a in activities})
    names = await asyncio.gather(*(manifest.get_activity_name(h, lang) for h in hashes))
    name_cache = dict(zip(hashes, names))

    result = []
    for act in activities:
        details = act.get("activityDetails", {})
        values = act.get("values", {})
        ref_hash = details.get("referenceId", 0)
        map_name = name_cache.get(ref_hash, "")

        is_trials_lab = (
            mode == _TRIALS_MODE
            and details.get("directorActivityHash") == _TRIALS_LAB_HASH
        )

        result.append(
            PvpActivity(
                activityHash=ref_hash,
                mapName=map_name,
                kills=int(values.get("kills", {}).get("basic", {}).get("value", 0)),
                deaths=int(values.get("deaths", {}).get("basic", {}).get("value", 0)),
                assists=int(values.get("assists", {}).get("basic", {}).get("value", 0)),
                killsDeathsRatio=values.get("killsDeathsRatio", {}).get("basic", {}).get("value", 0.0),
                killsDeathsAssists=values.get("killsDeathsAssists", {}).get("basic", {}).get("value", 0.0),
                efficiency=values.get("efficiency", {}).get("basic", {}).get("value", 0.0),
                period=act.get("period", ""),
                isTrialsLab=is_trials_lab,
            )
        )
    return result


@router.get("/pvp/{membership_id}/{character_id}", response_model=list[PvpActivity])
async def get_pvp_activities(
    membership_id: str,
    character_id: str,
    mode: int = Query(...),
    membership_type: int = Query(default=3),
    lang: str = Query(default="en"),
):
    resp = await bungie.get(
        f"/Destiny2/{membership_type}/Account/{membership_id}/Character/{character_id}/Stats/Activities/",
        params={"mode": mode},
    )
    activities = resp.get("Response", {}).get("activities", [])
    if not activities:
        return []
    return await _resolve_activities(activities, mode, lang)
