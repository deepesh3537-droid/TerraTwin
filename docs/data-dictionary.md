# TerraTwin Data Dictionary & Canonical Reference

This document establishes the official data dictionary, canonical naming conventions, physical units, coordinate reference system (CRS) standards, and missing-data conventions for TerraTwin.

---

## 1. Canonical Planetary Body Identifiers

All database entities, API endpoints, and GIS processes use lowercase string IDs for planetary bodies:

| Body ID | Name | Mean Radius ($R_{mean}$) | Standard Planetary Reference System | Definition Authority |
|---|---|---|---|---|
| `earth` | Earth | $6371.0\text{ km}$ | `EPSG:4326` (WGS 84 ellipsoidal coordinates) | IOGP / EPSG |
| `moon` | Moon | $1737.4\text{ km}$ | `IAU2000:30100` / `IAU_2015:30100` (Planetocentric) | IAU / IAG Working Group |
| `mars` | Mars | $3389.5\text{ km}$ | `IAU2000:49900` / `IAU_2015:49900` (Planetocentric) | IAU / IAG Working Group |

> [!CRITICAL]
> **Planetary Coordinate Rule (ADR-009):** Extraterrestrial coordinates (Moon, Mars) must **never** be coerced, assumed, or converted to Earth `EPSG:4326`. Attempting to project lunar or Martian coordinates using an Earth WGS 84 ellipsoid creates severe spherical distortion and invalidates distance/area calculations.

---

## 2. Dataset Scientific Categories

Every dataset and layer must be classified into one of the canonical categories below:

| Category | Description | Primary Planetary Variables |
|---|---|---|
| `elevation` | Topography and digital elevation grids | Absolute elevation, relative relief, DEM |
| `imagery` | Optical and radar surface reflectance | Panchromatic, multi-spectral, SAR, orthomosaics |
| `composition` | Geochemical and mineral distribution | Elemental weight percentages, spectral reflectance |
| `geology` | Geomorphological and structural mappings | Crater morphology, volcanic flows, faults, rock fields |
| `thermal` | Surface temperature and thermal properties | Diurnal temperature range, thermal inertia |
| `environmental` | Atmospheric, radiation, and illumination data | Solar incidence, illumination persistence, shadow maps |

---

## 3. Physical Variables & Standard Units

To preserve scientific comparability across datasets, standard physical variables must adhere to SI or standard planetary science units:

| Variable Identifier | Physical Property | Standard Unit | Allowed Formats / Storage |
|---|---|---|---|
| `elevation` | Topographic height above datum | `meters` ($m$) | Floating-point GeoTIFF or scalar float |
| `slope` | Gradient of terrain surface | `degrees` ($^{\circ}$, range: $0^\circ - 90^\circ$) | Floating-point grid or scalar float |
| `roughness` | Micro/macro surface roughness | `dimensionless` (RMS height $\xi$ or Hurst exponent $H$) | Scalar float $[0.0, 1.0]$ |
| `temperature` | Kinetic surface temperature | `Kelvin` ($K$) | Floating-point raster or scalar float |
| `thermal_inertia` | Resistance to temperature changes | $\text{J}\cdot\text{m}^{-2}\cdot\text{K}^{-1}\cdot\text{s}^{-1/2}$ (tiu) | Floating-point grid or float |
| `illumination` | Proportion of daylight exposure | `percentage` ($\%$ or fraction $[0.0, 1.0]$) | Normalized float $[0.0, 1.0]$ |
| `mineralogy` | Mineral phase or spectral feature | `wt%` (weight percent) or band depth | Map/JSON object of components |

---

## 4. Entity Schema Data Dictionary

### 4.1 `Planet`
Stores supported planetary reference bodies.

| Field | Data Type | Nullable | Description |
|---|---|---|---|
| `id` | `VARCHAR(32)` | No (PK) | Canonical identifier (`earth`, `moon`, `mars`) |
| `name` | `VARCHAR(64)` | No | Human-readable name (`Earth`, `Moon`, `Mars`) |
| `description` | `TEXT` | Yes | Scientific summary of body role in platform |
| `radius_km` | `FLOAT` | Yes | Mean planetary radius in kilometers |
| `created_at` | `TIMESTAMPTZ` | No | System creation timestamp (UTC) |
| `updated_at` | `TIMESTAMPTZ` | No | System modification timestamp (UTC) |

