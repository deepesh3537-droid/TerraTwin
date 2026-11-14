"""Pytest fixtures for backend tests."""

import pytest_asyncio
import httpx
from app.main import app


@pytest_asyncio.fixture
async def async_client():
    """Async HTTP client fixture with ASGITransport."""
    async with httpx.AsyncClient(
        transport=httpx.ASGITransport(app=app),
        base_url="http://test",
    ) as client:
        yield client
