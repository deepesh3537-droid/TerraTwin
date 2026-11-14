"""Analysis and ML extension point package."""

from app.analysis.interfaces import (
    IFeatureExtractor,
    ISimilarityEngine,
    ISuitabilityEvaluator,
    IRoverTestbedMatcher,
)
from app.analysis.feature_extraction import FeatureExtractionService
from app.analysis.similarity import SimilarityEngine
from app.analysis.suitability import SuitabilityEvaluator
from app.analysis.rover_testing import RoverTestbedMatcher

__all__ = [
    "IFeatureExtractor",
    "ISimilarityEngine",
    "ISuitabilityEvaluator",
    "IRoverTestbedMatcher",
    "FeatureExtractionService",
    "SimilarityEngine",
    "SuitabilityEvaluator",
    "RoverTestbedMatcher",
]
