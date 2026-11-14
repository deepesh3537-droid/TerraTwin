"""Layer ORM model."""

import uuid
from datetime import datetime, timezone
from typing import Any, Dict, Optional
from sqlalchemy import Boolean, DateTime, ForeignKey, JSON, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.core.database import Base


class Layer(Base):
    """Display/analysis layer for a planetary body per ARCHITECTURE.md §6."""

    __tablename__ = "layers"

    id: Mapped[str] = mapped_column(
        String(36),
        primary_key=True,
        default=lambda: str(uuid.uuid4()),
    )
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    description: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    planet_id: Mapped[str] = mapped_column(String(32), ForeignKey("planets.id"), nullable=False, index=True)
    category: Mapped[str] = mapped_column(String(64), nullable=False, index=True)
    dataset_id: Mapped[Optional[str]] = mapped_column(String(36), ForeignKey("datasets.id"), nullable=True, index=True)
    variable: Mapped[str] = mapped_column(String(64), nullable=False, index=True)
    unit: Mapped[Optional[str]] = mapped_column(String(64), nullable=True)

    # Rendering availability & configuration
    available: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False, index=True)
    rendering_type: Mapped[str] = mapped_column(String(32), default="metadata_only", nullable=False)  # raster | vector | metadata_only
    rendering_url: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    coordinate_reference_system: Mapped[str] = mapped_column(String(128), nullable=False)
    style: Mapped[Optional[Dict[str, Any]]] = mapped_column(JSON, nullable=True)

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
    planet: Mapped["Planet"] = relationship("Planet", back_populates="layers")
    dataset: Mapped[Optional["Dataset"]] = relationship("Dataset", back_populates="layers")
