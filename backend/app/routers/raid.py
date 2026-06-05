from fastapi import APIRouter, Query

from app.models.raid import RaidActivity
from app.services import bungie

router = APIRouter()


@router.get("/raid/{membership_id}/{character_id}", response_model=list[RaidActivity])
async def get_raid_activities(
    membership_id: str,
    character_id: str,
    mode: int = Query(...),
    membership_type: int = Query(default=3),
):
    resp = await bungie.get(
        f"/Destiny2/{membership_type}/Account/{membership_id}/Character/{character_id}/Stats/Activities/",
        params={"mode": mode},
    )
    activities = resp.get("Response", {}).get("activities", [])
    if not activities:
        return []

    result = []
    for act in activities:
        details = act.get("activityDetails", {})
        values = act.get("values", {})
        result.append(
            RaidActivity(
                activityHash=details.get("referenceId", 0),
                completed=bool(values.get("completed", {}).get("basic", {}).get("value", 0)),
                kills=int(values.get("kills", {}).get("basic", {}).get("value", 0)),
                deaths=int(values.get("deaths", {}).get("basic", {}).get("value", 0)),
                assists=int(values.get("assists", {}).get("basic", {}).get("value", 0)),
                durationSeconds=int(values.get("activityDurationSeconds", {}).get("basic", {}).get("value", 0)),
                period=act.get("period", ""),
            )
        )
    return result
