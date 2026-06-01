from pydantic import BaseModel


class PvpActivity(BaseModel):
    activityHash: int
    mapName: str
    kills: int
    deaths: int
    assists: int
    killsDeathsRatio: float
    killsDeathsAssists: float
    efficiency: float
    period: str
    isTrialsLab: bool