### 4.2 `Dataset`
Stores metadata and provenance for open remote sensing and Earth observation datasets.

| Field | Data Type | Nullable | Description |
|---|---|---|---|
| `id` | `VARCHAR(64)` | No (PK) | Unique dataset slug (e.g., `ds-earth-srtm-dem`) |
| `name` | `VARCHAR(255)` | No | Full scientific title of dataset |
| `description` | `TEXT` | Yes | Detailed abstract and summary of the data |
| `planet_id` | `VARCHAR(32)` | No (FK) | Reference to `Planet.id` |
| `category` | `VARCHAR(64)` | No | Scientific category from canonical list |
| `variable` | `VARCHAR(64)` | No | Primary physical variable measured |
| `source_agency` | `VARCHAR(128)` | Yes | Agency providing data (e.g., `NASA / USGS / ESA`) |
| `mission` | `VARCHAR(128)` | Yes | Spaceflight or airborne mission (e.g., `LRO`, `MRO`, `SRTM`) |
| `instrument` | `VARCHAR(128)` | Yes | Sensor instrument (e.g., `LOLA`, `HiRISE`, `C-band Radar`) |
| `format` | `VARCHAR(64)` | Yes | Data container format (e.g., `GeoTIFF`, `Cloud-Optimized GeoTIFF`, `GeoJSON`) |
| `unit` | `VARCHAR(32)` | Yes | Standard physical unit of values |
| `native_resolution` | `VARCHAR(64)` | Yes | Spatial ground sampling distance (e.g., `30m`, `100m/pixel`) |
| `temporal_start` | `TIMESTAMPTZ` | Yes | Acquisition start time (UTC) |
| `temporal_end` | `TIMESTAMPTZ` | Yes | Acquisition end time (UTC) |
| `coordinate_reference_system` | `VARCHAR(64)` | No | Explicit CRS identifier (e.g., `EPSG:4326`, `IAU2000:30100`) |
| `processing_level` | `VARCHAR(32)` | Yes | Standard processing level (`Level 1`, `Level 2`, `Level 3`, `Derived`) |
| `license` | `VARCHAR(128)` | Yes | Open data license (`Public Domain`, `CC-BY-4.0`) |
| `source_url` | `TEXT` | Yes | Canonical web link or DOI to source archive |
| `citation` | `TEXT` | Yes | Academic publication citation string |
| `local_path` | `TEXT` | Yes | Relative file path within `data/` directory (never machine-absolute) |
| `checksum` | `VARCHAR(128)` | Yes | SHA-256 verification hash |
| `ingestion_status` | `VARCHAR(32)` | No | Pipeline status (`available`, `pending`, `prototype`) |
| `quality_notes` | `TEXT` | Yes | Known artifacts, cloud gaps, or missing data flags |
| `is_demo` | `BOOLEAN` | No | Flag indicating synthetic/demo fixture (ADR-008) |
| `created_at` | `TIMESTAMPTZ` | No | System creation timestamp (UTC) |
| `updated_at` | `TIMESTAMPTZ` | No | System modification timestamp (UTC) |

### 4.3 `Layer`
Stores visualization and renderable web map layers.

