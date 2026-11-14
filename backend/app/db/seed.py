"""Database seed script for TerraTwin demo records.

Adheres strictly to RULES.md §4:
- All sample records carry is_demo=True
- Neutral names ('Demo Earth Region', 'Demo Lunar Region', 'Demo Martian Region')
- No fabricated scientific measurements, elevations, or temperatures
- Body-specific CRS stored explicitly with every spatial record
"""

from datetime import datetime, timezone
from sqlalchemy.orm import Session
from app.core.database import SessionLocal
from app.core.logging import logger
from app.models.planet import Planet
from app.models.dataset import Dataset
from app.models.layer import Layer
from app.models.region import Region


def seed_database(db: Session) -> None:
    """Idempotently seed required bodies and minimal demo fixtures."""
    now = datetime.now(timezone.utc)

    # 1. Planetary Bodies
    planets = [
        Planet(id="earth", name="Earth", description="Terrestrial analog testbed", radius_km=6371.0, created_at=now, updated_at=now),
        Planet(id="moon", name="Moon", description="Lunar surface and extreme environment", radius_km=1737.4, created_at=now, updated_at=now),
        Planet(id="mars", name="Mars", description="Martian terrain and atmospheric analog", radius_km=3389.5, created_at=now, updated_at=now),
    ]

    for p in planets:
        existing = db.get(Planet, p.id)
        if not existing:
            db.add(p)
            logger.info(f"Seeded planet: {p.id}")

    db.flush()

    # 2. Demo Regions (neutral names, is_demo=True, no fabricated measurements)
    demo_regions = [
        Region(
            id="00000000-0000-0000-0000-000000000001",
            name="Demo Earth Region",
            description="Sample terrestrial analog reference region for pipeline testing.",
            planet_id="earth",
            footprint={"type": "Polygon", "coordinates": [[[-115.0, 35.0], [-115.0, 36.0], [-114.0, 36.0], [-114.0, 35.0], [-115.0, 35.0]]]},
            coordinate_reference_system="EPSG:4326",
            source_provenance="TerraTwin Demo Fixtures (Not a NASA observation)",
            tags=["demo", "analog_candidate", "terrestrial"],
            characteristics=None,  # Not yet computed; no fabricated values
            is_demo=True,
            created_at=now,
            updated_at=now,
        ),
        Region(
            id="00000000-0000-0000-0000-000000000002",
            name="Demo Lunar Region",
            description="Sample lunar crater area of interest for comparison testing.",
            planet_id="moon",
            footprint={"type": "Point", "coordinates": [0.0, -85.0]},
            coordinate_reference_system="IAU2000:30100",  # Moon CRS, never EPSG:4326
            source_provenance="TerraTwin Demo Fixtures (Not a NASA observation)",
            tags=["demo", "lunar_polar", "candidate"],
            characteristics=None,
            is_demo=True,
            created_at=now,
            updated_at=now,
        ),
        Region(
            id="00000000-0000-0000-0000-000000000003",
            name="Demo Martian Region",
            description="Sample martian terrain area of interest for rover lab testing.",
            planet_id="mars",
            footprint={"type": "Point", "coordinates": [77.5, 18.4]},
            coordinate_reference_system="IAU2000:49900",  # Mars CRS, never EPSG:4326
            source_provenance="TerraTwin Demo Fixtures (Not a NASA observation)",
            tags=["demo", "martian_basin", "candidate"],
            characteristics=None,
            is_demo=True,
            created_at=now,
            updated_at=now,
        ),
    ]

    for r in demo_regions:
        existing = db.get(Region, r.id)
        if not existing:
            db.add(r)
            logger.info(f"Seeded demo region: {r.name}")

    db.flush()

    # 3. Demo Datasets
    demo_datasets = [
        Dataset(
            id="00000000-0000-0000-0001-000000000001",
            name="Demo Earth Topography Dataset",
            description="Demonstration metadata entry for elevation grid.",
            planet_id="earth",
            category="terrain_elevation",
            variable="elevation",
            source_agency="Demo Agency",
            mission="Demo Mission",
            instrument="Demo Sensor",
            format="GeoTIFF",
            unit="m",
            native_resolution="30m",
            coordinate_reference_system="EPSG:4326",
            processing_level="Level 3",
            license="Demo Terms",
            source_url="https://example.gov/demo-dataset",
            citation="Demo citation for development use only.",
            local_path="samples/demo_earth_topo.tif",
            checksum="sha256:0000000000000000000000000000000000000000000000000000000000000000",
            ingestion_status="registered",
            quality_notes="Demo fixture record; no real measurements.",
            is_demo=True,
            created_at=now,
            updated_at=now,
        )
    ]

    for d in demo_datasets:
        existing = db.get(Dataset, d.id)
        if not existing:
            db.add(d)
            logger.info(f"Seeded demo dataset: {d.name}")

    db.flush()

    # 4. Demo Layer
    demo_layers = [
        Layer(
            id="00000000-0000-0000-0002-000000000001",
            name="Demo Elevation Contour",
            description="Sample elevation visualization layer for Earth.",
            planet_id="earth",
            category="terrain_elevation",
            dataset_id="00000000-0000-0000-0001-000000000001",
            variable="elevation",
            unit="m",
            available=False,  # Rendering not yet configured in base
            rendering_type="raster",
            rendering_url=None,  # Null per ARCHITECTURE.md §6 when unavailable
            coordinate_reference_system="EPSG:4326",
            style=None,
            created_at=now,
            updated_at=now,
        )
    ]

    for l in demo_layers:
        existing = db.get(Layer, l.id)
        if not existing:
            db.add(l)
            logger.info(f"Seeded demo layer: {l.name}")

    db.commit()
    logger.info("Database seed completed successfully.")


if __name__ == "__main__":
    db = SessionLocal()
    try:
        seed_database(db)
    finally:
        db.close()
