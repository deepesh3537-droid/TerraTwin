"""Region Pydantic schemas."""

from datetime import datetime
from typing import Any, Dict, List, Optional
from pydantic import Field
from app.schemas.common import BaseSchema


class RegionBase(BaseSchema):
    """Base region schema."""

    name: str = Field(max_length=255)
    description: Optional[str] = None
    planet_id: str = Field(description="'earth', 'moon', or 'mars'")
    footprint: Optional[Dict[str, Any]] = Field(default=None, description="GeoJSON geometry dictionary")
    coordinate_reference_system: str = Field(description="Explicit CRS identifier, e.g. EPSG:4326 or IAU2000")
    source_provenance: Optional[str] = None
    tags: Optional[List[str]] = None
    characteristics: Optional[Dict[str, Any]] = Field(default=None, description="Extracted properties; null if not yet computed")
    is_demo: bool = Field(default=False)


class RegionResponse(RegionBase):
    """Region response schema with UUID and timestamps."""

    id: str
    created_at: datetime
    updated_at: datetime
