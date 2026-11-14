# TerraTwin API Contracts Specification

This document defines the formal HTTP API contracts for the TerraTwin platform, matching the FastAPI implementation and OpenAPI 3.1 specification exposed at `/docs`.

---

## 1. Global Conventions

- **Base URL:** `/api/v1` (except root health check at `/health`)
- **Protocol:** HTTP/1.1 / JSON (`application/json`)
- **Date/Time Format:** ISO 8601 UTC strings (`YYYY-MM-DDTHH:MM:SSZ`)
- **Missing Data Convention:** Missing or uncalculated metrics are returned as `null`, never as `0` or empty placeholders (per ADR-008).
- **Coordinate Reference Systems:** All geometries and spatial layers explicitly track their CRS (e.g., Earth `EPSG:4326`, Moon `IAU2000:30100`, Mars `IAU2000:49900`). Extraterrestrial coordinates are never projected to Earth frames (per ADR-009).

---

## 2. Standard Envelopes

### 2.1 Standard Error Envelope (BE-01, BE-14)
All error responses (4xx, 5xx) strictly follow the centralized error envelope structure:

```json
{
  "error": {
    "code": "NOT_IMPLEMENTED",
    "message": "Analysis module 'compare' is scaffolded in the API contract but not yet implemented.",
    "details": null,
    "request_id": "req-9b8a1c72-5d41"
  }
}
```

#### Standard Error Codes:
| Code | HTTP Status | Description |
|---|---|---|
| `NOT_FOUND` | 404 | Requested entity (planet, dataset, layer, region, run) does not exist |
| `VALIDATION_ERROR` | 422 | Request body or query parameters failed schema validation |
| `NOT_IMPLEMENTED` | 501 | Capability is scaffolded in the contract but algorithm is awaiting scientific implementation |
| `SERVICE_UNAVAILABLE` | 503 | Database or dependent service is disconnected or unreachable |
| `INTERNAL_ERROR` | 500 | Unhandled server exception (stack traces suppressed) |

### 2.2 Standard Pagination Envelope
Endpoints that return collections support offset-based pagination:

```json
{
  "items": [ /* array of resource objects */ ],
  "total": 42,
  "limit": 20,
  "offset": 0
}
```

**Query Parameters:**
- `limit` (integer, optional, default: 20, max: 100): Number of records to return.
- `offset` (integer, optional, default: 0, min: 0): Number of records to skip.

---

## 3. Health & System Endpoints

### 3.1 Root Liveness Probe
- **Route:** `GET /health`
- **Summary:** Root process liveness probe (unversioned).
- **Response `200 OK`:**
  ```json
  {
    "status": "ok",
    "app": "TerraTwin"
  }
  ```

### 3.2 Service & Database Readiness Probe
- **Route:** `GET /api/v1/health/ready`
- **Summary:** Reports live database connectivity and readiness status (BE-02, BE-03).
- **Response `200 OK` (Database Connected):**
  ```json
  {
    "status": "ready",
    "database": "connected",
    "services": {
      "database": "ok"
    }
  }
  ```
- **Response `503 Service Unavailable` (Database Disconnected):**
  ```json
  {
    "status": "degraded",
    "database": "disconnected",
    "services": {
      "database": "unavailable"
    }
  }
  ```

### 3.3 System Information
- **Route:** `GET /api/v1/system/info`
- **Summary:** Reports application version, environment, and honest module readiness (BE-04).
- **Response `200 OK`:**
  ```json
  {
    "app_name": "TerraTwin",
    "version": "0.1.0",
    "api_version": "v1",
    "environment": "development",
    "modules": {
      "catalog": "available",
      "regions": "available",
      "geospatial": "prototype",
      "analysis_features": "not_implemented",
      "analysis_compare": "not_implemented",
      "analysis_similarity": "not_implemented",
      "analysis_suitability": "not_implemented",
      "analysis_rover_testing": "not_implemented"
    }
  }
  ```

---

## 4. Planetary Bodies Endpoints

### 4.1 List Planetary Bodies
- **Route:** `GET /api/v1/planets`
- **Response `200 OK`:** `PlanetResponse[]`
  ```json
  [
    {
      "id": "earth",
      "name": "Earth",
      "description": "Terrestrial reference body for planetary analog research",
      "radius_km": 6371.0,
      "created_at": "2026-11-14T00:00:00Z",
      "updated_at": "2026-11-14T00:00:00Z"
    },
    {
      "id": "moon",
      "name": "Moon",
      "description": "Earth's natural satellite; primary exploration target",
      "radius_km": 1737.4,
      "created_at": "2026-11-14T00:00:00Z",
      "updated_at": "2026-11-14T00:00:00Z"
    },
    {
      "id": "mars",
      "name": "Mars",
      "description": "Fourth planet from the Sun; target for human exploration",
      "radius_km": 3389.5,
      "created_at": "2026-11-14T00:00:00Z",
      "updated_at": "2026-11-14T00:00:00Z"
    }
  ]
  ```

