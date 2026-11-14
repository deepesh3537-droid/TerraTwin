# TerraTwin

TerraTwin is a web platform developed for the **NASA Space Apps Challenge**. It integrates open Earth, Moon, and Mars geospatial data to identify and characterize terrestrial environments that serve as high-fidelity analogs for lunar and Martian exploration, landing sites, base construction, and surface rover operations.

> **Core Research Question:** Given a selected region on the Moon or Mars, which locations on Earth exhibit comparable measurable characteristics (topography, slope, roughness, composition, thermal inertia), and what provenance and physical evidence support that comparison?

---

## Status

**Base Implementation Complete & Integration-Ready.**

The base architecture is fully built, tested, and verified on Windows:
- **Backend:** FastAPI modular monolith with SQLAlchemy 2.x, Alembic PostGIS migrations, idempotent seeding (`earth`, `moon`, `mars`), and honest HTTP 501 analysis scaffolds. All 22 automated test cases passing.
- **Frontend:** React 18 + Vite + TypeScript + Tailwind CSS application shell with MapLibre GL adapter, responsive layout, dark space UI tokens, and honest scientific state handling. Production build compiles cleanly with zero errors.
- **Scientific Foundation:** In accordance with ADR-008 and ADR-011, similarity is strictly treated as a **multi-criteria ranking metric, not a probability**. Zero fabricated scores or synthetic measurements are produced. Extraterrestrial coordinates strictly track dedicated IAU planetary reference frames (ADR-009).

Progress and verification are tracked in [`TASKS.md`](TASKS.md) and [`docs/MEMORY.md`](docs/MEMORY.md).

---

## Documentation Index

| File | Purpose |
|---|---|
| [`README.md`](README.md) | Project overview, prerequisites, setup instructions, and quick start |
| [`docs/PRD.md`](docs/PRD.md) | Product Requirements Document: problem statement, user personas, requirements |
| [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) | System architecture, directory layout, API design, database schemas, ADR references |
| [`docs/DESIGN.md`](docs/DESIGN.md) | Design specifications: dark theme tokens, layout grids, components, accessibility |
| [`docs/DECISIONS.md`](docs/DECISIONS.md) | Permanent Architecture Decision Records (ADR-001 through ADR-017) |
| [`docs/TEST_PLAN.md`](docs/TEST_PLAN.md) | Verification plan: automated backend test matrix (BE-01–BE-21), frontend checks (FE-01–FE-16) |
| [`docs/SECURITY.md`](docs/SECURITY.md) | Security baseline: CORS policies, rate limiting, credential boundaries, input validation |
| [`docs/MEMORY.md`](docs/MEMORY.md) | Project memory, environment gotchas, active status, and work session log |
| [`RULES.md`](RULES.md) | Operating rules for developers and AI agents (scientific integrity, phase gates) |
| [`TASKS.md`](TASKS.md) | Phase-gated task tracker (Phase 0 through Phase 8) |
| [`docs/api-contracts.md`](docs/api-contracts.md) | Detailed OpenAPI endpoints, request/response envelopes, query parameters, status codes |
| [`docs/data-dictionary.md`](docs/data-dictionary.md) | Canonical reference for bodies, fields, categories, units, planetary CRS, missing data rules |
| [`docs/team-ownership.md`](docs/team-ownership.md) | Team role assignments, module boundaries, branch workflow, and review criteria |
| [`docs/dataset-registration.md`](docs/dataset-registration.md) | Step-by-step dataset intake guide: provenance, manifest schema, CRS validation, registration |

---

## Technical Stack

- **Frontend:** React 18, Vite 5, TypeScript 5.4, Tailwind CSS 3.4, React Router 6, MapLibre GL JS (behind `PlanetaryMapAdapter`), Lucide React, Recharts, Axios.
- **Backend:** Python 3.11+ (verified on 3.14), FastAPI 0.110+, Pydantic v2, SQLAlchemy 2.0, Alembic, Psycopg 3 (binary), Pytest, HTTPX.
- **Database:** PostgreSQL 16 with PostGIS 3.4 (`postgis/postgis:16-3.4` container).
- **Architecture:** Modular monolith in a single repository with strict separation of frontend, backend, data, and docs.

---

## Application Routes

| Path | Feature | Purpose |
|---|---|---|
| `/` | **Overview** | Platform health, live catalog telemetry, system readiness, architectural overview |
| `/explorer` | **Planetary Explorer** | Interactive map workspace with MapLibre, layer switcher, region selector, and Region Inspector |
| `/compare` | **Region Comparison** | Pairwise comparison between extraterrestrial targets and Earth candidate analogs |
| `/analog-finder` | **AI Analog Finder** | Multi-dimensional candidate search ranking terrestrial environments by physical traits |
| `/suitability` | **Base Suitability** | Multivariate evaluation for surface habitats, landing safety, and volatile resources |
| `/rover-lab` | **Rover Testing Lab** | Matches surface environments to rover mobility, terramechanics, and drill testbeds |
| `/catalog` | **Data Catalog** | Searchable planetary data repository with complete scientific provenance and layer views |
| `/methodology` | **Methodology** | Scientific foundations: why ranking ≠ probability, planetary CRS, and zero-fabrication rules |

---

## Local Development (Windows PowerShell)

Follow these exact steps to clone, configure, and run TerraTwin locally on Windows.

