from pydantic import BaseModel


class RaidActivity(BaseModel):
    activityHash: int
    raidName: str
    completed: bool
    kills: int
    deaths: int
    assists: int
    duration: str
    period: str
