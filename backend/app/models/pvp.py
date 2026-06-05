from pydantic import BaseModel


class PvpActivity(BaseModel):
    activityHash: int
    activityDirectorHash: int
    standing: int
    kills: int
    deaths: int
    assists: int
    killsDeathsRatio: float
    killsDeathsAssists: float
    efficiency: float
    period: str
