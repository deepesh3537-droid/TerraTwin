"""Planet Pydantic schemas."""

from datetime import datetime
from typing import Optional
from pydantic import Field
from app.schemas.common import BaseSchema


class PlanetBase(BaseSchema):
    """Base planet schema."""

    id: str = Field(description="Body identifier: 'earth', 'moon', or 'mars'")
    name: str = Field(description="Body display name")
    description: Optional[str] = None
    radius_km: Optional[float] = None


class PlanetResponse(PlanetBase):
    """Planet detail response schema."""

    created_at: datetime
    updated_at: datetime