### 4.2 Get Planetary Body by ID
- **Route:** `GET /api/v1/planets/{id}`
- **Path Parameters:** `id` (string: `earth`, `moon`, `mars`)
- **Response `200 OK`:** Single `PlanetResponse`.
- **Response `404 Not Found`:** If body ID is unknown.

---

## 5. Dataset Catalog Endpoints

### 5.1 List & Filter Datasets
- **Route:** `GET /api/v1/datasets`
- **Query Parameters:**
  - `planet` (string, optional): Filter by planet ID (`earth`, `moon`, `mars`).
  - `category` (string, optional): Filter by category (`elevation`, `imagery`, `composition`, `geology`, `thermal`, `environmental`).
  - `variable` (string, optional): Filter by physical variable name (e.g., `elevation`, `slope`, `mineralogy`).
  - `status` (string, optional): Ingestion status (`available`, `pending`, `prototype`).
  - `limit` (integer, default: 20)
  - `offset` (integer, default: 0)
- **Response `200 OK`:** `PaginatedResponse[DatasetResponse]`
  ```json
  {
    "items": [
      {
        "id": "ds-earth-dem-demo",
        "name": "Demo Earth Topography Dataset",
        "description": "Sample elevation grid conforming to TerraTwin catalog specification",
        "planet_id": "earth",
        "category": "elevation",
        "variable": "elevation",
        "source_agency": "NASA / USGS",
        "mission": "SRTM",
        "instrument": "C-band Radar",
        "format": "GeoTIFF",
        "unit": "meters",
        "native_resolution": "30m",
        "temporal_start": "2000-02-11T00:00:00Z",
        "temporal_end": "2000-02-22T00:00:00Z",
        "coordinate_reference_system": "EPSG:4326",
        "processing_level": "Level 3",
        "license": "Public Domain",
        "source_url": "https://earthdata.nasa.gov",
        "citation": "NASA JPL (2000). Shuttle Radar Topography Mission.",
        "local_path": "raw/earth/srtm_demo.tif",
        "checksum": null,
        "ingestion_status": "available",
        "quality_notes": "Demo fixture for baseline verification",
        "is_demo": true,
        "created_at": "2026-11-14T00:00:00Z",
        "updated_at": "2026-11-14T00:00:00Z"
      }
    ],
    "total": 1,
    "limit": 20,
    "offset": 0
  }
  ```

### 5.2 Get Dataset by ID
- **Route:** `GET /api/v1/datasets/{id}`
- **Response `200 OK`:** Single `DatasetResponse`.
- **Response `404 Not Found`:** When dataset ID does not exist.

### 5.3 Get Associated Layers for Dataset
- **Route:** `GET /api/v1/datasets/{id}/layers`
- **Response `200 OK`:** `LayerResponse[]`

---

## 6. Map Layers Endpoints

### 6.1 List & Filter Map Layers
- **Route:** `GET /api/v1/layers`
- **Query Parameters:**
  - `planet` (string, optional): Filter by planet ID.
  - `category` (string, optional): Filter by layer category.
  - `available` (boolean, optional): Filter by renderability.
- **Response `200 OK`:** `LayerResponse[]`
  ```json
  [
    {
      "id": "layer-earth-dem",
      "name": "Global Terrain Elevation",
      "description": "Digital Elevation Model elevation layer",
      "planet_id": "earth",
      "category": "elevation",
      "dataset_id": "ds-earth-dem-demo",
      "variable": "elevation",
      "unit": "meters",
      "available": true,
      "rendering_type": "raster",
      "rendering_url": null,
      "coordinate_reference_system": "EPSG:4326",
      "style": null,
      "created_at": "2026-11-14T00:00:00Z",
      "updated_at": "2026-11-14T00:00:00Z"
    }
  ]
  ```

### 6.2 Get Layer by ID
- **Route:** `GET /api/v1/layers/{id}`
- **Response `200 OK`:** Single `LayerResponse`.
- **Response `404 Not Found`:** When layer ID does not exist.

---

## 7. Regions of Interest Endpoints

### 7.1 List & Search Regions
- **Route:** `GET /api/v1/regions`
- **Query Parameters:**
  - `planet` (string, optional): Filter by planet.
  - `search` (string, optional): Case-insensitive text search matching region name or description.
  - `limit` (integer, default: 20)
  - `offset` (integer, default: 0)
