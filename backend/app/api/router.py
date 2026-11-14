"""API v1 master router aggregating all sub-routers."""

from fastapi import APIRouter
from app.api.v1.health import router as health_router

api_router = APIRouter()

# Include versioned sub-routers
api_router.include_router(health_router)
