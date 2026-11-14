"""Layer repository handling database queries for display/analysis layers."""

from typing import List, Optional
from sqlalchemy.orm import Session
from app.models.layer import Layer


class LayerRepository:
    """Repository accessing Layer records."""

    @staticmethod
    def list(
        db: Session,
        planet: Optional[str] = None,
        category: Optional[str] = None,
        available: Optional[bool] = None,
    ) -> List[Layer]:
        query = db.query(Layer)

        if planet:
            query = query.filter(Layer.planet_id == planet.lower())
        if category:
            query = query.filter(Layer.category == category)
        if available is not None:
            query = query.filter(Layer.available == available)

        return query.order_by(Layer.name).all()

    @staticmethod
    def get_by_id(db: Session, layer_id: str) -> Optional[Layer]:
        return db.get(Layer, layer_id)

    @staticmethod
    def get_by_dataset_id(db: Session, dataset_id: str) -> List[Layer]:
        return db.query(Layer).filter(Layer.dataset_id == dataset_id).order_by(Layer.name).all()

    @staticmethod
    def get_by_planet_id(db: Session, planet_id: str) -> List[Layer]:
        return db.query(Layer).filter(Layer.planet_id == planet_id.lower()).order_by(Layer.name).all()
