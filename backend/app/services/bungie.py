import httpx

from app.config import settings

_client = httpx.AsyncClient(timeout=httpx.Timeout(30.0))


async def get(path: str, params: dict | None = None) -> dict:
    response = await _client.get(
        f"{settings.bungie_root}{path}",
        headers={"X-API-Key": settings.bungie_api_key},
        params=params,
    )
    response.raise_for_status()
    return response.json()
