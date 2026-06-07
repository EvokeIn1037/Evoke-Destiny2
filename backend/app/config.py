import os

from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    bungie_api_key: str
    manifest_db_path: str = "./app/db/world_sql_content_en.sqlite"
    cors_origins: str = "http://localhost:5173"
    bungie_root: str = "https://www.bungie.net/Platform"

    model_config = {"env_file": ".env", "case_sensitive": False}


settings = Settings()

SUPPORTED_LOCALES = ["en", "fr", "es", "es-mx", "de", "it", "ja", "pt-br", "ru", "pl", "ko", "zh-cht", "zh-chs"]


def get_manifest_db_path(lang: str = "en") -> str:
    if lang not in SUPPORTED_LOCALES:
        raise ValueError(f"Unsupported locale: {lang}")
    path = f"./app/db/world_sql_content_{lang}.sqlite"
    if not os.path.exists(path):
        return "./app/db/world_sql_content_en.sqlite"
    return path
