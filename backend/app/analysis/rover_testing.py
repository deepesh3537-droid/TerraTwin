"""Rover testbed matcher scaffold implementing IRoverTestbedMatcher (Extension Point)."""

from typing import Any, Dict, List, Optional
from app.analysis.interfaces import IRoverTestbedMatcher


class RoverTestbedMatcher(IRoverTestbedMatcher):
    """Scaffold for rover mobility/navigation testbed matching."""

    def match_testbeds(
        self,
        target_environment: str,
        test_capabilities: List[str],
        candidate_region_ids: Optional[List[str]] = None,
    ) -> List[Dict[str, Any]]:
        """Identify matching terrestrial testbeds. No fake rankings produced."""
        raise NotImplementedError("Rover testbed matching engine is scaffolded but not yet implemented.")
