"""Application configuration loaded from environment variables using Pydantic Settings."""

from pathlib import Path
from typing import List, Union
from pydantic import field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Application settings with environment variable fallbacks."""

    model_config = SettingsConfigDict(
        env_file=(".env", "../.env"),
        env_file_encoding="utf-8",
        extra="ignore",
    )

    APP_ENV: str = "development"
    APP_NAME: str = "TerraTwin"
    APP_VERSION: str = "0.1.0"
    DEBUG: bool = True
    API_V1_PREFIX: str = "/api/v1"

    # Database configuration (PostgreSQL + PostGIS)
    DATABASE_URL: str = "postgresql+psycopg://terratwin:change_me@localhost:5432/terratwin"

    # CORS configuration
    CORS_ORIGINS: Union[List[str], str] = ["http://localhost:5173"]

    # Local data storage root (confined per SECURITY.md)
    DATA_ROOT: str = "../data"

    @field_validator("CORS_ORIGINS", mode="before")
    @classmethod
    def assemble_cors_origins(cls, v: Union[str, List[str]]) -> List[str]:
        if isinstance(v, str) and not v.startswith("["):
            return [i.strip() for i in v.split(",") if i.strip()]
        elif isinstance(v, (list, str)):
            return v  # type: ignore
        raise ValueError(v)

    @property
    def resolved_data_root(self) -> Path:
        """Resolve DATA_ROOT path relative to backend root."""
        return Path(self.DATA_ROOT).resolve()


settings = Settings()
