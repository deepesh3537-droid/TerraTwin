"""Raster service scaffold implementing IRasterService (Extension Point)."""

from typing import Any, Dict, Tuple
from app.geospatial.interfaces import IRasterService


class RasterService(IRasterService):
    """Scaffold for GIS teammate to implement raster reading and tiling."""

    def get_raster_metadata(self, local_path: str) -> Dict[str, Any]:
        """Inspect raster metadata. No fake values produced."""
        raise NotImplementedError("Raster processing module is scaffolded but not yet implemented.")

    def extract_window(self, local_path: str, bounds: Tuple[float, float, float, float]) -> Any:
        """Extract spatial raster window."""
        raise NotImplementedError("Raster processing module is scaffolded but not yet implemented.")
