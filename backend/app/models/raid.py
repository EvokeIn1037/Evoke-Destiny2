from pydantic import BaseModel


class RaidActivity(BaseModel):
    activityHash: int
    completed: bool
    kills: int
    deaths: int
    assists: int
    durationSeconds: int
    period: str
