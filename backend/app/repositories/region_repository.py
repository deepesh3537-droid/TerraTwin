"""Region repository handling database queries for planetary regions."""

from typing import List, Optional, Tuple
from sqlalchemy import func, or_
from sqlalchemy.orm import Session
from app.models.region import Region


class RegionRepository:
    """Repository accessing Region records."""

    @staticmethod
    def list(
        db: Session,
        planet: Optional[str] = None,
        search: Optional[str] = None,
        limit: int = 20,
        offset: int = 0,
    ) -> Tuple[List[Region], int]:
        query = db.query(Region)

        if planet:
            query = query.filter(Region.planet_id == planet.lower())

        if search:
            # Parameterized search query per SECURITY.md §4
            pattern = f"%{search.strip()}%"
            query = query.filter(
                or_(
                    Region.name.ilike(pattern),
                    Region.description.ilike(pattern),
                )
            )

        total = query.with_entities(func.count(Region.id)).scalar() or 0
        items = query.order_by(Region.name).offset(offset).limit(limit).all()
        return items, total

    @staticmethod
    def get_by_id(db: Session, region_id: str) -> Optional[Region]:
        return db.get(Region, region_id)
