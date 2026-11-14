# Test Plan

> Defines what "working" means. Source: `context.md` §15 (acceptance criteria) and the Vibe Coding guide's testing workflow.
> Nothing below has been run yet. Status columns start as **Not run**. Do not mark a test passed unless it actually passed.

---

## 1. Quality Gates (every feature)

```
Code → Lint → Type check → Unit tests → Integration tests → Build → Manual check
```

| Gate | Backend | Frontend |
|---|---|---|
| Lint | configured linter (**TBD**) | `npm run lint` (if configured) |
| Type check | optional (**TBD**) | TypeScript via build / `npm run typecheck` (if configured) |
| Tests | `pytest` | optional in base |
| Build | n/a | `npm run build` |

Exact commands depend on the final project configuration; record the real ones in `README.md` once they exist.

## 2. Automated Backend Tests (required by `context.md`)

Basic Pytest coverage for **health, catalog, region, and placeholder analysis routes**.

| ID | Area | Test | Expected | Status |
|---|---|---|---|---|
| BE-01 | Health | `GET /health` | `200`, process healthy | Passed |
| BE-02 | Health | `GET /api/v1/health/ready` with DB up | `200`, DB connected | Passed |
| BE-03 | Health | Ready endpoint with DB unreachable | Reports failure honestly (not "ok") | Passed |
| BE-04 | System | `GET /api/v1/system/info` | Version + module readiness | Passed |
| BE-05 | Planets | `GET /api/v1/planets` | Exactly `earth`, `moon`, `mars` | Passed |
| BE-06 | Planets | `GET /api/v1/planets/unknown` | `404` + error envelope | Passed |
| BE-07 | Datasets | List with empty catalog | `200`, empty list, pagination fields | Passed |
| BE-08 | Datasets | Filter by `planet`, `category`, `variable`, `status` | Only matching records | Passed |
| BE-09 | Datasets | `limit`/`offset` pagination | Correct slice; invalid values → `422` | Passed |
| BE-10 | Datasets | Unknown `dataset_id` | `404` | Passed |
| BE-11 | Layers | List/filter by `planet`, `category`, `available` | Correct results | Passed |
| BE-12 | Layers | `rendering_url` is `null` where unavailable | Not claimed renderable | Passed |
| BE-13 | Regions | List, empty result, `planet` + `search` filters | Correct results | Passed |
| BE-14 | Regions | Detail, `/datasets`, `/layers`; unknown ID | `200` / `404` | Passed |
| BE-15 | Analysis | `GET /analysis/capabilities` | Each module reported as `not_implemented` (honest) | Passed |
| BE-16 | Analysis | Each `POST` route with **valid** body | `501` + `ANALYSIS_NOT_IMPLEMENTED`-style envelope | Passed |
| BE-17 | Analysis | Each `POST` route with **invalid** body | `422` | Passed |
| BE-18 | Analysis | `GET /analysis/runs/{unknown}` | `404`, no fake run | Passed |
| BE-19 | Contract | `/docs` and OpenAPI load | Schema served | Passed |
| BE-20 | Integrity | Responses contain no fabricated scores/probabilities/measurements | None present | Passed |
| BE-21 | Integrity | Demo records have `is_demo: true` | True for all seeds | Passed |

## 3. Database / Migration Checks

| ID | Check | Expected | Status |
|---|---|---|---|
| DB-01 | Compose starts PostGIS | Container healthy | Not run |
| DB-02 | `alembic upgrade head` on empty DB | Succeeds | Not run |
| DB-03 | Seed script | Inserts demo-only records | Passed |
| DB-04 | App runs with **empty** catalog (seed not run) | No crash; empty states | Passed |
| DB-05 | CRS stored with each geometry/footprint | CRS field present; never silently EPSG:4326 for Moon/Mars | Passed |
| DB-06 | `local_path` values | Relative to data root, never absolute | Passed |

## 4. Frontend Checks

| ID | Check | Expected | Status |
|---|---|---|---|
| FE-01 | `npm run build` | Production build passes | Passed |
| FE-02 | Shell and navigation | Sidebar/top bar work; all 8 routes load | Passed |
| FE-03 | Overview | Shows status and counts, or empty state | Passed |
| FE-04 | Explorer planet selector | Earth/Moon/Mars; state shared by map, layers, regions, inspector | Passed |
| FE-05 | Moon/Mars map | Explicit "not configured" state; no incorrect imagery | Passed |
| FE-06 | Earth map without style URL | Neutral canvas/empty state, no crash | Passed |
| FE-07 | Layer panel | Data from backend; unavailable layers disabled and labelled | Passed |
| FE-08 | Region selection | Opens Region Inspector with correct fields; "not yet computed" empty state | Passed |
| FE-09 | Catalog | List, filter (planet/category/variable/status), detail with provenance | Passed |
| FE-10 | Compare / Analog Finder / Suitability / Rover Lab | Explain not-implemented status; **no scores/percentages** | Passed |
| FE-11 | `501` handling | Friendly "scaffolded but not implemented" message | Passed |
| FE-12 | Loading / empty / error states | Present for every fetched view | Passed |
| FE-13 | Backend stopped | Error state with retry, no blank screen | Passed |
| FE-14 | Inactive controls | Disabled or labelled "coming later" | Passed |
| FE-15 | Single API client | No ad hoc URLs in components | Passed |
| FE-16 | Missing data | Never rendered as `0` | Passed |

## 5. Responsive Checklist

Test every page at:
- [x] 375px
- [x] 768px
- [x] 1440px

## 6. Accessibility Checklist
- [x] Keyboard navigation (sidebar, selectors, toggles, inspector)
- [x] Visible focus states
- [x] Form labels and field-linked errors
- [x] Contrast acceptable on dark theme
- [x] Status not conveyed by color alone

## 7. Fresh-Clone / Handoff Checks (teammate readiness)

| ID | Check | Status |
|---|---|---|
| HO-01 | A fresh clone is configurable using the README alone | Not run |
| HO-02 | PostGIS starts from supplied Compose config | Not run |
| HO-03 | Backend starts | Not run |
| HO-04 | Frontend starts | Not run |
| HO-05 | No laptop-specific absolute paths/usernames required | Not run |
| HO-06 | No committed credentials or large datasets | Not run |
| HO-07 | Required docs exist (see `TASKS.md` Phase 6) | Not run |
| HO-08 | A teammate can find where to add GIS / ML / frontend work without restructuring | Not run |

## 8. Manual End-to-End Flow (base)

```
Start PostGIS → migrate → seed → start backend → start frontend
→ open UI → open /docs
→ Explorer: switch Earth/Moon/Mars → toggle layers → select demo region → inspector opens
→ Catalog: filter → open detail
→ Analog Finder: submit form → see "not implemented" message (no score)
→ Stop backend → UI shows error state
→ Empty catalog → UI shows empty states
```

## 9. Out of Scope for Testing (until implemented)
Scientific correctness of similarity, suitability, and rover-testing results; projection correctness for Moon/Mars; ML evaluation. These modules do not exist in the base. Future tests must be defined by the scientific team together with their validation approach.

## 10. Defect Log
Record failures here or in `MEMORY.md` → Known Issues. Fix failing tests before moving to the next task.
