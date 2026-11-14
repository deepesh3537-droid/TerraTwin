# Architecture

> Architecture = **HOW** the application works.
> Source: `context.md` sections 4, 6–12. See `DECISIONS.md` for the reasoning behind each choice.

---

## 1. Style: Modular Monolith

```
┌────────────────────────┐
│  Frontend (React/Vite) │  one app
└───────────┬────────────┘
            │ HTTP, JSON  (VITE_API_BASE_URL → /api/v1)
┌───────────▼────────────┐
│  Backend (FastAPI)     │  one app, internal modules
│  catalog · regions ·   │
│  geospatial · analysis │
└───────────┬────────────┘
            │ SQLAlchemy / Psycopg
┌───────────▼────────────┐        ┌──────────────────────┐
│ PostgreSQL + PostGIS   │        │ data/ (files on disk)│
│ (Docker Compose)       │        │ raw · processed ·    │
│ metadata, footprints,  │        │ samples · manifests  │
│ analysis results       │        └──────────────────────┘
└────────────────────────┘
```

No microservices, message broker, distributed jobs, or cloud object storage in the base version. If long-running raster analysis is added later, it can move to background jobs without changing the public request/response concepts.

## 2. Technology Stack

| Layer | Technology |
|---|---|
| Frontend | React, Vite, TypeScript, Tailwind CSS, React Router, MapLibre GL JS (behind adapter), Lucide React, Recharts |
| HTTP client | Axios (ADR-014) |
| Backend | Python, FastAPI, Pydantic, SQLAlchemy 2.x, Alembic, Psycopg |
| Scientific toolkit (planned) | GeoPandas, Rasterio, Shapely, PyProj, NumPy, SciPy, Scikit-learn |
| Backend tests | Pytest |
| Database | PostgreSQL + PostGIS |
| Local infra | Docker Compose (database only) |
| Dependency mgmt (backend) | `pyproject.toml` (ADR-015) |
| Deployment | Local development only for base (ADR-016) |

## 3. Folder Structure

```text
terratwin/
│
├── README.md
├── RULES.md
├── TASKS.md
├── .env.example
├── .gitignore
├── docker-compose.yml            # PostgreSQL + PostGIS only
│
├── docs/
│   ├── PRD.md
│   ├── ARCHITECTURE.md           # this file
│   ├── DESIGN.md
│   ├── TEST_PLAN.md
│   ├── SECURITY.md
│   ├── DECISIONS.md
│   ├── MEMORY.md
│   │   # Required by context.md, created during the base build
│   │   # (not part of this documentation pack. See MEMORY.md open items):
│   ├── api-contracts.md
│   ├── data-dictionary.md
│   ├── team-ownership.md
│   └── dataset-registration.md
│
├── backend/
│   ├── pyproject.toml            # PEP 621 (ADR-015)
│   ├── alembic.ini
│   ├── alembic/                  # migrations (initial migration required)
│   └── app/
│       ├── main.py               # FastAPI app, router registration, error handlers
│       ├── api/
│       │   ├── router.py
│       │   └── v1/
│       │       ├── health.py     # /health, /api/v1/health/ready, /api/v1/system/info
│       │       ├── planets.py
│       │       ├── datasets.py
│       │       ├── layers.py
│       │       ├── regions.py
│       │       └── analysis.py   # capabilities + planned 501 routes + runs
│       ├── core/
│       │   ├── config.py         # Pydantic settings from environment
│       │   ├── database.py
│       │   ├── logging.py
│       │   └── errors.py         # error envelope, NotImplemented exception + handler
│       ├── models/               # SQLAlchemy: planet, dataset, layer, region, analysis_run
│       ├── schemas/              # Pydantic: common, planet, dataset, layer, region, analysis
│       ├── repositories/         # dataset_repository, layer_repository, region_repository
│       ├── services/             # catalog_service, region_service
│       ├── geospatial/           # EXTENSION POINT: GIS teammate
│       │   ├── interfaces.py
│       │   ├── coordinate_metadata.py
│       │   ├── raster_service.py # no fake processing
│       │   └── vector_service.py # no fake processing
│       ├── analysis/             # EXTENSION POINT: ML/analysis teammate
│       │   ├── interfaces.py
│       │   ├── feature_extraction.py
│       │   ├── similarity.py
│       │   ├── suitability.py
│       │   └── rover_testing.py
│       ├── db/
│       │   ├── base.py
│       │   ├── session.py
│       │   └── seed.py           # demo records only, is_demo: true
│       └── tests/
│
├── frontend/
│   ├── package.json
│   ├── vite.config.ts
│   └── src/
│       ├── main.tsx
│       ├── app/                  # App.tsx, router.tsx, providers.tsx
│       ├── components/
│       │   ├── layout/           # shell: sidebar, top bar, main area
│       │   ├── common/
│       │   └── feedback/         # loading, empty, error, not-implemented, not-configured
│       ├── features/
│       │   ├── overview/
│       │   ├── explorer/
│       │   ├── comparison/
│       │   ├── analog-finder/
│       │   ├── suitability/
│       │   ├── rover-lab/
│       │   ├── catalog/
│       │   └── methodology/
│       ├── map/                  # EXTENSION POINT: frontend/map teammate
│       │   ├── PlanetaryMap.tsx
│       │   ├── adapters/         # MapLibre adapter (+ future adapters)
│       │   └── layers/
│       ├── services/
│       │   ├── apiClient.ts      # the ONLY place base URL / HTTP is configured
│       │   └── endpoints/
│       ├── types/                # TS interfaces matching backend schemas
│       └── styles/
│
├── data/                         # large files never committed (.gitkeep only)
│   ├── raw/                      # original NASA/partner files
│   ├── processed/                # derived files
│   ├── samples/                  # tiny, labelled development fixtures only
│   └── manifests/                # dataset metadata manifests + examples
│
└── tests/ (optional)             # cross-stack/e2e later; backend tests live in backend/app/tests
```

