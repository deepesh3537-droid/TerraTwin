"""Vector service scaffold implementing IVectorService (Extension Point)."""

from typing import Any, Dict
from app.geospatial.interfaces import IVectorService


class VectorService(IVectorService):
    """Scaffold for GIS teammate to implement vector reprojection."""

    def reproject_geometry(
        self,
        geometry: Dict[str, Any],
        source_crs: str,
        target_crs: str,
    ) -> Dict[str, Any]:
        """Reproject geometry respecting body CRS. No fake processing."""
        raise NotImplementedError("Vector reprojection module is scaffolded but not yet implemented.")
