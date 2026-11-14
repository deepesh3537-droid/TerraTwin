# TerraTwin

TerraTwin is a web platform for the **NASA Space Apps Challenge**. It uses open Earth, Moon, and Mars data to help identify and characterize terrestrial environments that can serve as analogs for future lunar or Martian landing sites, bases, and exploration operations.

> Given a selected region of the Moon or Mars, which locations on Earth have comparable measurable characteristics, and what evidence supports that comparison?

## Status

**Planning stage.** This repository currently contains the project documentation pack only. The application (frontend, backend, database) has **not been built yet**. Track progress in [`TASKS.md`](TASKS.md) and [`docs/MEMORY.md`](docs/MEMORY.md).

The base version is a runnable, integration-ready **foundation**, not a validated scientific model. No similarity scores, probabilities, or measurements are produced. Analysis routes return an honest `501 Not Implemented` until built.

## Documentation Index

| File | Purpose |
|---|---|
| [`docs/PRD.md`](docs/PRD.md) | What we are building and why |
| [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) | How it is built; folder structure; API; data model |
| [`docs/DESIGN.md`](docs/DESIGN.md) | How it should look and feel |
| [`RULES.md`](RULES.md) | Rules for AI assistants and developers |
| [`TASKS.md`](TASKS.md) | What to build next |
| [`docs/DECISIONS.md`](docs/DECISIONS.md) | Permanent technical decisions (ADRs) |
| [`docs/MEMORY.md`](docs/MEMORY.md) | Current project state |
| [`docs/TEST_PLAN.md`](docs/TEST_PLAN.md) | How we verify it |
| [`docs/SECURITY.md`](docs/SECURITY.md) | How we protect it |

To be created during the base build: `docs/api-contracts.md`, `docs/data-dictionary.md`, `docs/team-ownership.md`, `docs/dataset-registration.md`.

## Planned Stack

- **Frontend:** React, Vite, TypeScript, Tailwind CSS, React Router, MapLibre GL JS (behind an adapter), Lucide React, Recharts
- **Backend:** Python, FastAPI, Pydantic, SQLAlchemy 2.x, Alembic, Psycopg, Pytest
- **Scientific toolkit (planned):** GeoPandas, Rasterio, Shapely, PyProj, NumPy, SciPy, Scikit-learn
- **Database:** PostgreSQL + PostGIS (Docker Compose)
- **Architecture:** modular monolith; one repo

## Planned Pages

`/` Overview · `/explorer` · `/compare` · `/analog-finder` · `/suitability` · `/rover-lab` · `/catalog` · `/methodology`

## Local Development (planned: NOT yet verified)

> These steps describe the intended workflow. Exact commands must be confirmed and corrected once the code exists (TASK-050). Do not rely on them yet.

Prerequisites (Windows): Git, Docker Desktop, Python, Node.js LTS, a modern browser.

```powershell
# 1. Start PostGIS
docker compose up -d

# 2. Backend
cd backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1
# install dependencies (pip install -e . via pyproject.toml per ADR-015)
alembic upgrade head
# run seed script (demo records only)
uvicorn app.main:app --reload

# 3. Frontend (new terminal)
cd frontend
npm install
npm run dev
```

Then open the UI (default Vite port `5173`) and the API docs at `http://localhost:8000/docs`.

Tests and builds: `pytest` (backend) and `npm run build` (frontend), once configured.

### Configuration (planned)
```env
# Backend
APP_ENV=development
API_V1_PREFIX=/api/v1
DATABASE_URL=postgresql+psycopg://terratwin:change_me@localhost:5432/terratwin
CORS_ORIGINS=http://localhost:5173
DATA_ROOT=./data

# Frontend
VITE_API_BASE_URL=http://localhost:8000/api/v1
VITE_EARTH_MAP_STYLE_URL=
```
`change_me` is a **local development value only**. Never commit real secrets.

## Data

Large datasets are **not** committed to Git. Place original files in `data/raw/` and derived files in `data/processed/` (both Git-ignored except `.gitkeep`). Dataset metadata manifests live in `data/manifests/`; tiny labelled fixtures in `data/samples/`. The NASA datasets have not yet been inspected.

## Team Workflow

1. One developer builds and tests the base on one laptop.
2. The base is pushed to a shared Git repository.
3. Three teammates extend it on feature branches inside the same architecture.

| Role | Suggested area | Member |
|---|---|---|
| Member 1 | Frontend & map visualization | **TBD** |
| Member 2 | GIS processing & dataset ingestion | **TBD** |
| Member 3 | Backend analysis & ML/similarity | **TBD** |
| Base creator | Architecture, contracts, integration | **TBD** |

Rules: one repo; feature branches + PRs; shared schemas/contracts changed only through review; document API changes.

## Scientific Principles

- A similarity score is a **ranking metric, not a probability**.
- Missing data is never zero.
- Demo records are labelled `is_demo: true` and are not NASA observations.
- Moon and Mars coordinates are never assumed to be EPSG:4326.

## Assumptions & TBD

- Assumptions: none beyond those listed in [`docs/MEMORY.md`](docs/MEMORY.md).
- **TBD:** target users, deadline, team member assignments, design token values. (Decided in Phase 0: HTTP client = Axios [ADR-014], packaging = pyproject.toml [ADR-015], deployment = local development [ADR-016]).

## License

Proprietary / All Rights Reserved until final hackathon submission (ADR-017).
