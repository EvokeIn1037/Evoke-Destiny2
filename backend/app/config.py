from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    bungie_api_key: str
    manifest_db_path: str = "./app/db/manifest.db"
    cors_origins: str = "http://localhost:5173"
    bungie_root: str = "https://www.bungie.net/Platform"

    model_config = {"env_file": ".env", "case_sensitive": False}


settings = Settings()
