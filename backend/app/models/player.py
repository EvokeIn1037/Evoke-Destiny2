from pydantic import BaseModel


class GearItem(BaseModel):
    itemHash: int
    bucketHash: int
    name: str
    iconPath: str
    light: int


class Character(BaseModel):
    characterId: str
    classType: int
    raceType: int
    genderType: int
    light: int
    emblemBackgroundPath: str
    dateLastPlayed: str
    minutesPlayedTotal: int
    stats: dict[str, int]


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
