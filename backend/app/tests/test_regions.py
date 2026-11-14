"""Tests for Regions endpoints (BE-13, BE-14)."""

import pytest
from httpx import AsyncClient


@pytest.mark.asyncio
async def test_be_13_list_and_search_regions(async_client: AsyncClient) -> None:
    """BE-13: List regions, filter by planet, and keyword search."""
    # List all
    res = await async_client.get("/api/v1/regions")
    assert res.status_code == 200
    data = res.json()
    assert data["total"] == 3
    assert len(data["items"]) == 3

    # Filter by planet
    res_moon = await async_client.get("/api/v1/regions?planet=moon")
    assert res_moon.status_code == 200
    items_moon = res_moon.json()["items"]
    assert len(items_moon) == 1
    assert items_moon[0]["planet_id"] == "moon"
    assert items_moon[0]["name"] == "Demo Lunar Region"

    # Search filter
    res_search = await async_client.get("/api/v1/regions?search=Martian")
    assert res_search.status_code == 200
    items_search = res_search.json()["items"]
    assert len(items_search) == 1
    assert items_search[0]["name"] == "Demo Martian Region"


@pytest.mark.asyncio
async def test_be_14_region_detail_and_subroutes(async_client: AsyncClient) -> None:
    """BE-14: Region detail, /datasets, /layers; unknown ID -> 404."""
    region_id = "00000000-0000-0000-0000-000000000001"

    # Detail
    res = await async_client.get(f"/api/v1/regions/{region_id}")
    assert res.status_code == 200
    data = res.json()
    assert data["id"] == region_id
    assert data["planet_id"] == "earth"
    assert data["coordinate_reference_system"] == "EPSG:4326"

    # Sub-route datasets
    res_datasets = await async_client.get(f"/api/v1/regions/{region_id}/datasets")
    assert res_datasets.status_code == 200
    assert len(res_datasets.json()) >= 1

    # Sub-route layers
    res_layers = await async_client.get(f"/api/v1/regions/{region_id}/layers")
    assert res_layers.status_code == 200
    assert len(res_layers.json()) >= 1

    # Unknown region ID
    res_unknown = await async_client.get("/api/v1/regions/00000000-0000-0000-0000-000000000099")
    assert res_unknown.status_code == 404
    assert res_unknown.json()["error"]["code"] == "RESOURCE_NOT_FOUND"

    # Unknown subroute
    res_unknown_sub = await async_client.get("/api/v1/regions/00000000-0000-0000-0000-000000000099/datasets")
    assert res_unknown_sub.status_code == 404
