"""Layers endpoints per ARCHITECTURE.md §5."""

from typing import List, Optional
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.schemas.layer import LayerResponse
from app.services.catalog_service import CatalogService

router = APIRouter(prefix="/layers", tags=["Layers"])


@router.get("", response_model=List[LayerResponse], summary="List and filter layers")
def list_layers(
    planet: Optional[str] = Query(None, description="Filter by body: earth | moon | mars"),
    category: Optional[str] = Query(None, description="Filter by category"),
    available: Optional[bool] = Query(None, description="Filter by availability status"),
    db: Session = Depends(get_db),
) -> List[LayerResponse]:
    """Retrieve map layers with category and availability filters."""
    return CatalogService.list_layers(
        db=db,
        planet=planet,
        category=category,
        available=available,
    )


@router.get("/{layer_id}", response_model=LayerResponse, summary="Get layer details")
def get_layer(layer_id: str, db: Session = Depends(get_db)) -> LayerResponse:
    """Retrieve layer detail including rendering availability; 404 if unknown."""
    return CatalogService.get_layer(db, layer_id)
