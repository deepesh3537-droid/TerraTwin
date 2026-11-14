# Project Memory

> Current project state. Update at the end of every work session.
> Permanent decisions belong in `DECISIONS.md`.

**Last updated:** 2026-11-14

## Current Status
Phase 2 (Backend Foundation) completed and verified. FastAPI application skeleton, Pydantic settings, centralized error envelopes, database session/models, Alembic initial migration, idempotent demo seed, and health endpoints implemented and tested with 5 passing tests.

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
  - TASK-010: Created `backend/pyproject.toml` (PEP 621) with FastAPI, SQLAlchemy, Alembic, Psycopg, GeoAlchemy2, Pytest, HTTPX.
  - TASK-011: FastAPI app skeleton (`app/main.py`, `app/api/router.py`) with versioned `/api/v1` prefix and CORS middleware.
  - TASK-012: Settings via Pydantic (`app/core/config.py`), logging (`app/core/logging.py`), centralized error envelope & handlers (`app/core/errors.py` incl. 501 `NotImplementedException`).
  - TASK-013: Database session and Base (`app/core/database.py`, `app/db/base.py`, `app/db/session.py`).
  - TASK-014: SQLAlchemy models: `Planet`, `Dataset`, `Layer`, `Region`, `AnalysisRun` with explicit CRS tracking per ADR-009.
  - TASK-015: Alembic setup and initial migration `0001_initial_postgis_and_models.py` (verified via `alembic heads` and `--sql` static generation).
  - TASK-016: Idempotent seed script (`app/db/seed.py`) with `earth`, `moon`, `mars` and minimal demo records (`is_demo: true`, no invented measurements).
  - TASK-017: Health endpoints `/health`, `/api/v1/health/ready`, `/api/v1/system/info`.
  - TASK-018: Verified migration, seed execution, Uvicorn configuration, and Pytest coverage (5 tests passed: BE-01, BE-02, BE-03, BE-04, DB-03).

## Environment Notes & Discoveries
- Python: 3.14.6 (`python.exe` in PATH). Note: `pyproject.toml` readme must be local to package directory (`backend/README.md`) for PEP 517 build.
- Asyncio on Windows Sandbox: On Windows, loopback network socket/IPC operations required by `asyncio` Proactor loop require network execution permissions. Tests use `httpx.ASGITransport` with `@pytest.mark.asyncio`.
- Node.js: v25.2.1 (`node.exe` in PATH). Run `npm.cmd` directly in Windows PowerShell.
- Git: Installed in user space at `$env:LOCALAPPDATA\Programs\Git\cmd\git.exe`.
- Docker Desktop: Being installed manually by owner. Live container test (TASK-007) deferred.

## Current Task
Phase 2 completed and verified. Awaiting authorization to begin Phase 3: API Contracts (`TASK-020` through `TASK-029`).

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
