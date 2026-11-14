# Architecture Decisions

> Permanent decisions, so AI assistants and teammates do not silently change them.
> Current project state lives in `MEMORY.md`, not here.
> Source of authority: `context.md`. Where the generic Vibe Coding guide's example stack (Next.js, Supabase, Vercel) differs, **`context.md` wins** (see ADR-001).

Status values: **Accepted** · **Open** (needs a decision) · **Superseded**

---

## ADR-001: Project stack follows `context.md`, not the guide's example stack
**Status:** Accepted
**Decision:** Use React + Vite + TypeScript (frontend), FastAPI (backend), PostgreSQL/PostGIS (database).
**Reason:** The Vibe Coding guide's Next.js/Supabase/Vercel stack is an *example* for a different project. `context.md` defines this project's stack, driven by the planned Python geospatial/ML toolkit.

## ADR-002: Modular monolith
**Status:** Accepted
**Decision:** One frontend app, one FastAPI app, one PostgreSQL/PostGIS database, internal modules for catalog, regions, GIS, analysis, and future ML. No microservices, broker, distributed jobs, or cloud object storage.
**Reason:** Hackathon speed, one-laptop development, simple integration of three teammates' work.

## ADR-003: Frontend toolchain
**Status:** Accepted
**Decision:** React, Vite, TypeScript, Tailwind CSS, React Router, Lucide React (icons), Recharts (charts when needed).
**Reason:** Specified in `context.md`.

## ADR-004: Backend toolchain
**Status:** Accepted
**Decision:** Python, FastAPI, Pydantic (validation + settings), SQLAlchemy 2.x, Alembic, Psycopg, Pytest. Planned scientific toolkit: GeoPandas, Rasterio, Shapely, PyProj, NumPy, SciPy, Scikit-learn. Heavy processing stays out of startup paths; optional libraries imported only where needed.
**Reason:** Specified in `context.md`.

## ADR-005: PostgreSQL + PostGIS via Docker Compose
**Status:** Accepted
**Decision:** Compose manages only the database; frontend and backend run natively for hot reload.
**Reason:** Simple, reproducible, no paid services.

## ADR-006: Map rendering behind an adapter
**Status:** Accepted
**Decision:** MapLibre GL JS is the initial renderer, wrapped by `PlanetaryMap` / `PlanetaryMapAdapter`. Map sources are configurable (e.g. `VITE_EARTH_MAP_STYLE_URL`); no hard-coded paid provider or secret key. Moon/Mars show a not-configured state until valid imagery/CRS handling exists.
**Reason:** Earth, Moon, and Mars are not interchangeable coordinate systems; the renderer must be swappable.

## ADR-007: Versioned API with honest unimplemented behavior
**Status:** Accepted
**Decision:** All APIs under `/api/v1`; `snake_case` JSON; UUID string IDs; `limit`/`offset` pagination; `404` unknown resource; `422` invalid input; `501` for planned-but-unbuilt scientific operations; UTC ISO-8601 timestamps; common error envelope `{ "error": { code, message, details, request_id } }`.
**Reason:** Lets teammates build against stable contracts before implementations exist.

## ADR-008: No fabricated science
**Status:** Accepted
**Decision:** No fake scores, probabilities, rasters, measurements, citations, or source URLs. Missing data is `null`/unavailable, never `0`. Demo records carry `is_demo: true`.
**Reason:** Scientific integrity.

## ADR-009: CRS stored with every spatial asset
**Status:** Accepted
**Decision:** Store a CRS identifier alongside every geometry, footprint, and raster asset. Never label lunar/Martian coordinates as EPSG:4326. No distance/area/slope/cross-planet computation until body-specific projections are implemented and validated. Base schema may use GeoJSON/JSONB + explicit CRS, or PostGIS geometry with CRS kept separately; unknown-SRID columns are documented and not used for metric calculations.
**Reason:** Cross-planet geometry errors are silent and scientifically invalid.

## ADR-010: Large data stays out of Git and relational rows
**Status:** Accepted
**Decision:** Raw files in `data/raw/`, processed in `data/processed/` (or a configurable external root), manifests in `data/manifests/`, tiny labelled fixtures in `data/samples/`. DB stores metadata, references, footprints, results. `local_path` is always relative to the configured data root.
**Reason:** Repo size, portability, performance.

## ADR-011: Similarity is a ranking metric, not a probability
**Status:** Accepted
**Decision:** The base does not implement a score. Any future baseline (`sum(weight_i * feature_similarity_i) / sum(available_weight_i)`) is only a starting point; the scientific team defines transformations, units, normalization, weights, missing-data handling, uncertainty, validation. Per-dimension results are preserved.
**Reason:** Avoid unsupported probabilistic claims.

## ADR-012: No auth, payments, or paid services in the base
**Status:** Accepted
**Decision:** Authentication, user management, collaboration, payments, paid APIs/tiles/keys are not dependencies of the base.
**Reason:** Reduce scope and friction for hackathon handoff.

## ADR-013: One repository, feature branches
**Status:** Accepted
**Decision:** Single Git repo; feature branches + PR/merge; shared schemas/contracts changed only through review and documented; environment values live in `.env`.
**Reason:** Three people extend one foundation without breaking contracts.

## ADR-014: Frontend HTTP client is Axios
**Status:** Accepted
**Decision:** Use Axios with a centralized API client instance (`services/apiClient.ts`) and typed endpoint modules (`services/endpoints/`).
**Reason:** Selected by owner in Phase 0. Provides robust request/response interceptors, centralized error envelope transformation, and timeout configuration.

## ADR-015: Backend dependency management via `pyproject.toml`
**Status:** Accepted
**Decision:** Standardize on `pyproject.toml` (PEP 621 / standard modern Python packaging).
**Reason:** Selected by owner in Phase 0. Single configuration file for metadata, dependencies, scripts, and tool configs (e.g. pytest, ruff/black).

## ADR-016: Local development deployment target for base version
**Status:** Accepted
**Decision:** Target local development environment only (PostgreSQL + PostGIS in Docker Compose, native FastAPI and Vite servers for hot-reload).
**Reason:** Selected by owner in Phase 0. Keeps base version friction-free for one-laptop development and team handoff. Cloud deployment remains out of scope for the base.

## ADR-017: Repository license
**Status:** Accepted
**Decision:** Unlicensed / Proprietary (leave open / all rights reserved until final hackathon submission).
**Reason:** Selected by owner in Phase 0.

---

## Open decisions (must be resolved and recorded)

None currently open. All baseline ADRs (ADR-001 through ADR-017) are Accepted.
