from pydantic import BaseModel


class GearItem(BaseModel):
    itemHash: int
    bucketHash: int
    name: str
    iconPath: str
    light: int


class StatEntry(BaseModel):
    name: str
    value: int


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
    stats: list[StatEntry]  # overrides Character.stats with resolved names
    gear: list[GearItem]
    race_name: str = ""
    race_description: str = ""
    class_name: str = ""


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
