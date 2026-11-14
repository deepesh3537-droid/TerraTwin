"""Layer Pydantic schemas."""

from datetime import datetime
from typing import Any, Dict, Optional
from pydantic import Field
from app.schemas.common import BaseSchema


class LayerBase(BaseSchema):
    """Base layer schema."""

    name: str = Field(max_length=255)
    description: Optional[str] = None
    planet_id: str = Field(description="'earth', 'moon', or 'mars'")
    category: str = Field(max_length=64)
    dataset_id: Optional[str] = None
    variable: str = Field(max_length=64)
    unit: Optional[str] = None

    available: bool = Field(default=False)
    rendering_type: str = Field(default="metadata_only", description="'raster', 'vector', or 'metadata_only'")
    rendering_url: Optional[str] = None
    coordinate_reference_system: str
    style: Optional[Dict[str, Any]] = None


class LayerResponse(LayerBase):
    """Layer response schema with UUID and timestamps."""

    id: str
    created_at: datetime
    updated_at: datetime
