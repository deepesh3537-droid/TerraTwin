"""Tests for health and system info endpoints (TEST_PLAN.md BE-01 to BE-04)."""

import pytest
from unittest.mock import patch
from httpx import AsyncClient


@pytest.mark.asyncio
async def test_be_01_root_health(async_client: AsyncClient) -> None:
    """BE-01: GET /health returns 200 and process healthy status."""
    response = await async_client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "ok"
    assert "app" in data


@pytest.mark.asyncio
async def test_be_02_health_ready_db_up(async_client: AsyncClient) -> None:
    """BE-02: GET /api/v1/health/ready returns 200 when DB is connected."""
    with patch("app.api.v1.health.check_db_connection", return_value=True):
        response = await async_client.get("/api/v1/health/ready")
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "ready"
        assert data["database"] == "connected"
        assert data["services"]["database"] == "ok"


@pytest.mark.asyncio
async def test_be_03_health_ready_db_down(async_client: AsyncClient) -> None:
    """BE-03: GET /api/v1/health/ready reports failure honestly (503) when DB is unreachable."""
    with patch("app.api.v1.health.check_db_connection", return_value=False):
        response = await async_client.get("/api/v1/health/ready")
        assert response.status_code == 503
        data = response.json()
        assert data["status"] == "degraded"
        assert data["database"] == "disconnected"
        assert data["services"]["database"] == "unavailable"


@pytest.mark.asyncio
async def test_be_04_system_info(async_client: AsyncClient) -> None:
    """BE-04: GET /api/v1/system/info returns version and module readiness."""
    response = await async_client.get("/api/v1/system/info")
    assert response.status_code == 200
    data = response.json()
    assert data["app_name"] == "TerraTwin"
    assert data["api_version"] == "v1"
    assert "version" in data
    assert "modules" in data
    assert data["modules"]["catalog"] == "available"
    assert data["modules"]["analysis_features"] == "not_implemented"
