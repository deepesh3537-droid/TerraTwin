"""Geospatial processing interfaces and extension points (Member 2: GIS Ingestion)."""

from abc import ABC, abstractmethod
from typing import Any, Dict, Optional, Tuple


class IRasterService(ABC):
    """Interface for raster reading, windowing, and tile generation."""

    @abstractmethod
    def get_raster_metadata(self, local_path: str) -> Dict[str, Any]:
        """Inspect raster headers and CRS without loading full dataset into memory."""
        raise NotImplementedError("Raster metadata inspection not implemented.")

    @abstractmethod
    def extract_window(self, local_path: str, bounds: Tuple[float, float, float, float]) -> Any:
        """Extract spatial window corresponding to geographic bounds."""
        raise NotImplementedError("Raster window extraction not implemented.")


class IVectorService(ABC):
    """Interface for vector geometries, reprojection, and spatial filtering."""

    @abstractmethod
    def reproject_geometry(
        self,
        geometry: Dict[str, Any],
        source_crs: str,
        target_crs: str,
    ) -> Dict[str, Any]:
        """Reproject geometry from source CRS to target CRS (body-specific)."""
        raise NotImplementedError("Body-specific vector reprojection not implemented.")


class ICoordinateTransformer(ABC):
    """Interface for planetary coordinate transformations."""

    @abstractmethod
    def transform_coordinates(
        self,
        x: float,
        y: float,
        source_crs: str,
        target_crs: str,
        body: str,
    ) -> Tuple[float, float]:
        """Transform coordinate tuple respecting body ellipsoid and datum."""
        raise NotImplementedError("Coordinate transformation not implemented.")
