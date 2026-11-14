"""Tests for API contract and scientific integrity (BE-19 to BE-21)."""

import pytest
from httpx import AsyncClient


@pytest.mark.asyncio
async def test_be_19_openapi_contract_loads(async_client: AsyncClient) -> None:
    """BE-19: /openapi.json and /docs load and serve complete API schema."""
    res_openapi = await async_client.get("/openapi.json")
    assert res_openapi.status_code == 200
    schema = res_openapi.json()
    assert "paths" in schema
    assert "/health" in schema["paths"]
    assert "/api/v1/planets" in schema["paths"]
    assert "/api/v1/datasets" in schema["paths"]
    assert "/api/v1/layers" in schema["paths"]
    assert "/api/v1/regions" in schema["paths"]
    assert "/api/v1/analysis/capabilities" in schema["paths"]
    assert "/api/v1/analysis/similarity" in schema["paths"]

    res_docs = await async_client.get("/docs")
    assert res_docs.status_code == 200


@pytest.mark.asyncio
async def test_be_20_scientific_integrity_no_fabricated_scores(async_client: AsyncClient) -> None:
    """BE-20: Ensure responses do not contain fabricated scores, probabilities, or fake measurements."""
    # Regions characteristics must be null/empty
    res_regions = await async_client.get("/api/v1/regions")
    regions = res_regions.json()["items"]
    for r in regions:
        assert r["characteristics"] is None

    # Capabilities must not claim implemented
    res_cap = await async_client.get("/api/v1/analysis/capabilities")
    for mod, status in res_cap.json()["modules"].items():
        assert status == "not_implemented"


@pytest.mark.asyncio
async def test_be_21_demo_records_marked(async_client: AsyncClient) -> None:
    """BE-21: Demo records have is_demo: true and neutral naming."""
    res_regions = await async_client.get("/api/v1/regions")
    regions = res_regions.json()["items"]
    assert len(regions) > 0
    for r in regions:
        assert r["is_demo"] is True
        assert r["name"].startswith("Demo ")

    res_datasets = await async_client.get("/api/v1/datasets")
    datasets = res_datasets.json()["items"]
    assert len(datasets) > 0
    for d in datasets:
        assert d["is_demo"] is True
        assert d["name"].startswith("Demo ")
