from typing import Literal

from pydantic import BaseModel


class CharacterStats(BaseModel):
    mobility: int
    resilience: int
    recovery: int
    discipline: int
    intellect: int
    strength: int


class GearItem(BaseModel):
    itemHash: int
    name: str
    iconPath: str
    light: int
    slot: Literal["kinetic", "energy", "power", "helmet", "gauntlets", "chest", "legs", "class"]


class Character(BaseModel):
    characterId: str
    classType: int
    raceType: int
    genderType: int
    light: int
    emblemBackgroundPath: str
    dateLastPlayed: str
    minutesPlayedTotal: int
    stats: CharacterStats


class CharacterDetail(Character):
    gear: list[GearItem]


class ClanInfo(BaseModel):
    name: str
    callsign: str
    memberCount: int
    motto: str
    about: str
    bannerPath: str


class PlayerProfile(BaseModel):
    membershipId: str
    membershipType: int
    displayName: str
    characters: list[Character]
    clan: ClanInfo | None
