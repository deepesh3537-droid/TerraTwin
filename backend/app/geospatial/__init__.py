"""Geospatial extension point package."""

from app.geospatial.interfaces import IRasterService, IVectorService, ICoordinateTransformer
from app.geospatial.coordinate_metadata import (
    BODY_DEFAULT_CRS,
    KNOWN_PLANETARY_CRS,
    get_default_crs,
    validate_body_crs,
)
from app.geospatial.raster_service import RasterService
from app.geospatial.vector_service import VectorService

__all__ = [
    "IRasterService",
    "IVectorService",
    "ICoordinateTransformer",
    "BODY_DEFAULT_CRS",
    "KNOWN_PLANETARY_CRS",
    "get_default_crs",
    "validate_body_crs",
    "RasterService",
    "VectorService",
]
