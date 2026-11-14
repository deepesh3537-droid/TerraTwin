"""Planet ORM model."""

from datetime import datetime, timezone
from typing import List, Optional
from sqlalchemy import DateTime, Float, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.core.database import Base


class Planet(Base):
    """Supported planetary bodies: earth, moon, mars."""

    __tablename__ = "planets"

    id: Mapped[str] = mapped_column(String(32), primary_key=True)  # 'earth', 'moon', 'mars'
    name: Mapped[str] = mapped_column(String(64), nullable=False)
    description: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    radius_km: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
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
    datasets: Mapped[List["Dataset"]] = relationship("Dataset", back_populates="planet", cascade="all, delete-orphan")
    layers: Mapped[List["Layer"]] = relationship("Layer", back_populates="planet", cascade="all, delete-orphan")
    regions: Mapped[List["Region"]] = relationship("Region", back_populates="planet", cascade="all, delete-orphan")
