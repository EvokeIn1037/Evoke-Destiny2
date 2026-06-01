from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.routers import character, manifest, player, pvp, raid

app = FastAPI(title="Evoke's Destiny Finder API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins.split(","),
    allow_methods=["GET"],
    allow_headers=["*"],
)

app.include_router(player.router, prefix="/api")
app.include_router(character.router, prefix="/api")
app.include_router(pvp.router, prefix="/api")
app.include_router(raid.router, prefix="/api")
app.include_router(manifest.router, prefix="/api")
