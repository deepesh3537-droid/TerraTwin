"""Regions endpoints per ARCHITECTURE.md §5."""

from typing import List, Optional
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.schemas.common import PaginatedResponse
from app.schemas.dataset import DatasetResponse
from app.schemas.layer import LayerResponse
from app.schemas.region import RegionResponse
from app.services.region_service import RegionService

router = APIRouter(prefix="/regions", tags=["Regions"])


@router.get("", response_model=PaginatedResponse[RegionResponse], summary="List and search regions")
def list_regions(
    planet: Optional[str] = Query(None, description="Filter by body: earth | moon | mars"),
    search: Optional[str] = Query(None, description="Keyword search in name/description"),
    limit: int = Query(20, ge=1, le=100, description="Page limit (1-100)"),
    offset: int = Query(0, ge=0, description="Page offset (>= 0)"),
    db: Session = Depends(get_db),
) -> PaginatedResponse[RegionResponse]:
    """Retrieve areas of interest with search filtering and pagination."""
    items, total = RegionService.list_regions(
        db=db,
        planet=planet,
        search=search,
        limit=limit,
        offset=offset,
    )
    return PaginatedResponse(
        items=items,
        total=total,
        limit=limit,
        offset=offset,
    )


@router.get("/{region_id}", response_model=RegionResponse, summary="Get region details")
def get_region(region_id: str, db: Session = Depends(get_db)) -> RegionResponse:
    """Retrieve region detail including CRS and coordinates; 404 if unknown."""
    return RegionService.get_region(db, region_id)


@router.get("/{region_id}/datasets", response_model=List[DatasetResponse], summary="Get region available datasets")
def get_region_datasets(region_id: str, db: Session = Depends(get_db)) -> List[DatasetResponse]:
    """Retrieve datasets covering or associated with this planetary region."""
    return RegionService.get_region_datasets(db, region_id)


@router.get("/{region_id}/layers", response_model=List[LayerResponse], summary="Get region available layers")
def get_region_layers(region_id: str, db: Session = Depends(get_db)) -> List[LayerResponse]:
    """Retrieve visualization/analysis layers covering this planetary region."""
    return RegionService.get_region_layers(db, region_id)
