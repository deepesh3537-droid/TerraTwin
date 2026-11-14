"""Dataset ORM model."""

import uuid
from datetime import datetime, timezone
from typing import List, Optional
from sqlalchemy import Boolean, DateTime, ForeignKey, String, Text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.core.database import Base


class Dataset(Base):
    """Source dataset and provenance metadata per ARCHITECTURE.md §6."""

    __tablename__ = "datasets"

    id: Mapped[str] = mapped_column(
        String(36),
        primary_key=True,
        default=lambda: str(uuid.uuid4()),
    )
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    description: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    planet_id: Mapped[str] = mapped_column(String(32), ForeignKey("planets.id"), nullable=False, index=True)
    category: Mapped[str] = mapped_column(String(64), nullable=False, index=True)
    variable: Mapped[str] = mapped_column(String(64), nullable=False, index=True)

    # Provenance fields (null if unknown per RULES.md §4)
    source_agency: Mapped[Optional[str]] = mapped_column(String(128), nullable=True)
    mission: Mapped[Optional[str]] = mapped_column(String(128), nullable=True)
    instrument: Mapped[Optional[str]] = mapped_column(String(128), nullable=True)
    format: Mapped[Optional[str]] = mapped_column(String(64), nullable=True)
    unit: Mapped[Optional[str]] = mapped_column(String(64), nullable=True)
    native_resolution: Mapped[Optional[str]] = mapped_column(String(64), nullable=True)
    temporal_start: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)
    temporal_end: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)

    # CRS identifier (mandatory per ADR-009)
    coordinate_reference_system: Mapped[str] = mapped_column(String(128), nullable=False)
    processing_level: Mapped[Optional[str]] = mapped_column(String(64), nullable=True)
    license: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    source_url: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    citation: Mapped[Optional[str]] = mapped_column(Text, nullable=True)

    # Storage and verification
    local_path: Mapped[Optional[str]] = mapped_column(String(512), nullable=True)  # relative to DATA_ROOT
    checksum: Mapped[Optional[str]] = mapped_column(String(128), nullable=True)
    ingestion_status: Mapped[str] = mapped_column(String(32), default="pending", nullable=False, index=True)
    quality_notes: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    is_demo: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False, index=True)

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False,
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
        nullable=False,
    )

    # Relationships
    planet: Mapped["Planet"] = relationship("Planet", back_populates="datasets")
    layers: Mapped[List["Layer"]] = relationship("Layer", back_populates="dataset")
