# Product Requirements Document (PRD)

> PRD = **WHAT** we are building and **WHY**.
> Sources: `context.md` (the Base Product Context and Implementation Brief) and the Vibe Coding guide.
> Items marked **TBD** are not specified in the sources and must be confirmed by the project owner. Nothing here has been guessed.

---

## 1. Product

**Name:** TerraTwin (renamed from the working title used in `context.md`)

**Context:** Built for the **NASA Space Apps Challenge**. The challenge is to use open Earth, Moon, and Mars data from NASA and other space agencies to identify and characterize terrestrial environments that can serve as analogs for future lunar or Martian landing sites, bases, and exploration operations.

## 2. Problem

Planning lunar and Martian exploration needs places on Earth where hardware, operations, and science can be tested under comparable conditions. Today there is no single workspace that lets someone select a Moon/Mars region and see which Earth locations have comparable *measurable* characteristics, together with the evidence behind the comparison.

## 3. Core question the product answers

> Given a selected region of the Moon or Mars, which locations on Earth have comparable measurable characteristics, and what evidence supports that comparison?

## 4. Target users

**TBD.** The sources do not name the intended users (for example mission planners, planetary scientists, rover engineers, students, hackathon judges). To be confirmed. See "Open Questions".

## 5. Goal

**Goal of the base version:** deliver a clean, runnable, extensible, integration-ready foundation that a three-person team can clone and extend independently, inside one repository, using shared API contracts and common data models.

The base version is **infrastructure, not a validated scientific model.**

## 6. Development workflow (important)

1. One developer builds and tests the complete base repository on one laptop.
2. The base is pushed to a shared Git repository (or distributed) to the other two teammates.
3. Each teammate takes a copy/branch of the same foundation.
4. Each implements a separate feature area inside the existing architecture.
5. Work is integrated into the same application through shared API contracts and data models.

Therefore the base must be **integration-ready before handoff**: one repo, one modular application, no three separate apps or microservices, and no dependency on the creator's laptop paths or usernames.

## 7. Analogy dimensions (what "comparable" may mean)

- Geology, mineralogy, surface materials
- Elevation, slope, roughness, terrain, craters, topographic form
- Surface temperature, illumination, environmental extremes
- Water, ice, permafrost, other potential resources
- Dust, wind, erosion, other surface/atmospheric processes
- Caves, lava tubes, subsurface environments
- Biology, extremophiles, habitability, biosignature-related research (where suitable data exists)
- Conditions relevant to landing, mobility, navigation, robotic operations, human exploration, construction

## 8. MVP: Base Version Scope

### 8.1 Frontend pages

| Route | Page | Base-version behavior |
|---|---|---|
| `/` | Overview | Dashboard summary, quick links, system/module status, catalog counts if available |
| `/explorer` | Planetary Explorer | Map workspace, planet selector, layer panel, region selection, Region Inspector |
| `/compare` | Region Comparison | Page shell, source/candidate selectors, clear "not implemented yet" state |
| `/analog-finder` | AI Analog Finder | Page shell + input form wired to API contract; honest not-ready state |
| `/suitability` | Base Suitability | Page shell, future criteria, not-ready state |
| `/rover-lab` | Rover Testing | Page shell, future workflow explanation |
| `/catalog` | Data Catalog | Working list / filter / detail backed by the catalog API |
| `/methodology` | Methodology | Comparison dimensions, data limitations, module-under-development statement |

Shared shell: sidebar navigation; top bar (app name, global search placeholder, current planetary body, settings/menu affordance); main content area; reusable loading, empty, error, and not-yet-implemented states.

### 8.2 Planetary Explorer
- Planet selector: Earth, Moon, Mars
- Map canvas behind a `PlanetaryMap` / `PlanetaryMapAdapter` abstraction
- Search/select from available sample regions
- Layer control panel populated from the backend
- Region Inspector that opens on region selection
- Basic zoom/reset controls where supported
- Selected-body state shared by map, layer panel, region list, and inspector
- Missing Moon/Mars imagery shown as an explicit **not-configured** state, never as incorrect imagery

