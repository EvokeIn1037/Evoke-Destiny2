from fastapi import APIRouter, Query

from app.models.pvp import PvpActivity
from app.services import bungie

router = APIRouter()


@router.get("/pvp/{membership_id}/{character_id}", response_model=list[PvpActivity])
async def get_pvp_activities(
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
            PvpActivity(
                activityHash=details.get("referenceId", 0),
                activityDirectorHash=details.get("directorActivityHash", 0),
                standing=int(values.get("standing", {}).get("basic", {}).get("value", 2)),
                kills=int(values.get("kills", {}).get("basic", {}).get("value", 0)),
                deaths=int(values.get("deaths", {}).get("basic", {}).get("value", 0)),
                assists=int(values.get("assists", {}).get("basic", {}).get("value", 0)),
                killsDeathsRatio=values.get("killsDeathsRatio", {}).get("basic", {}).get("value", 0.0),
                killsDeathsAssists=values.get("killsDeathsAssists", {}).get("basic", {}).get("value", 0.0),
                efficiency=values.get("efficiency", {}).get("basic", {}).get("value", 0.0),
                period=act.get("period", ""),
            )
        )
    return result