### Prerequisites
1. **Git** (v2.40+) — `git --version`
2. **Python 3.11+** (verified on 3.14.6) — `python --version`
3. **Node.js LTS & npm** (verified on Node v25 / npm v11) — `node -v`
4. **Docker Desktop** (with Docker Compose) — `docker compose version`
5. A modern web browser (Chrome, Edge, Firefox).

*(Note: On Windows PowerShell, if script execution is disabled for npm scripts, always use `npm.cmd`).*

---

### Step 1: Start Database Container (PostGIS)

In the repository root, start the PostGIS 16-3.4 container:

```powershell
docker compose up -d
```

Verify that the container is healthy:
```powershell
docker compose ps
```

---

### Step 2: Configure Environment Variables

Copy the template `.env.example` to `.env`:

```powershell
Copy-Item .env.example .env
```

Default local development values:
```env
# Backend
APP_ENV=development
APP_NAME=TerraTwin
DEBUG=True
API_V1_PREFIX=/api/v1
DATABASE_URL=postgresql+psycopg://terratwin:change_me@localhost:5432/terratwin
CORS_ORIGINS=http://localhost:5173
DATA_ROOT=../data

# Frontend
VITE_API_BASE_URL=http://localhost:8000/api/v1
VITE_EARTH_MAP_STYLE_URL=
```
*(Leave `VITE_EARTH_MAP_STYLE_URL` empty to use the built-in offline dark spatial canvas per ADR-006).*

---

### Step 3: Backend Setup, Migrations & Seed

Open a PowerShell terminal and run:

```powershell
# Navigate to backend directory
cd backend

# Create and activate Python virtual environment
python -m venv .venv
.\.venv\Scripts\Activate.ps1

# Install backend dependencies in editable mode (PEP 517/621)
pip install -e .

# Run Alembic database migrations to create PostGIS schema
alembic upgrade head

# Seed initial planetary bodies and demo fixtures (idempotent)
python -m app.db.seed

# Start the FastAPI development server
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

---

### Step 4: Frontend Setup & Startup

Open a **second** PowerShell terminal and run:

```powershell
# Navigate to frontend directory
cd frontend

# Install dependencies
npm.cmd install

# Start Vite development server
npm.cmd run dev
```

---

### Step 5: Access the Application

Once both servers are running:
- **Web UI:** [http://localhost:5173](http://localhost:5173)
- **Interactive OpenAPI Docs:** [http://localhost:8000/docs](http://localhost:8000/docs)
- **Alternative ReDoc:** [http://localhost:8000/redoc](http://localhost:8000/redoc)
- **Root Health Probe:** [http://localhost:8000/health](http://localhost:8000/health)
- **Readiness Probe:** [http://localhost:8000/api/v1/health/ready](http://localhost:8000/api/v1/health/ready)
- **System Info:** [http://localhost:8000/api/v1/system/info](http://localhost:8000/api/v1/system/info)

---

## Verification & Testing

### Backend Automated Test Suite
The backend includes 22 tests covering health, catalogs, regions, honest capabilities, error envelopes, and scientific integrity:

```powershell
cd backend
.\.venv\Scripts\pytest -v
```

### Frontend Production Build
The frontend production build compiles TypeScript, performs static analysis, and builds optimized assets:

```powershell
cd frontend
npm.cmd run build
```

---

## Data Management

Large raw satellite images and high-resolution DEM rasters are **not** committed to Git.
- Raw files: `data/raw/` (Git-ignored)
- Processed rasters/vectors: `data/processed/` (Git-ignored)
- Labelled fixtures/test samples: `data/samples/`
- Manifest files: `data/manifests/` (e.g., [`dataset_manifest.example.json`](data/manifests/dataset_manifest.example.json))

To register a new dataset into the platform, follow [`docs/dataset-registration.md`](docs/dataset-registration.md).

---

## Scientific Principles & Integrity Guarantee

1. **Similarity is a Ranking Metric, Not a Probability (ADR-011):**
   Terrestrial analog scores represent relative multi-criteria rankings across normalized dimensions (slope, roughness, mineralogy). They are never presented as probabilities or percentages.
2. **Explicit Planetary Coordinate Reference Systems (ADR-009):**
   Moon and Mars spatial coordinates use dedicated IAU planetary reference frames (e.g., Moon `IAU2000:30100`, Mars `IAU2000:49900`). Extraterrestrial coordinates are never projected or coerced into Earth `EPSG:4326`.
3. **No Fabricated Telemetry Guarantee (ADR-008):**
   Missing data is explicitly represented as `null` or `—`, never as `0`. Demo records are clearly flagged with `is_demo: true` and are never represented as NASA scientific observations.
4. **Honest Capability Scaffolding:**
   Analysis endpoints validate payloads against Pydantic schemas and return HTTP 501 `NotImplementedException` until scientific algorithms are calibrated by the research team.

---

## Assumptions & Open Decisions

- **Target environment:** Local development on Windows (ADR-016).
- **Database:** Local Docker container running PostgreSQL 16 + PostGIS 3.4 (ADR-004).
- **HTTP Client:** Centralized Axios instance with error normalization (ADR-014).
- **Dependency Management:** `pyproject.toml` (PEP 621) for Python; `package.json` for Node.js (ADR-015).
- **License:** Proprietary / All Rights Reserved until final hackathon submission (ADR-017).

---

## License

Proprietary / All Rights Reserved until final hackathon submission (see ADR-017 in [`docs/DECISIONS.md`](docs/DECISIONS.md)).
