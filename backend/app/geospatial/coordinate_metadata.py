"""Planetary body CRS definitions and validation per ADR-009."""

from typing import Dict, Set

# Standard default CRS per planetary body
BODY_DEFAULT_CRS: Dict[str, str] = {
    "earth": "EPSG:4326",
    "moon": "IAU2000:30100",  # Moon (2000) - Sphere / Equirectangular
    "mars": "IAU2000:49900",  # Mars (2000) - Sphere / Equirectangular
}

# Known valid CRS identifiers per body
KNOWN_PLANETARY_CRS: Dict[str, Set[str]] = {
    "earth": {"EPSG:4326", "EPSG:3857"},
    "moon": {"IAU2000:30100", "IAU_2015:30100", "IAU2000:30120"},
    "mars": {"IAU2000:49900", "IAU_2015:49900", "IAU2000:49910"},
}


def get_default_crs(planet_id: str) -> str:
    """Return default CRS for specified body."""
    body = planet_id.lower()
    if body not in BODY_DEFAULT_CRS:
        raise ValueError(f"Unknown planetary body: '{planet_id}'")
    return BODY_DEFAULT_CRS[body]


def validate_body_crs(planet_id: str, crs: str) -> bool:
    """Validate that Moon/Mars coordinates are never assigned Earth CRS (ADR-009)."""
    body = planet_id.lower()
    if body in ("moon", "mars") and "EPSG:4326" in crs.upper():
        raise ValueError(
            f"Scientific integrity violation: Extraterrestrial body '{planet_id}' "
            f"cannot use Earth CRS '{crs}' (ADR-009)."
        )
    return True
