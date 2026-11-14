"""Dataset repository handling database queries for dataset metadata."""

from typing import List, Optional, Tuple
from sqlalchemy import func
from sqlalchemy.orm import Session
from app.models.dataset import Dataset


class DatasetRepository:
    """Repository accessing Dataset records."""

    @staticmethod
    def list(
        db: Session,
        planet: Optional[str] = None,
        category: Optional[str] = None,
        variable: Optional[str] = None,
        status: Optional[str] = None,
        limit: int = 20,
        offset: int = 0,
    ) -> Tuple[List[Dataset], int]:
        query = db.query(Dataset)

        if planet:
            query = query.filter(Dataset.planet_id == planet.lower())
        if category:
            query = query.filter(Dataset.category == category)
        if variable:
            query = query.filter(Dataset.variable == variable)
        if status:
            query = query.filter(Dataset.ingestion_status == status)

        total = query.with_entities(func.count(Dataset.id)).scalar() or 0
        items = query.order_by(Dataset.name).offset(offset).limit(limit).all()
        return items, total

    @staticmethod
    def get_by_id(db: Session, dataset_id: str) -> Optional[Dataset]:
        return db.get(Dataset, dataset_id)

    @staticmethod
    def get_by_planet_id(db: Session, planet_id: str) -> List[Dataset]:
        return db.query(Dataset).filter(Dataset.planet_id == planet_id.lower()).all()
