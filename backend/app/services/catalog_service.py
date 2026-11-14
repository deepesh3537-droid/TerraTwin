"""Catalog service orchestrating planets, datasets, and layers."""

from typing import List, Optional, Tuple
from sqlalchemy.orm import Session
from app.core.errors import NotFoundException
from app.models.planet import Planet
from app.models.dataset import Dataset
from app.models.layer import Layer
from app.repositories.planet_repository import PlanetRepository
from app.repositories.dataset_repository import DatasetRepository
from app.repositories.layer_repository import LayerRepository


class CatalogService:
    """Service handling catalog business logic."""

    @staticmethod
    def get_planets(db: Session) -> List[Planet]:
        return PlanetRepository.get_all(db)

    @staticmethod
    def get_planet(db: Session, planet_id: str) -> Planet:
        planet = PlanetRepository.get_by_id(db, planet_id)
        if not planet:
            raise NotFoundException(f"Planet '{planet_id}' not found.")
        return planet

    @staticmethod
    def list_datasets(
        db: Session,
        planet: Optional[str] = None,
        category: Optional[str] = None,
        variable: Optional[str] = None,
        status: Optional[str] = None,
        limit: int = 20,
        offset: int = 0,
    ) -> Tuple[List[Dataset], int]:
        return DatasetRepository.list(
            db=db,
            planet=planet,
            category=category,
            variable=variable,
            status=status,
            limit=limit,
            offset=offset,
        )

    @staticmethod
    def get_dataset(db: Session, dataset_id: str) -> Dataset:
        dataset = DatasetRepository.get_by_id(db, dataset_id)
        if not dataset:
            raise NotFoundException(f"Dataset '{dataset_id}' not found.")
        return dataset

    @staticmethod
    def get_dataset_layers(db: Session, dataset_id: str) -> List[Layer]:
        # Verify dataset exists first (raises 404 if unknown)
        CatalogService.get_dataset(db, dataset_id)
        return LayerRepository.get_by_dataset_id(db, dataset_id)

    @staticmethod
    def list_layers(
        db: Session,
        planet: Optional[str] = None,
        category: Optional[str] = None,
        available: Optional[bool] = None,
    ) -> List[Layer]:
        return LayerRepository.list(
            db=db,
            planet=planet,
            category=category,
            available=available,
        )

    @staticmethod
    def get_layer(db: Session, layer_id: str) -> Layer:
        layer = LayerRepository.get_by_id(db, layer_id)
        if not layer:
            raise NotFoundException(f"Layer '{layer_id}' not found.")
        return layer
