"""Feature extraction scaffold implementing IFeatureExtractor (Extension Point)."""

from typing import Any, Dict, List
from app.analysis.interfaces import IFeatureExtractor


class FeatureExtractionService(IFeatureExtractor):
    """Scaffold for ML/analysis teammate to implement feature extraction."""

    def extract(self, region_id: str, dataset_ids: List[str], features: List[str]) -> Dict[str, Any]:
        """Extract multi-spectral/topographic features. No fake measurements produced."""
        raise NotImplementedError("Feature extraction module is scaffolded but not yet implemented.")