### 8.3 Layers
Layer categories (metadata + select/toggle only; no rendering required for every category):
Geology & mineralogy; Terrain & elevation; Slope & roughness; Temperature & illumination; Water, ice & permafrost; Dust, wind & erosion; Caves, lava tubes & subsurface; Biology/extremophile/habitability observations.

A layer with no data/rendering source is marked **unavailable / not configured**. Missing data is never shown as zero.

### 8.4 Region Inspector
Shows: name and ID; planetary body; coordinates/footprint with CRS (when known); description; available datasets/layers; source/metadata; a clear empty state for characteristics not yet computed. No invented measurements.

### 8.5 Data Catalog
List datasets; filter by planetary body, category, variable, status; view details and provenance (source agency, mission/instrument, units, resolution, temporal info, format, CRS, license/use terms, source URL, ingestion status).

### 8.6 Backend / API
- Versioned API under `/api/v1`, OpenAPI docs at `/docs`
- Working: health, readiness, system info, planets, datasets, layers, regions, analysis capabilities
- Planned analysis routes exist, validate requests, and return a consistent `501 Not Implemented`
- Unknown analysis run returns `404`

### 8.7 Database and infrastructure
PostgreSQL + PostGIS via Docker Compose; SQLAlchemy models; Alembic initial migration; small clearly-labelled demo seed; centralized config, error handling, logging.

## 9. Future feature modules (NOT part of the base)

1. Three-planet comparison (Earth location vs Moon/Mars region)
2. AI-powered terrestrial analog finder (find and rank Earth locations resembling a Moon/Mars region)
3. Geological and terrain similarity heatmaps
4. Lunar/Martian base or landing-site suitability analysis
5. Identification of terrestrial environments suitable for rover testing

## 10. Out of Scope for the Base Version

- Building the complete AI model or producing scientific results
- Fabricated NASA measurements, resolutions, citations, or source URLs
- Authentication, user management, collaboration, payments
- Paid APIs, paid map tiles, API keys, cloud services
- Microservices, message brokers, distributed job systems, cloud object storage
- Large raster/dataset files in Git or in ordinary database rows
- Implementing an arbitrary similarity score
- Heavy, unjustified library additions

## 11. Scientific & data principles (product-level requirements)

- Similarity is a **ranking metric, not a probability**; never label it "probability of being an analog" without a trained, calibrated, validated model.
- Preserve **per-dimension results**; never hide everything inside one aggregate score.
- Design for provenance: source dataset/instrument, unit, CRS, spatial/temporal resolution, no-data mask, processing steps/version, uncertainty/quality flags.
- Do not assume all bodies share Earth coordinates or EPSG:4326.
- Real NASA files have **not** been inspected; schemas, bands, and formats must not be guessed.

## 12. Success Criteria (base is ready to hand off when all pass)

A teammate must be able to:
1. Clone the repo and run it using only the README
2. Start PostGIS, backend, and frontend successfully
3. Open the UI and `/docs`
4. Browse planets, datasets, layers, regions from the backend (including empty states)
5. Select a region and see the Region Inspector
6. Call every planned analysis route and receive a validated request / consistent `501`
7. Identify where to add a GIS, ML, or frontend feature without restructuring the repo

Full checklist: see `TEST_PLAN.md` and `TASKS.md` (Phase 7).

## 13. Demo data rules
- Every sample record carries `is_demo: true`
- Neutral names: "Demo Earth Region", "Demo Lunar Region", "Demo Martian Region"
- No fabricated elevation/temperature/mineral/water/ice values
- Not presented as NASA observations; no unverified external URLs
- App must run with an **empty catalog**

## 14. Open Questions (TBD, owner to confirm)

1. Who are the target users?
2. Hackathon submission deadline and demo format?
3. Which NASA datasets does the team have, and in what formats? (Not yet inspected.)
4. Is any deployment/hosting needed beyond local demo?
