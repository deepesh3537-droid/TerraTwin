# Tasks

> Work one task at a time: **Implement → Test → Review → Mark complete → next task.**
> Phases follow `context.md` §17. Keep the app runnable after every phase and summarize exactly what was created and what still needs configuration.
> Never tick a box unless the work was actually done and verified.

Legend: `[ ]` not started · `[x]` done

---

## Phase 0: Planning & Documentation
- [x] TASK-000: Generate documentation pack (PRD, ARCHITECTURE, DESIGN, TEST_PLAN, SECURITY, DECISIONS, MEMORY, README, TASKS, RULES)
- [x] TASK-000a: Owner confirms open questions (see `PRD.md` §14, `DECISIONS.md` open decisions)
- [x] TASK-000b: Decide docs filename convention (`ARCHITECTURE.md` vs `architecture.md`) and whether to generate the 4 extra required docs

## Phase 1: Repository Skeleton & Configuration
- [x] TASK-001: Create `frontend/`, `backend/`, `docs/`, `data/` folders per `ARCHITECTURE.md`
- [x] TASK-002: Create `.gitignore` (env files, venvs, node_modules, build output, data dirs except `.gitkeep`)
- [x] TASK-003: Create `.env.example` (backend + frontend variables, safe local defaults)
- [x] TASK-004: Create `docker-compose.yml` for PostgreSQL + PostGIS (local dev password, documented)
- [x] TASK-005: Create `data/{raw,processed,samples,manifests}` with `.gitkeep` and manifest example
- [x] TASK-006: Initialize Git and make first commit
- [ ] TASK-007: Verify PostGIS container starts (Docker Desktop not installed on host)

## Phase 2: Backend Foundation
- [x] TASK-010: Decide dependency approach (pyproject vs requirements) and record in `DECISIONS.md`
- [x] TASK-011: FastAPI app skeleton (`main.py`, `api/router.py`, versioned prefix)
- [x] TASK-012: Settings via Pydantic (`core/config.py`), logging, centralized errors (`core/errors.py` incl. NotImplemented handler)
- [x] TASK-013: Database session/base (`core/database.py`, `db/base.py`, `db/session.py`)
- [x] TASK-014: SQLAlchemy models: Planet, Dataset, Layer, Region, AnalysisRun (CRS stored with geometry)
- [x] TASK-015: Alembic setup + initial migration (enable PostGIS extension, create tables)
- [x] TASK-016: Seed script: `earth`, `moon`, `mars` + minimal demo records (`is_demo: true`, no invented values)
- [x] TASK-017: Health endpoints: `/health`, `/api/v1/health/ready`, `/api/v1/system/info`
- [x] TASK-018: Verify migration + seed + backend start

## Phase 3: API Contracts
- [ ] TASK-020: Pydantic schemas (common, planet, dataset, layer, region, analysis) incl. pagination + error envelope
- [ ] TASK-021: Repositories (dataset, layer, region) and services (catalog, region)
- [ ] TASK-022: Planets routes
- [ ] TASK-023: Datasets routes (filters: planet, category, variable, status; pagination)
- [ ] TASK-024: Layers routes (filters: planet, category, available)
- [ ] TASK-025: Regions routes (filters: planet, search; datasets/layers sub-routes)
- [ ] TASK-026: Analysis capabilities route (honest statuses)
- [ ] TASK-027: Analysis POST routes (`features`, `compare`, `similarity`, `suitability`, `rover-testing`): validate → `501`; `runs/{run_id}` → `404`
- [ ] TASK-028: Interfaces/extension points: `geospatial/` and `analysis/` (no fake implementations)
- [ ] TASK-029: Backend tests BE-01 to BE-21 (`TEST_PLAN.md`) and run them

## Phase 4: Frontend Foundation
- [ ] TASK-030: Vite + React + TypeScript + Tailwind setup
- [ ] TASK-031: Router with all 8 routes
- [ ] TASK-032: Application shell (sidebar, top bar, main area)
- [ ] TASK-033: Shared state components: loading, empty, error, not-implemented, not-configured
- [ ] TASK-034: Page placeholders for all pages
- [ ] TASK-035: Decide HTTP client (Axios vs fetch) and record in `DECISIONS.md`
- [ ] TASK-036: Finalize design tokens with owner (`DESIGN.md`)