The exact arrangement may be adjusted if it stays clear and modular. Do not create empty files that serve no purpose; create working scaffolds.

## 4. Layering and Module Boundaries

```
api/v1 routes  →  services  →  repositories  →  models/DB
      ↓               ↓
   schemas      geospatial/ and analysis/ interfaces
```

Rules:
- **Routes** handle HTTP only: parse/validate with schemas, call a service, return a schema. No business or SQL logic.
- **Services** hold business logic and orchestrate repositories and interfaces.
- **Repositories** are the only code that talks to the database.
- **`geospatial/` and `analysis/`** expose interfaces; implementations plug in behind them without changing API contracts.
- **Ingestion is separate** from the API and frontend.
- **Frontend components never build ad hoc URLs**; they use `services/apiClient.ts` and `services/endpoints/`.
- Frontend UI components contain no data-fetching details; features call endpoint modules.
- Schemas and TS types must match; contract changes are reviewed and documented.

## 5. API Surface (all under `/api/v1` unless noted)

| Method | Endpoint | Base behavior |
|---|---|---|
| GET | `/health` (unversioned) | Process health |
| GET | `/api/v1/health/ready` | DB readiness + service status |
| GET | `/api/v1/system/info` | App/API version, module readiness |
| GET | `/api/v1/planets` · `/{planet_id}` | Earth, Moon, Mars (`earth`, `moon`, `mars`); `404` if unknown |
| GET | `/api/v1/datasets` | Filters: `planet`, `category`, `variable`, `status`; `limit`, `offset` |
| GET | `/api/v1/datasets/{dataset_id}` · `/layers` | Detail; associated layers |
| GET | `/api/v1/layers` | Filters: `planet`, `category`, `available` |
| GET | `/api/v1/layers/{layer_id}` | Detail incl. rendering availability (`rendering_url` may be `null`) |
| GET | `/api/v1/regions` | Filters: `planet`, `search`; `limit`, `offset` |
| GET | `/api/v1/regions/{region_id}` · `/datasets` · `/layers` | Detail; associated datasets/layers |
| GET | `/api/v1/analysis/capabilities` | Module status: `not_implemented` / `prototype` / `available` |
| POST | `/api/v1/analysis/features` | Validate → `501` |
| POST | `/api/v1/analysis/compare` | Validate → `501` |
| POST | `/api/v1/analysis/similarity` | Validate → `501` |
| POST | `/api/v1/analysis/suitability` | Validate → `501` |
| POST | `/api/v1/analysis/rover-testing` | Validate → `501` |
| GET | `/api/v1/analysis/runs/{run_id}` | `404` for unknown run; no fake runs |

Conventions: `snake_case`; UUID string IDs; `404` unknown; `422` invalid; `501` not implemented; UTC ISO-8601 timestamps; OpenAPI at `/docs`.

Error envelope:
```json
{ "error": { "code": "ANALYSIS_NOT_IMPLEMENTED", "message": "…", "details": null, "request_id": "optional" } }
```

Request contracts (contracts only; no results): feature extraction (`region_id`, `dataset_ids`, `features`), comparison (`reference_region_id`, `candidate_region_id`, `variables`, `weights`), similarity (`target_region_id`, `candidate_planet`, `variables`, `weights`, `limit`), suitability (`region_id`, `criteria`, `weights`), rover testing (`target_environment`, `test_capabilities`, `candidate_region_ids`). Field names may be refined, but must stay documented and consistent across frontend and backend.

## 6. Data Model

| Entity | Purpose |
|---|---|
| `Planet` | Supported bodies: `earth`, `moon`, `mars` |
| `Dataset` | Source dataset + provenance metadata |
| `Layer` | Display/analysis layer for a planet, optionally tied to a dataset |
| `Region` | Named area of interest on a planetary body |
| `AnalysisRun` | Reserved for future runs/results; **no fabricated records** |

