import asyncio

from fastapi import APIRouter, HTTPException, Query

from app.models.player import Character, CharacterStats, ClanInfo, PlayerProfile
from app.services import bungie

router = APIRouter()

_STAT_HASHES = {
    "mobility": "2996146975",
    "resilience": "392767087",
    "recovery": "1943323491",
    "discipline": "1735777505",
    "intellect": "144602215",
    "strength": "4244567218",
}


def _parse_character(char_id: str, data: dict) -> Character:
    raw = data.get("stats", {})
    return Character(
        characterId=char_id,
        classType=data.get("classType", 0),
        raceType=data.get("raceType", 0),
        genderType=data.get("genderType", 0),
        light=data.get("light", 0),
        emblemBackgroundPath=data.get("emblemBackgroundPath", ""),
        dateLastPlayed=data.get("dateLastPlayed", ""),
        minutesPlayedTotal=int(data.get("minutesPlayedTotal", 0)),
        stats=CharacterStats(
            mobility=raw.get(_STAT_HASHES["mobility"], 0),
            resilience=raw.get(_STAT_HASHES["resilience"], 0),
            recovery=raw.get(_STAT_HASHES["recovery"], 0),
            discipline=raw.get(_STAT_HASHES["discipline"], 0),
            intellect=raw.get(_STAT_HASHES["intellect"], 0),
            strength=raw.get(_STAT_HASHES["strength"], 0),
        ),
    )


def _parse_clan(resp: dict) -> ClanInfo | None:
    if resp.get("totalResults", 0) == 0:
        return None
    results = resp.get("results", [])
    if not results:
        return None
    group = results[0].get("group", {})
    clan_info = group.get("clanInfo", {})
    return ClanInfo(
        name=group.get("name", ""),
        callsign=clan_info.get("clanCallsign", ""),
        memberCount=group.get("memberCount", 0),
        motto=group.get("motto", ""),
        about=group.get("about", ""),
        bannerPath=group.get("bannerPath", ""),
    )


@router.get("/player/search", response_model=PlayerProfile)
async def search_player(name: str = Query(...)):
    encoded = name.replace("#", "%23")
    search_resp = await bungie.get(f"/Destiny2/SearchDestinyPlayer/-1/{encoded}/")
    players = search_resp.get("Response", [])

    if not players:
        raise HTTPException(status_code=404, detail="Player not found")

    player = players[0]
    membership_id: str = player["membershipId"]
    membership_type: int = player["membershipType"]

    global_name = player.get("bungieGlobalDisplayName", "")
    name_code = player.get("bungieGlobalDisplayNameCode")
    display_name = (
        f"{global_name}#{name_code}" if global_name and name_code is not None
        else player.get("displayName", "")
    )

    profile_resp, clan_resp = await asyncio.gather(
        bungie.get(
            f"/Destiny2/{membership_type}/Profile/{membership_id}/",
            params={"components": "200"},
        ),
        bungie.get(f"/GroupV2/User/{membership_type}/{membership_id}/0/1/"),
    )

    chars_raw = profile_resp.get("Response", {}).get("characters", {}).get("data", {})
    characters = [_parse_character(cid, data) for cid, data in chars_raw.items()]

    clan = _parse_clan(clan_resp.get("Response", {}))

    return PlayerProfile(
        membershipId=membership_id,
        membershipType=membership_type,
        displayName=display_name,
        characters=characters,
        clan=clan,
    )
