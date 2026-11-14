"""Pytest configuration and shared fixtures for backend tests."""

import pytest
import pytest_asyncio
from typing import AsyncGenerator, Generator
from sqlalchemy import create_engine
from sqlalchemy.orm import Session, sessionmaker
from sqlalchemy.pool import StaticPool
import httpx

from app.main import app
from app.core.database import Base
from app.db.session import get_db
from app.db.seed import seed_database

# In-memory test engine shared across test connection
test_engine = create_engine(
    "sqlite:///:memory:",
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=test_engine)


@pytest.fixture(scope="session", autouse=True)
def setup_test_db() -> Generator[None, None, None]:
    """Create schema once for the test session."""
    Base.metadata.create_all(bind=test_engine)
    yield
    Base.metadata.drop_all(bind=test_engine)


@pytest.fixture
def db_session() -> Generator[Session, None, None]:
    """Provide a clean database session per test, populated with seed data."""
    # Clear tables
    for table in reversed(Base.metadata.sorted_tables):
        test_engine.execute(table.delete()) if hasattr(test_engine, "execute") else None

    # Alternative clear
    with test_engine.connect() as conn:
        for table in reversed(Base.metadata.sorted_tables):
            conn.execute(table.delete())
        conn.commit()

    db = TestingSessionLocal()
    seed_database(db)
    try:
        yield db
    finally:
        db.close()


@pytest.fixture
def empty_db_session() -> Generator[Session, None, None]:
    """Provide an empty database session with zero records."""
    with test_engine.connect() as conn:
        for table in reversed(Base.metadata.sorted_tables):
            conn.execute(table.delete())
        conn.commit()

    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()


@pytest_asyncio.fixture
async def async_client(db_session: Session) -> AsyncGenerator[httpx.AsyncClient, None]:
    """Async HTTP client overriding get_db dependency with seeded test DB."""
    def override_get_db():
        try:
            yield db_session
        finally:
            pass

    app.dependency_overrides[get_db] = override_get_db

    async with httpx.AsyncClient(
        transport=httpx.ASGITransport(app=app),
        base_url="http://test",
    ) as client:
        yield client

    app.dependency_overrides.pop(get_db, None)


@pytest_asyncio.fixture
async def empty_client(empty_db_session: Session) -> AsyncGenerator[httpx.AsyncClient, None]:
    """Async HTTP client overriding get_db dependency with empty test DB."""
    def override_get_db():
        try:
            yield empty_db_session
        finally:
            pass

    app.dependency_overrides[get_db] = override_get_db

    async with httpx.AsyncClient(
        transport=httpx.ASGITransport(app=app),
        base_url="http://test",
    ) as client:
        yield client

    app.dependency_overrides.pop(get_db, None)
