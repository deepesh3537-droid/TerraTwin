"""Analysis Pydantic schemas and request contracts."""

from datetime import datetime
from typing import Any, Dict, List, Optional
from pydantic import Field
from app.schemas.common import BaseSchema


class AnalysisCapabilitiesResponse(BaseSchema):
    """Analysis module readiness status per ARCHITECTURE.md §5."""

    modules: Dict[str, str] = Field(description="Module status: not_implemented | prototype | available")
    supported_dimensions: List[str]


class FeatureExtractionRequest(BaseSchema):
    """Contract for region feature extraction."""

    region_id: str = Field(description="Target region ID")
    dataset_ids: List[str] = Field(min_length=1, description="List of dataset IDs to extract features from")
    features: List[str] = Field(min_length=1, description="Feature names to extract")


class ComparisonRequest(BaseSchema):
    """Contract for two-region direct comparison."""

    reference_region_id: str = Field(description="Reference Moon/Mars region ID")
    candidate_region_id: str = Field(description="Candidate Earth region ID")
    variables: List[str] = Field(min_length=1, description="Comparison variables")
    weights: Optional[Dict[str, float]] = Field(default=None, description="Optional per-variable weights")


class SimilarityRequest(BaseSchema):
    """Contract for terrestrial analog ranking."""

    target_region_id: str = Field(description="Target Moon or Mars region ID")
    candidate_planet: str = Field(default="earth", description="Body to search for analogs (default: earth)")
    variables: List[str] = Field(min_length=1, description="Analogy variables to compare")
    weights: Optional[Dict[str, float]] = Field(default=None, description="Dimension weights (must be non-negative)")
    limit: int = Field(default=10, ge=1, le=100, description="Max candidate results")


class SuitabilityRequest(BaseSchema):
    """Contract for landing site or base suitability scoring."""

    region_id: str = Field(description="Region ID to evaluate")
    criteria: List[str] = Field(min_length=1, description="Evaluation criteria list")
    weights: Optional[Dict[str, float]] = None


class RoverTestingRequest(BaseSchema):
    """Contract for rover testbed environment discovery."""

    target_environment: str = Field(description="Target extraterrestrial environment descriptor")
    test_capabilities: List[str] = Field(min_length=1, description="Required engineering test capabilities")
    candidate_region_ids: Optional[List[str]] = None


class AnalysisRunResponse(BaseSchema):
    """Analysis run tracking record."""

    id: str
    analysis_type: str
    status: str
    parameters: Dict[str, Any]
    results: Optional[Dict[str, Any]] = None
    error_message: Optional[str] = None
    created_at: datetime
    completed_at: Optional[datetime] = None
