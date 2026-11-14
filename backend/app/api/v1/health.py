"""Health and system information endpoints."""

from typing import Any, Dict
from fastapi import APIRouter, Response, status
from app.core.config import settings
from app.core.database import check_db_connection

router = APIRouter(tags=["Health & System"])


@router.get("/health/ready", summary="Service and database readiness probe")
def get_readiness(response: Response) -> Dict[str, Any]:
    """Report database connectivity and overall readiness honestly (BE-02, BE-03)."""
    db_connected = check_db_connection()

    if not db_connected:
        response.status_code = status.HTTP_503_SERVICE_UNAVAILABLE
        return {
            "status": "degraded",
            "database": "disconnected",
            "services": {
                "database": "unavailable",
            },
        }

    return {
        "status": "ready",
        "database": "connected",
        "services": {
            "database": "ok",
        },
    }


@router.get("/system/info", summary="System version and module readiness information")
def get_system_info() -> Dict[str, Any]:
    """Report version and module readiness status (BE-04)."""
    return {
        "app_name": settings.APP_NAME,
        "version": settings.APP_VERSION,
        "api_version": "v1",
        "environment": settings.APP_ENV,
        "modules": {
            "catalog": "available",
            "regions": "available",
            "geospatial": "prototype",
            "analysis_features": "not_implemented",
            "analysis_compare": "not_implemented",
            "analysis_similarity": "not_implemented",
            "analysis_suitability": "not_implemented",
            "analysis_rover_testing": "not_implemented",
        },
    }
