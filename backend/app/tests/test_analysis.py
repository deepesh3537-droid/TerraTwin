"""Tests for Analysis routes (BE-15 to BE-18)."""

import pytest
from httpx import AsyncClient


@pytest.mark.asyncio
async def test_be_15_analysis_capabilities(async_client: AsyncClient) -> None:
    """BE-15: Capabilities endpoint honestly reports each module as not_implemented."""
    res = await async_client.get("/api/v1/analysis/capabilities")
    assert res.status_code == 200
    data = res.json()
    assert "modules" in data
    assert "supported_dimensions" in data

    # All modules must be honest (not claimed functional)
    for module_name, module_status in data["modules"].items():
        assert module_status == "not_implemented"


@pytest.mark.asyncio
async def test_be_16_analysis_post_valid_payloads_return_501(async_client: AsyncClient) -> None:
    """BE-16: Valid POST request to each analysis route returns 501 with error envelope."""

    # 1. Features
    res = await async_client.post(
        "/api/v1/analysis/features",
        json={
            "region_id": "00000000-0000-0000-0000-000000000001",
            "dataset_ids": ["00000000-0000-0000-0001-000000000001"],
            "features": ["elevation", "slope"],
        },
    )
    assert res.status_code == 501
    assert res.json()["error"]["code"] == "ANALYSIS_NOT_IMPLEMENTED"

    # 2. Compare
    res = await async_client.post(
        "/api/v1/analysis/compare",
        json={
            "reference_region_id": "00000000-0000-0000-0000-000000000002",
            "candidate_region_id": "00000000-0000-0000-0000-000000000001",
            "variables": ["elevation"],
            "weights": {"elevation": 1.0},
        },
    )
    assert res.status_code == 501
    assert res.json()["error"]["code"] == "ANALYSIS_NOT_IMPLEMENTED"

    # 3. Similarity
    res = await async_client.post(
        "/api/v1/analysis/similarity",
        json={
            "target_region_id": "00000000-0000-0000-0000-000000000002",
            "candidate_planet": "earth",
            "variables": ["elevation", "roughness"],
            "limit": 5,
        },
    )
    assert res.status_code == 501
    assert res.json()["error"]["code"] == "ANALYSIS_NOT_IMPLEMENTED"

    # 4. Suitability
    res = await async_client.post(
        "/api/v1/analysis/suitability",
        json={
            "region_id": "00000000-0000-0000-0000-000000000002",
            "criteria": ["low_slope", "high_illumination"],
        },
    )
    assert res.status_code == 501
    assert res.json()["error"]["code"] == "ANALYSIS_NOT_IMPLEMENTED"

    # 5. Rover Testing
    res = await async_client.post(
        "/api/v1/analysis/rover-testing",
        json={
            "target_environment": "lunar_polar_crater",
            "test_capabilities": ["rough_terrain_traction", "low_light_navigation"],
        },
    )
    assert res.status_code == 501
    assert res.json()["error"]["code"] == "ANALYSIS_NOT_IMPLEMENTED"


@pytest.mark.asyncio
async def test_be_17_analysis_post_invalid_payloads_return_422(async_client: AsyncClient) -> None:
    """BE-17: Invalid POST requests fail Pydantic validation and return 422."""
    # Missing required fields
    res = await async_client.post("/api/v1/analysis/features", json={})
    assert res.status_code == 422
    assert res.json()["error"]["code"] == "VALIDATION_ERROR"

    # Empty list where min_length=1 required
    res2 = await async_client.post(
        "/api/v1/analysis/similarity",
        json={
            "target_region_id": "some-id",
            "variables": [],  # invalid: empty
        },
    )
    assert res2.status_code == 422

    # Invalid limit (< 1)
    res3 = await async_client.post(
        "/api/v1/analysis/similarity",
        json={
            "target_region_id": "some-id",
            "variables": ["elevation"],
            "limit": -5,
        },
    )
    assert res3.status_code == 422


@pytest.mark.asyncio
async def test_be_18_analysis_unknown_run_returns_404(async_client: AsyncClient) -> None:
    """BE-18: GET /analysis/runs/{unknown} returns 404, no fake run."""
    res = await async_client.get("/api/v1/analysis/runs/00000000-0000-0000-0000-000000000099")
    assert res.status_code == 404
    assert res.json()["error"]["code"] == "RESOURCE_NOT_FOUND"
