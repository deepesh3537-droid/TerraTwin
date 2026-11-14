"""Test for database seed script logic (TEST_PLAN.md DB-03, DB-04)."""

import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.core.database import Base
from app.db.seed import seed_database
from app.models.planet import Planet
from app.models.dataset import Dataset
from app.models.layer import Layer
from app.models.region import Region


def test_seed_database_execution() -> None:
    """Verify that seed_database executes cleanly and creates required baseline entities."""
    # Create an in-memory SQLite database for schema and seed validation
    test_engine = create_engine("sqlite:///:memory:", echo=False)
    Base.metadata.create_all(bind=test_engine)
    TestSession = sessionmaker(autocommit=False, autoflush=False, bind=test_engine)

    db = TestSession()
    try:
        # 1. Run seed script
        seed_database(db)

        # 2. Verify planets
        planets = db.query(Planet).all()
        planet_ids = {p.id for p in planets}
        assert planet_ids == {"earth", "moon", "mars"}

        # 3. Verify demo regions (all must have is_demo=True, no fabricated values)
        regions = db.query(Region).all()
        assert len(regions) == 3
        for r in regions:
            assert r.is_demo is True
            assert r.characteristics is None  # Never fabricated values
            assert r.coordinate_reference_system is not None
            # Moon and Mars must not be EPSG:4326
            if r.planet_id in ("moon", "mars"):
                assert r.coordinate_reference_system != "EPSG:4326"

        # 4. Verify demo datasets
        datasets = db.query(Dataset).all()
        assert len(datasets) == 1
        assert datasets[0].is_demo is True

        # 5. Verify demo layers
        layers = db.query(Layer).all()
        assert len(layers) == 1
        assert layers[0].available is False
        assert layers[0].rendering_url is None

        # 6. Test idempotency (running seed twice does not raise duplicate errors)
        seed_database(db)
        assert len(db.query(Planet).all()) == 3
        assert len(db.query(Region).all()) == 3

    finally:
        db.close()
