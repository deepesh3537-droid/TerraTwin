"""FastAPI application entrypoint for TerraTwin."""

from contextlib import asynccontextmanager
from typing import AsyncGenerator, Dict
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.router import api_router
from app.core.config import settings
from app.core.errors import register_error_handlers
from app.core.logging import logger, setup_logging


@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncGenerator[None, None]:
    """Application lifecycle management."""
    setup_logging()
    logger.info(f"Starting {settings.APP_NAME} v{settings.APP_VERSION} (Env: {settings.APP_ENV})")
    yield
    logger.info(f"Shutting down {settings.APP_NAME}")


app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description="TerraTwin API: Planetary Terrestrial Analog Identification Platform",
    docs_url="/docs",
    openapi_url="/openapi.json",
    lifespan=lifespan,
)

# CORS Middleware (confined to configured origins per SECURITY.md §6)
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register centralized error handlers (enforces error envelope, hides stack traces)
register_error_handlers(app)


# Root unversioned health endpoint (BE-01)
@app.get("/health", tags=["Health & System"], summary="Root liveness probe")
def get_root_health() -> Dict[str, str]:
    """Report process health status."""
    return {
        "status": "ok",
        "app": settings.APP_NAME,
    }


# Include versioned API routes under /api/v1
app.include_router(api_router, prefix=settings.API_V1_PREFIX)
