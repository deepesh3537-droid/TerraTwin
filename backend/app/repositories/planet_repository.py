"""Planet repository handling database queries for planetary bodies."""

from typing import List, Optional
from sqlalchemy.orm import Session
from app.models.planet import Planet


class PlanetRepository:
    """Repository accessing Planet records."""

    @staticmethod
    def get_all(db: Session) -> List[Planet]:
        return db.query(Planet).order_by(Planet.id).all()

    @staticmethod
    def get_by_id(db: Session, planet_id: str) -> Optional[Planet]:
        return db.get(Planet, planet_id)
