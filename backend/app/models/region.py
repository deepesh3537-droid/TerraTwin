"""Region ORM model."""

import uuid
from datetime import datetime, timezone
from typing import Any, Dict, List, Optional
from sqlalchemy import Boolean, DateTime, ForeignKey, JSON, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.core.database import Base


class Region(Base):
    """Named area of interest on a planetary body per ARCHITECTURE.md §6."""

    __tablename__ = "regions"

    id: Mapped[str] = mapped_column(
        String(36),
        primary_key=True,
        default=lambda: str(uuid.uuid4()),
    )
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    description: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    planet_id: Mapped[str] = mapped_column(String(32), ForeignKey("planets.id"), nullable=False, index=True)

    # Footprint / Coordinates geometry (GeoJSON dict or polygon coordinates)
    # Stored alongside explicit CRS identifier per ADR-009
    footprint: Mapped[Optional[Dict[str, Any]]] = mapped_column(JSON, nullable=True)
    coordinate_reference_system: Mapped[str] = mapped_column(String(128), nullable=False)

    source_provenance: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    tags: Mapped[Optional[List[str]]] = mapped_column(JSON, nullable=True)

    # Pre-computed or extracted characteristics (null/empty until computed; no fabricated values)
    characteristics: Mapped[Optional[Dict[str, Any]]] = mapped_column(JSON, nullable=True)

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
    planet: Mapped["Planet"] = relationship("Planet", back_populates="regions")
