"""Analysis capabilities and planned scientific operation routes.

Adheres strictly to RULES.md §4 and ADR-007:
- Requests are validated using strict Pydantic schemas (invalid -> 422)
- Planned-but-unbuilt operations return honest 501 Not Implemented
- Error responses follow standard error envelope
- No fabricated scores, probabilities, or fake run records
"""

from fastapi import APIRouter
from app.core.errors import NotFoundException, NotImplementedException
from app.schemas.analysis import (
    AnalysisCapabilitiesResponse,
    FeatureExtractionRequest,
    ComparisonRequest,
    SimilarityRequest,
    SuitabilityRequest,
    RoverTestingRequest,
    AnalysisRunResponse,
)

router = APIRouter(prefix="/analysis", tags=["Analysis"])


@router.get("/capabilities", response_model=AnalysisCapabilitiesResponse, summary="Get analysis module capabilities")
def get_capabilities() -> AnalysisCapabilitiesResponse:
    """Report readiness of all analysis modules honestly (BE-15)."""
    return AnalysisCapabilitiesResponse(
        modules={
            "feature_extraction": "not_implemented",
            "region_comparison": "not_implemented",
            "similarity_ranking": "not_implemented",
            "base_suitability": "not_implemented",
            "rover_testing": "not_implemented",
        },
        supported_dimensions=[
            "geology_mineralogy",
            "terrain_elevation",
            "slope_roughness",
            "temperature_illumination",
            "water_ice_permafrost",
            "dust_wind_erosion",
            "caves_subsurface",
            "biology_habitability",
        ],
    )


@router.post("/features", summary="Extract terrain features from spatial datasets")
def extract_features(request: FeatureExtractionRequest) -> None:
    """Validate request and return honest 501 Not Implemented (BE-16)."""
    raise NotImplementedException(
        code="ANALYSIS_NOT_IMPLEMENTED",
        message="Feature extraction module is scaffolded but has not been implemented yet.",
    )


@router.post("/compare", summary="Direct pairwise comparison between regions")
def compare_regions(request: ComparisonRequest) -> None:
    """Validate request and return honest 501 Not Implemented (BE-16)."""
    raise NotImplementedException(
        code="ANALYSIS_NOT_IMPLEMENTED",
        message="Region comparison module is scaffolded but has not been implemented yet.",
    )


@router.post("/similarity", summary="Find terrestrial analog regions matching target body")
def find_analogs(request: SimilarityRequest) -> None:
    """Validate request and return honest 501 Not Implemented (BE-16)."""
    raise NotImplementedException(
        code="ANALYSIS_NOT_IMPLEMENTED",
        message="Terrestrial analog similarity ranking is scaffolded but has not been implemented yet.",
    )


@router.post("/suitability", summary="Assess base / landing-site suitability")
def assess_suitability(request: SuitabilityRequest) -> None:
    """Validate request and return honest 501 Not Implemented (BE-16)."""
    raise NotImplementedException(
        code="ANALYSIS_NOT_IMPLEMENTED",
        message="Landing site suitability module is scaffolded but has not been implemented yet.",
    )


@router.post("/rover-testing", summary="Identify terrestrial analog environments for rover testing")
def identify_rover_testbeds(request: RoverTestingRequest) -> None:
    """Validate request and return honest 501 Not Implemented (BE-16)."""
    raise NotImplementedException(
        code="ANALYSIS_NOT_IMPLEMENTED",
        message="Rover testing environment analyzer is scaffolded but has not been implemented yet.",
    )


@router.get("/runs/{run_id}", response_model=AnalysisRunResponse, summary="Get analysis run details")
def get_analysis_run(run_id: str) -> AnalysisRunResponse:
    """Retrieve run record; returns 404 for unknown run without fake data (BE-18)."""
    raise NotFoundException(f"Analysis run '{run_id}' not found.")