**Dataset fields** (unknown stays `null`): `id`, `name`, `description`, `planet_id`, `category`, `variable`, `source_agency`, `mission`, `instrument`, `format`, `unit`, `native_resolution`, `temporal_start`, `temporal_end`, `coordinate_reference_system`, `processing_level`, `license`/`usage_terms`, `source_url`, `citation`, `local_path` (relative to data root), `checksum`, `ingestion_status`, `quality_notes`, `created_at`, `updated_at`.

**Layer fields:** `id`, `name`, `description`, `planet_id`, `category`, `dataset_id` (nullable), `variable`, `unit`, `available`, `rendering_type` (`raster` | `vector` | `metadata_only`), `rendering_url` (nullable), `coordinate_reference_system`, optional `style`.

**Region fields:** `id`, `name`, `description`, `planet_id`, coordinates/footprint (when provided), CRS identifier or WKT (when known), source/provenance, tags/categories, and `is_demo` for sample records.

### CRS rule
Store a CRS with every geometry, footprint, and raster asset. Never assume EPSG:4326 for Moon/Mars. No distance/area/slope/cross-planet math until body-specific projection handling is implemented and validated.

### Large-data rule
Original files → `data/raw/`; derived → `data/processed/` (or a configurable external root). The database stores metadata, references, footprints, and results only. Never put large GeoTIFF/NetCDF/raster payloads in relational rows or in Git.

## 7. Map Adapter Design

```
Explorer feature ──► <PlanetaryMap body="moon" layers regions … />
                          │
                          ▼
                 PlanetaryMapAdapter (interface)
                          │
                ┌─────────┴──────────┐
         MapLibreAdapter       (future adapters)
```

- The UI depends only on `PlanetaryMap` / the adapter interface, never on MapLibre directly.
- Map sources are configured by environment (e.g. `VITE_EARTH_MAP_STYLE_URL`). If unset, show a neutral canvas / useful empty state, never crash.
- **Earth:** map canvas in the base. **Moon/Mars:** explicit "not configured" placeholder until valid imagery, CRS, and projection handling exist. Never show incorrect imagery.
- Selected planetary body is shared state for map, layer panel, region list, and Region Inspector.

## 8. Data Flow Examples

**Browse the catalog:** `CatalogPage → endpoints/datasets → apiClient → GET /api/v1/datasets → catalog_service → dataset_repository → PostGIS → schema → UI list (or empty state)`

**Select a region:** `Explorer → select region → shared state → Region Inspector → GET /regions/{id}` (+ `/datasets`, `/layers`) → show metadata; uncomputed characteristics shown as an empty state.

**Run analysis (base):** `Form → POST /analysis/similarity → Pydantic validation (422 if invalid) → service raises NotImplemented → centralized handler → 501 error envelope → friendly "scaffolded but not implemented yet" UI`. No score is shown.

## 9. Configuration

Backend (environment): `APP_ENV`, `API_V1_PREFIX`, `DATABASE_URL`, `CORS_ORIGINS`, `DATA_ROOT`.
Frontend: `VITE_API_BASE_URL`, `VITE_EARTH_MAP_STYLE_URL`.
Local defaults documented in `.env.example`; the Compose DB password is a local dev value only. No machine-specific absolute paths anywhere.

## 10. How to Add a New Feature

1. Read `PRD.md`, this file, `RULES.md`, `TASKS.md`.
2. Check whether the contract already exists in `schemas/` and `docs/api-contracts.md`. Prefer implementing behind it.
3. Backend: add/extend the **schema → repository → service → route**; for scientific work, implement the relevant interface in `geospatial/` or `analysis/`.
4. Frontend: add types in `types/`, an endpoint function in `services/endpoints/`, then the feature UI in `features/<name>/`.
5. Handle loading, empty, error, and `501`/not-configured states.
6. Add tests; update `TEST_PLAN.md`, `TASKS.md`, `MEMORY.md`, and `docs/api-contracts.md` (if the contract changed).
7. Record any new architectural choice in `DECISIONS.md`.

## 11. Extension Points by Teammate (suggested; reassignable)

| Teammate | Area | Where |
|---|---|---|
| Member 1 | Frontend & map visualization | `frontend/src/map/`, `features/*`, heatmaps, overlays, charts |
| Member 2 | GIS processing & dataset ingestion | `backend/app/geospatial/`, `data/manifests/`, ingestion adapters, CRS per body, terrain features, tiling |
| Member 3 | Backend analysis & ML/similarity | `backend/app/analysis/`, normalization, ranking, calibration (only with validation evidence) |
| Base creator | Architecture, shared contracts, integration, release readiness | whole repo |

Integration rules: one repo; feature branches + PRs; no one independently renames shared API fields or tables; contract changes are reviewed and documented.
