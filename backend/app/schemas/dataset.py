"""Dataset Pydantic schemas."""

from datetime import datetime
from typing import Optional
from pydantic import Field
from app.schemas.common import BaseSchema


class DatasetBase(BaseSchema):
    """Base dataset schema."""

    name: str = Field(max_length=255)
    description: Optional[str] = None
    planet_id: str = Field(description="'earth', 'moon', or 'mars'")
    category: str = Field(max_length=64)
    variable: str = Field(max_length=64)

    # Provenance fields (nullable when unknown per RULES.md §4)
    source_agency: Optional[str] = None
    mission: Optional[str] = None
    instrument: Optional[str] = None
    format: Optional[str] = None
    unit: Optional[str] = None
    native_resolution: Optional[str] = None
    temporal_start: Optional[datetime] = None
    temporal_end: Optional[datetime] = None

    # CRS identifier (mandatory per ADR-009)
    coordinate_reference_system: str = Field(description="Explicit CRS identifier, e.g. EPSG:4326 or IAU2000")
    processing_level: Optional[str] = None
    license: Optional[str] = None
    source_url: Optional[str] = None
    citation: Optional[str] = None

    local_path: Optional[str] = Field(default=None, description="Path relative to DATA_ROOT")
    checksum: Optional[str] = None
    ingestion_status: str = Field(default="pending")
    quality_notes: Optional[str] = None
    is_demo: bool = Field(default=False, description="Flag indicating demo fixture record")


class DatasetResponse(DatasetBase):
    """Dataset response schema with UUID and timestamps."""

    id: str
    created_at: datetime
    updated_at: datetime