| Field | Data Type | Nullable | Description |
|---|---|---|---|
| `id` | `VARCHAR(64)` | No (PK) | Unique layer slug (e.g., `layer-moon-lola-elevation`) |
| `name` | `VARCHAR(255)` | No | Layer display title |
| `description` | `TEXT` | Yes | Description of what the map visualizes |
| `planet_id` | `VARCHAR(32)` | No (FK) | Reference to `Planet.id` |
| `category` | `VARCHAR(64)` | No | Scientific category |
| `dataset_id` | `VARCHAR(64)` | Yes (FK) | Optional reference to parent `Dataset.id` |
| `variable` | `VARCHAR(64)` | No | Primary physical variable |
| `unit` | `VARCHAR(32)` | Yes | Unit of values |
| `available` | `BOOLEAN` | No | Whether layer is renderable on the web map |
| `rendering_type` | `VARCHAR(32)` | No | Layer format: `raster`, `vector`, `metadata_only` |
| `rendering_url` | `TEXT` | Yes | Tile URL template or vector endpoint (null if unavailable) |
| `coordinate_reference_system` | `VARCHAR(64)` | No | Native projection of the layer |
| `style` | `JSON` | Yes | Styling rules (color ramp, opacity, breakpoints) |
| `created_at` | `TIMESTAMPTZ` | No | System creation timestamp (UTC) |
| `updated_at` | `TIMESTAMPTZ` | No | System modification timestamp (UTC) |

### 4.4 `Region`
Stores geographic regions of interest on Earth, Moon, or Mars.

| Field | Data Type | Nullable | Description |
|---|---|---|---|
| `id` | `VARCHAR(64)` | No (PK) | Unique region slug (e.g., `region-earth-kilbourne-hole`) |
| `name` | `VARCHAR(255)` | No | Geographical or geological feature name |
| `description` | `TEXT` | Yes | Summary of geological setting and relevance |
| `planet_id` | `VARCHAR(32)` | No (FK) | Reference to `Planet.id` |
| `footprint` | `GEOMETRY(POLYGON)` | Yes | PostGIS spatial polygon boundary |
| `coordinate_reference_system` | `VARCHAR(64)` | No | CRS in which `footprint` coordinates are expressed |
| `source_provenance` | `TEXT` | Yes | Origin of boundary definition (e.g., `USGS Astrogeology`) |
| `tags` | `JSON` | Yes | Array of morphological tags (`["basalt", "maar", "roughness"]`) |
| `characteristics` | `JSON` | Yes | Key-value dictionary of extracted physical attributes |
| `is_demo` | `BOOLEAN` | No | Demo fixture flag |
| `created_at` | `TIMESTAMPTZ` | No | System creation timestamp (UTC) |
| `updated_at` | `TIMESTAMPTZ` | No | System modification timestamp (UTC) |

### 4.5 `AnalysisRun`
Tracks execution parameters and results for analytical pipelines.

| Field | Data Type | Nullable | Description |
|---|---|---|---|
| `id` | `VARCHAR(64)` | No (PK) | UUID run identifier |
| `analysis_type` | `VARCHAR(64)` | No | Type (`features`, `compare`, `similarity`, `suitability`, `rover_testing`) |
| `status` | `VARCHAR(32)` | No | Status (`pending`, `running`, `completed`, `failed`) |
| `parameters` | `JSON` | No | Input payload and weights submitted to run |
| `results` | `JSON` | Yes | Output rankings or characteristics |
| `error_message` | `TEXT` | Yes | Error details if run failed |
| `created_at` | `TIMESTAMPTZ` | No | Submission timestamp (UTC) |
| `completed_at` | `TIMESTAMPTZ` | Yes | Completion timestamp (UTC) |

---

## 5. Missing Data Conventions (ADR-008, FE-16)

Scientific integrity requires uncompromising conventions for missing, unmeasured, or pending observations:

1. **In Database Storage:**
   - Unmeasured attributes must be stored as SQL `NULL`.
   - Never store `0`, `-9999`, or sentinel strings as real data unless explicitly defined in dataset metadata masks.
2. **In API JSON Responses:**
   - Missing fields must be represented as `null`.
   - Keys must not be fabricated or defaulted to zero.
3. **In Frontend User Interface:**
   - Missing metrics must render as `—` or `"Not specified"`.
   - Never display `0`, `0%`, or a zeroed bar chart for absent telemetry.
   - Uncomputed regional characteristics render an explicit honest state: *"Characteristics not yet computed (pending geospatial feature extraction pipeline)"*.
4. **In Analysis & Algorithms:**
   - Features with missing values must either trigger explicit imputation masks or be omitted from multi-criteria ranking distance calculations with recorded uncertainty penalties.
