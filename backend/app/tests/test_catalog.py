"""Tests for Planets, Datasets, and Layers endpoints (BE-05 to BE-12)."""

import pytest
from httpx import AsyncClient


@pytest.mark.asyncio
async def test_be_05_list_planets(async_client: AsyncClient) -> None:
    """BE-05: GET /api/v1/planets returns exactly earth, moon, mars."""
    response = await async_client.get("/api/v1/planets")
    assert response.status_code == 200
    planets = response.json()
    assert len(planets) == 3
    planet_ids = {p["id"] for p in planets}
    assert planet_ids == {"earth", "moon", "mars"}


@pytest.mark.asyncio
async def test_be_06_unknown_planet(async_client: AsyncClient) -> None:
    """BE-06: GET /api/v1/planets/unknown returns 404 and structured error envelope."""
    response = await async_client.get("/api/v1/planets/jupiter")
    assert response.status_code == 404
    error = response.json()["error"]
    assert error["code"] == "RESOURCE_NOT_FOUND"
    assert "jupiter" in error["message"]


@pytest.mark.asyncio
async def test_be_07_empty_catalog(empty_client: AsyncClient) -> None:
    """BE-07: List datasets with empty catalog returns 200, empty list, and pagination fields."""
    response = await empty_client.get("/api/v1/datasets")
    assert response.status_code == 200
    data = response.json()
    assert data["items"] == []
    assert data["total"] == 0
    assert data["limit"] == 20
    assert data["offset"] == 0


@pytest.mark.asyncio
async def test_be_08_filter_datasets(async_client: AsyncClient) -> None:
    """BE-08: Filter datasets by planet, category, variable, status."""
    # Matching filter
    res = await async_client.get("/api/v1/datasets?planet=earth&category=terrain_elevation")
    assert res.status_code == 200
    items = res.json()["items"]
    assert len(items) == 1
    assert items[0]["planet_id"] == "earth"
    assert items[0]["category"] == "terrain_elevation"

    # Non-matching filter
    res_none = await async_client.get("/api/v1/datasets?planet=mars&category=terrain_elevation")
    assert res_none.status_code == 200
    assert res_none.json()["items"] == []


@pytest.mark.asyncio
async def test_be_09_pagination(async_client: AsyncClient) -> None:
    """BE-09: limit and offset pagination; invalid values -> 422."""
    res = await async_client.get("/api/v1/datasets?limit=10&offset=0")
    assert res.status_code == 200
    assert res.json()["limit"] == 10

    # Invalid limit (< 1)
    res_inv = await async_client.get("/api/v1/datasets?limit=0")
    assert res_inv.status_code == 422
    assert res_inv.json()["error"]["code"] == "VALIDATION_ERROR"

    # Invalid offset (< 0)
    res_inv2 = await async_client.get("/api/v1/datasets?offset=-1")
    assert res_inv2.status_code == 422


@pytest.mark.asyncio
async def test_be_10_unknown_dataset(async_client: AsyncClient) -> None:
    """BE-10: GET /api/v1/datasets/{unknown} returns 404."""
    response = await async_client.get("/api/v1/datasets/00000000-0000-0000-0000-000000000099")
    assert response.status_code == 404
    assert response.json()["error"]["code"] == "RESOURCE_NOT_FOUND"


@pytest.mark.asyncio
async def test_be_11_list_layers(async_client: AsyncClient) -> None:
    """BE-11: List and filter layers by planet, category, available."""
    res = await async_client.get("/api/v1/layers?planet=earth")
    assert res.status_code == 200
    layers = res.json()
    assert len(layers) == 1
    assert layers[0]["planet_id"] == "earth"

    res_avail = await async_client.get("/api/v1/layers?available=true")
    assert res_avail.status_code == 200
    assert res_avail.json() == []


@pytest.mark.asyncio
async def test_be_12_layer_rendering_url_null_where_unavailable(async_client: AsyncClient) -> None:
    """BE-12: rendering_url is null when available=False; not claimed renderable."""
    res = await async_client.get("/api/v1/layers?planet=earth")
    layer = res.json()[0]
    assert layer["available"] is False
    assert layer["rendering_url"] is None
