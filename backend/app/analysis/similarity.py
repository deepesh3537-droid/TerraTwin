"""Similarity ranking engine scaffold implementing ISimilarityEngine (Extension Point).

Adheres to ADR-011:
- Similarity is a ranking metric, NOT a probability
- Per-dimension scores must be preserved in future implementations
- No arbitrary or fake similarity scores are implemented in the base
"""

from typing import Any, Dict, List, Optional
from app.analysis.interfaces import ISimilarityEngine


class SimilarityEngine(ISimilarityEngine):
    """Scaffold for ML/analysis teammate to implement analog ranking."""

    def rank_analogs(
        self,
        target_region_id: str,
        candidate_planet: str,
        variables: List[str],
        weights: Optional[Dict[str, float]] = None,
        limit: int = 10,
    ) -> List[Dict[str, Any]]:
        """Rank terrestrial analog candidates. Honest unimplemented scaffold."""
        raise NotImplementedError("Similarity ranking engine is scaffolded but not yet implemented.")
