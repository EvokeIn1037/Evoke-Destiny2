import httpx
from fastapi import HTTPException

from app.config import settings

_client = httpx.AsyncClient(timeout=httpx.Timeout(30.0))


async def get(path: str, params: dict | None = None) -> dict:
    response = await _client.get(
        f"{settings.bungie_root}{path}",
        headers={"X-API-Key": settings.bungie_api_key},
        params=params,
    )
    try:
        response.raise_for_status()
    except httpx.HTTPStatusError as e:
        raise HTTPException(status_code=e.response.status_code, detail=str(e)) from e
    return response.json()
