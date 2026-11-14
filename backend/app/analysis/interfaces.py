"""Analysis and ML interfaces and extension points (Member 3: Analysis & ML)."""

from abc import ABC, abstractmethod
from typing import Any, Dict, List, Optional


class IFeatureExtractor(ABC):
    """Interface for extracting terrain and environmental feature vectors."""

    @abstractmethod
    def extract(self, region_id: str, dataset_ids: List[str], features: List[str]) -> Dict[str, Any]:
        """Extract multi-spectral or topographic features."""
        raise NotImplementedError("Feature extraction engine not implemented.")


class ISimilarityEngine(ABC):
    """Interface for terrestrial analog similarity ranking (ADR-011)."""

    @abstractmethod
    def rank_analogs(
        self,
        target_region_id: str,
        candidate_planet: str,
        variables: List[str],
        weights: Optional[Dict[str, float]] = None,
        limit: int = 10,
    ) -> List[Dict[str, Any]]:
        """Rank terrestrial analog candidates. Returns ranking metric, not probability."""
        raise NotImplementedError("Similarity engine not implemented.")


class ISuitabilityEvaluator(ABC):
    """Interface for base and landing-site suitability assessment."""

    @abstractmethod
    def evaluate(
        self,
        region_id: str,
        criteria: List[str],
        weights: Optional[Dict[str, float]] = None,
    ) -> Dict[str, Any]:
        """Evaluate suitability per dimension."""
        raise NotImplementedError("Suitability evaluator not implemented.")


class IRoverTestbedMatcher(ABC):
    """Interface for matching rover testing environments on Earth."""

    @abstractmethod
    def match_testbeds(
        self,
        target_environment: str,
        test_capabilities: List[str],
        candidate_region_ids: Optional[List[str]] = None,
    ) -> List[Dict[str, Any]]:
        """Identify comparable terrestrial testing regions."""
        raise NotImplementedError("Rover testbed matcher not implemented.")
