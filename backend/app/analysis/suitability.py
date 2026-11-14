"""Suitability evaluator scaffold implementing ISuitabilityEvaluator (Extension Point)."""

from typing import Any, Dict, List, Optional
from app.analysis.interfaces import ISuitabilityEvaluator


class SuitabilityEvaluator(ISuitabilityEvaluator):
    """Scaffold for base/landing-site suitability assessment."""

    def evaluate(
        self,
        region_id: str,
        criteria: List[str],
        weights: Optional[Dict[str, float]] = None,
    ) -> Dict[str, Any]:
        """Evaluate suitability per criteria dimension. No fake scores produced."""
        raise NotImplementedError("Suitability evaluation engine is scaffolded but not yet implemented.")
