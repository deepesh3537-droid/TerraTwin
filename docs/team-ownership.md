# TerraTwin Team Ownership & Workflow Guidelines

This document establishes the module ownership, directory boundaries, Git branch strategies, and code review rules for extending TerraTwin beyond the base platform.

---

## 1. Architectural Responsibility Matrix

TerraTwin is structured as a **modular monolith** with clean architectural boundaries. Work is distributed across three specialized engineering roles, while preserving shared API contracts and data models:

```
                  ┌──────────────────────────────────────────────┐
                  │          TERRATWIN BASE PLATFORM             │
                  │ (Architecture, Database, Contracts, Shell)  │
                  └──────────────────────┬───────────────────────┘
                                         │
         ┌───────────────────────────────┼───────────────────────────────┐
         ▼                               ▼                               ▼
┌───────────────────┐           ┌───────────────────┐           ┌───────────────────┐
│     MEMBER 1      │           │     MEMBER 2      │           │     MEMBER 3      │
│    Frontend &     │           │   GIS & Dataset   │           │   Analysis, ML    │
│   Visualization   │           │     Ingestion     │           │   & Methodology   │
└───────────────────┘           └───────────────────┘           └───────────────────┘
```

---

## 2. Role Profiles & Ownership

### 2.1 Member 1: Frontend & Visualization Engineer
- **Core Mission:** Deliver intuitive, high-performance planetary exploration and comparison interfaces.
- **Owned Files & Directories:**
  - `frontend/src/features/` (UI feature views: Explorer, Catalog, Compare, Analog Finder, etc.)
  - `frontend/src/map/` (MapLibre layers, styling, custom controls, planetary projection widgets)
  - `frontend/src/components/` (Reusable UI elements, charts, modals, drawers)
- **Primary Deliverables:**
  1. Synchronized dual-map or split-screen comparison views between Earth and lunar/Martian sites.
  2. Dynamic raster tile rendering and layer opacity/color-ramp blending in MapLibre GL.
  3. Interactive feature distribution charts (histograms, radar comparison plots) using Recharts.
  4. Layer legend and interactive polygon drawing tools for custom region selection.
- **Constraints:**
  - Must consume backend endpoints exclusively through `frontend/src/services/` (no ad hoc `fetch()` calls).
  - Must never display missing data as `0` or fabricate similarity percentages.

---

### 2.2 Member 2: GIS & Dataset Ingestion Specialist
- **Core Mission:** Acquire, preprocess, and register real NASA, USGS, and ESA planetary remote sensing datasets.
- **Owned Files & Directories:**
  - `backend/app/geospatial/` (Raster and vector processing services, coordinate transformation pipelines)
  - `data/manifests/` (Dataset registration manifests and metadata definitions)
  - `data/raw/` and `data/processed/` (Local geospatial storage; Git-ignored)
  - `backend/app/repositories/` (Database persistence for datasets, layers, and regions)
- **Primary Deliverables:**
  1. Inspect raw NASA Planetary Data System (PDS) datasets (e.g., LRO LOLA DEMs, MRO CTX/HiRISE imagery).
  2. Implement raster processing pipeline to compute topographic slope, roughness, and aspect using Rasterio / GDAL.
  3. Implement body-specific coordinate transformations respecting IAU planetary reference frames (Moon `IAU2000:30100`, Mars `IAU2000:49900`).
  4. Generate Cloud-Optimized GeoTIFFs (COG) and vector GeoJSON tiles for frontend map streaming.
- **Constraints:**
  - Large binary datasets (>10MB) must **never** be committed to Git.
  - Local filesystem paths must be relative to `data/`, never machine-absolute paths (ADR-003).

---

### 2.3 Member 3: Analysis, Machine Learning & Scientific Modeler
- **Core Mission:** Develop multi-dimensional similarity ranking, habitat suitability models, and rover testbed matching.
- **Owned Files & Directories:**
  - `backend/app/analysis/` (Similarity distance algorithms, normalization, suitability weighted overlay)
  - `backend/app/services/` (Orchestration services executing analysis runs)
  - `docs/DECISIONS.md` (Documenting algorithm formulation, mathematical choices, and weighting ADRs)
- **Primary Deliverables:**
  1. Feature normalization pipelines (min-max scaling, z-score, percentile transforms) accounting for planetary parameter distributions.
  2. Multi-dimensional distance metrics (Euclidean, Mahalanobis, cosine similarity) ranking candidate terrestrial sites against extraterrestrial targets.
  3. Uncertainty and missing-variable penalty formulation (ADR-011: similarity is a ranking metric, not a probability).
  4. Landing site and base suitability weighted overlay models (slope safety + illumination + resource proximity).
  5. Replace scaffolded HTTP 501 analysis handlers with verified algorithm implementations.
- **Constraints:**
  - Algorithms must be scientifically documented with citations in `docs/DECISIONS.md` before deployment.
  - Scores must strictly represent relative rankings with uncertainty bars; never output probabilistic habitability claims.

---

## 3. Collaboration & Git Workflow

### 3.1 Branching Convention
All development must occur on topic branches branched from `master`:
- `feat/fe-<feature-name>` for frontend tasks
- `feat/gis-<feature-name>` for GIS/ingestion tasks
- `feat/ml-<feature-name>` for analysis/ML tasks
- `fix/<issue-name>` for bug fixes

### 3.2 Pull Request & Merge Gate
Before any branch can be merged into `master`:
1. **Automated Backend Tests Must Pass:**
   ```powershell
   cd backend
   .\.venv\Scripts\pytest -v
   ```
2. **Frontend Production Build Must Pass:**
   ```powershell
   cd frontend
   npm.cmd run build
   ```
3. **No Uncommitted Large Datasets:** Check `git status` to ensure `data/raw` or large files are not staged.
4. **API Schema Consistency:** If modifying API schemas, update Pydantic models in `backend/app/schemas/`, TypeScript types in `frontend/src/types/`, and `docs/api-contracts.md`.

---

## 4. Scientific Review Checklist

Every pull request that introduces or modifies scientific logic must be validated against this checklist:

- [ ] **No Fabricated Telemetry:** Are missing attributes represented as `null`, never `0`?
- [ ] **Explicit CRS:** Are Moon/Mars geometries assigned explicit IAU CRS codes (never Earth EPSG:4326)?
- [ ] **Ranking vs Probability:** Does the UI label metrics as "Similarity Rank" rather than "% Probable Analog"?
- [ ] **Traceable Provenance:** Does every new dataset registration include source agency, mission, license, and citation?
- [ ] **Fixture Isolation:** Are mock or sample records explicitly flagged with `is_demo: true`?
