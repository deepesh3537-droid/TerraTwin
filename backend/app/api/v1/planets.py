"""Planets endpoints per ARCHITECTURE.md §5."""

from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.schemas.planet import PlanetResponse
from app.services.catalog_service import CatalogService

router = APIRouter(prefix="/planets", tags=["Planets"])


@router.get("", response_model=List[PlanetResponse], summary="List supported planetary bodies")
def list_planets(db: Session = Depends(get_db)) -> List[PlanetResponse]:
    """Retrieve all supported planetary bodies (Earth, Moon, Mars)."""
    return CatalogService.get_planets(db)


@router.get("/{planet_id}", response_model=PlanetResponse, summary="Get planet details")
def get_planet(planet_id: str, db: Session = Depends(get_db)) -> PlanetResponse:
    """Retrieve metadata for a specific planetary body; 404 if unknown."""
    return CatalogService.get_planet(db, planet_id)