## Phase 5: Frontend Integration
- [ ] TASK-040: Typed API client (`apiClient.ts`, `endpoints/`) + TS types matching schemas
- [ ] TASK-041: Catalog page: list, filter, detail with provenance
- [ ] TASK-042: Planet selector + shared selected-body state
- [ ] TASK-043: `PlanetaryMap` + `PlanetaryMapAdapter` boundary + MapLibre adapter; Earth canvas; Moon/Mars not-configured state
- [ ] TASK-044: Layer panel connected to backend (unavailable layers disabled)
- [ ] TASK-045: Region list/search + Region Inspector
- [ ] TASK-046: Overview page (status, counts)
- [ ] TASK-047: Compare / Analog Finder / Suitability / Rover Lab / Methodology pages (forms wired to contracts, `501` friendly state, no scores)
- [ ] TASK-048: Loading, empty, error handling verified across all views
- [ ] TASK-049: Frontend checks FE-01 to FE-16 and responsive checklist (375 / 768 / 1440 px)

## Phase 6: Documentation & Validation
- [ ] TASK-050: Root `README.md` with exact Windows PowerShell commands (prereqs, DB, venv, migrate, seed, backend, frontend, URLs, tests/build); record assumptions
- [ ] TASK-051: `docs/api-contracts.md` (consistent with OpenAPI)
- [ ] TASK-052: `docs/data-dictionary.md` (body IDs, fields, categories, units/CRS, missing-data conventions)
- [ ] TASK-053: `docs/team-ownership.md`
- [ ] TASK-054: `docs/dataset-registration.md` (inspect → provenance/license → units/CRS → store raw → manifest → preprocess → register; no assumed formats)
- [ ] TASK-055: Run backend tests and frontend production build; fix errors
- [ ] TASK-056: Update `MEMORY.md`, `DECISIONS.md`, `TEST_PLAN.md` statuses with real results

## Phase 7: Handoff Readiness (all must pass before distributing)
**Run and setup**
- [ ] Fresh clone configurable from README
- [ ] PostGIS starts from Compose
- [ ] Backend starts
- [ ] Frontend starts
- [ ] No laptop-specific absolute paths

**API and database**
- [ ] `/health` works; readiness reports DB status correctly
- [ ] Migrations run
- [ ] Planets return Earth, Moon, Mars
- [ ] Dataset/layer/region endpoints work, incl. empty results and filtering
- [ ] Capabilities endpoint reports scaffolded modules honestly
- [ ] Planned analysis routes validate and return consistent `501`
- [ ] `/docs` shows the contract

**Frontend**
- [ ] Shell and navigation work; all pages load
- [ ] Explorer has planet selector + map workspace
- [ ] Missing Moon/Mars imagery shown as not-configured
- [ ] Layer panel connected to backend
- [ ] Region selection opens Region Inspector
- [ ] Catalog lists/filters from backend
- [ ] Not-implemented pages show status, no fabricated scores
- [ ] Loading, empty, error states handled

**Quality and handoff**
- [ ] Backend tests pass
- [ ] Frontend production build passes
- [ ] No committed credentials or large datasets
- [ ] Required docs exist
- [ ] A teammate can tell where to add GIS / ML / frontend work

## Phase 8: After Handoff (NOT part of the base)
Suggested ownership (reassignable). Each item implemented behind existing contracts.

**Member 1: Frontend & map**
- [ ] Richer map visualizations, real layer rendering/styling, synchronized planetary comparison, heatmaps/overlays, charts

**Member 2: GIS & ingestion**
- [ ] Inspect real NASA datasets, ingestion adapters, raster/vector preprocessing, body-specific CRS handling, terrain features, tiling

**Member 3: Analysis & ML**
- [ ] Feature normalization, similarity/ranking (not a probability), suitability, rover testing; calibration only with validation evidence

**Future modules:** three-planet comparison · AI analog finder · similarity heatmaps · base/landing-site suitability · rover-testing environments

## Per-Feature Loop
`READ → UNDERSTAND → PLAN → IMPLEMENT → TEST → REVIEW → FIX → COMMIT → UPDATE DOCUMENTATION`
