"""Datasets endpoints per ARCHITECTURE.md §5."""

from typing import List, Optional
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.schemas.common import PaginatedResponse
from app.schemas.dataset import DatasetResponse
from app.schemas.layer import LayerResponse
from app.services.catalog_service import CatalogService

router = APIRouter(prefix="/datasets", tags=["Datasets"])


@router.get("", response_model=PaginatedResponse[DatasetResponse], summary="List and filter datasets")
def list_datasets(
    planet: Optional[str] = Query(None, description="Filter by body: earth | moon | mars"),
    category: Optional[str] = Query(None, description="Filter by category"),
    variable: Optional[str] = Query(None, description="Filter by variable"),
    status: Optional[str] = Query(None, description="Filter by ingestion_status"),
    limit: int = Query(20, ge=1, le=100, description="Page limit (1-100)"),
    offset: int = Query(0, ge=0, description="Page offset (>= 0)"),
    db: Session = Depends(get_db),
) -> PaginatedResponse[DatasetResponse]:
    """Retrieve catalog datasets with filtering and pagination."""
    items, total = CatalogService.list_datasets(
        db=db,
        planet=planet,
        category=category,
        variable=variable,
        status=status,
        limit=limit,
        offset=offset,
    )
    return PaginatedResponse(
        items=items,
        total=total,
        limit=limit,
        offset=offset,
    )


@router.get("/{dataset_id}", response_model=DatasetResponse, summary="Get dataset details")
def get_dataset(dataset_id: str, db: Session = Depends(get_db)) -> DatasetResponse:
    """Retrieve dataset metadata with provenance; 404 if unknown."""
    return CatalogService.get_dataset(db, dataset_id)


@router.get("/{dataset_id}/layers", response_model=List[LayerResponse], summary="Get dataset associated layers")
def get_dataset_layers(dataset_id: str, db: Session = Depends(get_db)) -> List[LayerResponse]:
    """Retrieve all visualization/analysis layers derived from this dataset."""
    return CatalogService.get_dataset_layers(db, dataset_id)
