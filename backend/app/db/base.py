"""Alembic base metadata aggregator."""

from app.core.database import Base
from app.models.planet import Planet
from app.models.dataset import Dataset
from app.models.layer import Layer
from app.models.region import Region
from app.models.analysis_run import AnalysisRun

# Target metadata for Alembic migrations
target_metadata = Base.metadata

__all__ = [
    "Base",
    "Planet",
    "Dataset",
    "Layer",
    "Region",
    "AnalysisRun",
    "target_metadata",
]
