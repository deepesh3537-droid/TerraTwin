"""API v1 master router aggregating all sub-routers."""

from fastapi import APIRouter
from app.api.v1.health import router as health_router
from app.api.v1.planets import router as planets_router
from app.api.v1.datasets import router as datasets_router
from app.api.v1.layers import router as layers_router
from app.api.v1.regions import router as regions_router
from app.api.v1.analysis import router as analysis_router

api_router = APIRouter()

# Register all API v1 domain sub-routers
api_router.include_router(health_router)
api_router.include_router(planets_router)
api_router.include_router(datasets_router)
api_router.include_router(layers_router)
api_router.include_router(regions_router)
api_router.include_router(analysis_router)
