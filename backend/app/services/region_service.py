"""Region service orchestrating regions and related spatial data."""

from typing import List, Optional, Tuple
from sqlalchemy.orm import Session
from app.core.errors import NotFoundException
from app.models.region import Region
from app.models.dataset import Dataset
from app.models.layer import Layer
from app.repositories.region_repository import RegionRepository
from app.repositories.dataset_repository import DatasetRepository
from app.repositories.layer_repository import LayerRepository


class RegionService:
    """Service handling region business logic."""

    @staticmethod
    def list_regions(
        db: Session,
        planet: Optional[str] = None,
        search: Optional[str] = None,
        limit: int = 20,
        offset: int = 0,
    ) -> Tuple[List[Region], int]:
        return RegionRepository.list(
            db=db,
            planet=planet,
            search=search,
            limit=limit,
            offset=offset,
        )

    @staticmethod
    def get_region(db: Session, region_id: str) -> Region:
        region = RegionRepository.get_by_id(db, region_id)
        if not region:
            raise NotFoundException(f"Region '{region_id}' not found.")
        return region

    @staticmethod
    def get_region_datasets(db: Session, region_id: str) -> List[Dataset]:
        region = RegionService.get_region(db, region_id)
        return DatasetRepository.get_by_planet_id(db, region.planet_id)

    @staticmethod
    def get_region_layers(db: Session, region_id: str) -> List[Layer]:
        region = RegionService.get_region(db, region_id)
        return LayerRepository.get_by_planet_id(db, region.planet_id)
