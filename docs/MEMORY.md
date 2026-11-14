# Project Memory

> Current project state. Update at the end of every work session.
> Permanent decisions belong in `DECISIONS.md`.

**Last updated:** 2026-11-14

## Current Status
Phase 3 (API Contracts) completed and verified. Complete domain API surface implemented across routes, services, repositories, schemas, and extension points. Automated test suite has 22 passing tests covering BE-01 through BE-21 with 0 failures.

## Completed
- Phase 0: Planning & Documentation (TASK-000, TASK-000a, TASK-000b)
  - ADR-014 through ADR-017 resolved and documented.
- Phase 1: Repository Skeleton & Configuration:
  - TASK-001: Created `frontend/`, `backend/`, `docs/`, and `data/` directories.
  - TASK-002: Created root `.gitignore` covering environment files, venvs, node_modules, build outputs, and data directories.
  - TASK-003: Created `.env.example` with documented backend and frontend configurations.
  - TASK-004: Created `docker-compose.yml` for PostgreSQL + PostGIS (`postgis/postgis:16-3.4`).
  - TASK-005: Created `data/{raw,processed,samples,manifests}` with `.gitkeep` files and `dataset_manifest.example.json`.
  - TASK-006: Installed Git (2.56.0), initialized repository, staged files, and made initial commit `a4ada95`.
- Phase 2: Backend Foundation:
  - TASK-010 to TASK-018: Built models, migrations, seed, and health routes.
- Phase 3: API Contracts:
  - TASK-020: Pydantic schemas for common pagination/error envelopes, planets, datasets, layers, regions, and analysis request contracts.
  - TASK-021: Clean repository layer (`PlanetRepository`, `DatasetRepository`, `LayerRepository`, `RegionRepository`) and service layer (`CatalogService`, `RegionService`).
  - TASK-022: Planets routes (`GET /api/v1/planets`, `GET /api/v1/planets/{id}`).
  - TASK-023: Datasets routes (`GET /api/v1/datasets`, `GET /api/v1/datasets/{id}`, `GET /api/v1/datasets/{id}/layers`) with filtering and pagination.
  - TASK-024: Layers routes (`GET /api/v1/layers`, `GET /api/v1/layers/{id}`) with filtering and availability status.
  - TASK-025: Regions routes (`GET /api/v1/regions`, `GET /api/v1/regions/{id}`, `/datasets`, `/layers`) with search and pagination.
  - TASK-026: Analysis capabilities route (`GET /api/v1/analysis/capabilities`) reporting honest `not_implemented` module states.
  - TASK-027: Planned analysis POST routes (`features`, `compare`, `similarity`, `suitability`, `rover-testing`) validating input schemas and returning HTTP 501; `runs/{id}` returning HTTP 404.
  - TASK-028: Extension point interfaces in `app/geospatial/` and `app/analysis/` with body-specific CRS validation (`coordinate_metadata.py`).
  - TASK-029: 22 automated tests passing in 0.51s, verifying BE-01 through BE-21, DB-03, DB-04, and DB-05.

## Current Task
Phase 3 completed and verified. Awaiting authorization to begin Phase 4: Frontend Foundation (`TASK-030` through `TASK-036`).

## Not Verified / Not Done
- TASK-007 / DB-01: PostGIS live container startup (pending host Docker Desktop setup).
- NASA-provided datasets have not been inspected; formats, CRS, and schemas are unknown.

## Known Issues / Open Items
- Target users, hackathon deadline, team member names, and design token values remain **TBD** (see `PRD.md` §14 and `DESIGN.md`).

## Assumptions Recorded
- File `RULES.md` (the request said `RULE.md`; the guide and all cross-references use `RULES.md`).
- Uppercase doc filenames confirmed (TASK-000b).

## Next Step
Obtain owner approval to begin Phase 1 (TASK-001).