- **Response `200 OK`:** `PaginatedResponse[RegionResponse]`
  ```json
  {
    "items": [
      {
        "id": "region-earth-demo",
        "name": "Demo Terrestrial Basalt Basin",
        "description": "Volcanic terrestrial analog test site",
        "planet_id": "earth",
        "footprint": {
          "type": "Polygon",
          "coordinates": [
            [
              [-115.5, 35.0],
              [-115.0, 35.0],
              [-115.0, 35.5],
              [-115.5, 35.5],
              [-115.5, 35.0]
            ]
          ]
        },
        "coordinate_reference_system": "EPSG:4326",
        "source_provenance": "USGS Astrogeology Terrestrial Analog Database",
        "tags": ["basalt", "volcanic", "roughness_analog"],
        "characteristics": null,
        "is_demo": true,
        "created_at": "2026-11-14T00:00:00Z",
        "updated_at": "2026-11-14T00:00:00Z"
      }
    ],
    "total": 1,
    "limit": 20,
    "offset": 0
  }
  ```

### 7.2 Get Region by ID
- **Route:** `GET /api/v1/regions/{id}`
- **Response `200 OK`:** Single `RegionResponse`.

### 7.3 Get Associated Datasets for Region
- **Route:** `GET /api/v1/regions/{id}/datasets`
- **Response `200 OK`:** `DatasetResponse[]`

### 7.4 Get Associated Layers for Region
- **Route:** `GET /api/v1/regions/{id}/layers`
- **Response `200 OK`:** `LayerResponse[]`

---

## 8. Scientific Analysis Endpoints (Scaffolded Contracts)

In accordance with ADR-007, ADR-008, and ADR-011, analysis POST endpoints strictly validate incoming payloads against Pydantic models. If invalid, they return `422 Unprocessable Entity`. If valid, they return HTTP `501 Not Implemented` with the error envelope explaining that the scientific algorithm is awaiting research calibration.

### 8.1 Analysis Capabilities Probe
- **Route:** `GET /api/v1/analysis/capabilities`
- **Response `200 OK`:**
  ```json
  {
    "modules": {
      "features": "not_implemented",
      "compare": "not_implemented",
      "similarity": "not_implemented",
      "suitability": "not_implemented",
      "rover_testing": "not_implemented"
    },
    "supported_dimensions": [
      "elevation",
      "slope",
      "roughness",
      "thermal_inertia",
      "composition",
      "volatiles"
    ]
  }
  ```

### 8.2 Feature Extraction
- **Route:** `POST /api/v1/analysis/features`
- **Request Body:**
  ```json
  {
    "region_id": "region-earth-demo",
    "dataset_ids": ["ds-earth-dem-demo"],
    "features": ["elevation", "slope", "roughness"]
  }
  ```
- **Response:** `501 Not Implemented`

### 8.3 Pairwise Region Comparison
- **Route:** `POST /api/v1/analysis/compare`
- **Request Body:**
  ```json
  {
    "reference_region_id": "region-moon-demo",
    "candidate_region_id": "region-earth-demo",
    "variables": ["elevation", "slope", "roughness"],
    "weights": {
      "elevation": 0.4,
      "roughness": 0.6
    }
  }
  ```
- **Response:** `501 Not Implemented`

### 8.4 AI Terrestrial Analog Search
- **Route:** `POST /api/v1/analysis/similarity`
- **Request Body:**
  ```json
  {
    "target_region_id": "region-moon-demo",
    "candidate_planet": "earth",
    "variables": ["elevation", "slope", "roughness"],
    "weights": null,
    "limit": 10
  }
  ```
- **Response:** `501 Not Implemented`

### 8.5 Landing Site / Base Suitability
- **Route:** `POST /api/v1/analysis/suitability`
- **Request Body:**
  ```json
  {
    "region_id": "region-moon-demo",
    "criteria": ["slope_safety", "solar_illumination", "resource_proximity"],
    "weights": null
  }
  ```
- **Response:** `501 Not Implemented`

### 8.6 Rover Testbed Identification
- **Route:** `POST /api/v1/analysis/rover-testing`
- **Request Body:**
  ```json
  {
    "target_environment": "lunar_polar_regolith",
    "test_capabilities": ["mobility_traction", "autonomous_navigation"],
    "candidate_region_ids": null
  }
  ```
- **Response:** `501 Not Implemented`

### 8.7 Get Analysis Run Status
- **Route:** `GET /api/v1/analysis/runs/{run_id}`
- **Response:** `404 Not Found` for any non-existent analysis run ID.
