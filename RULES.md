# Development Rules

> The AI/developer rulebook for this project. Applies to every assistant (Claude, Cursor, etc.) and every teammate.
> Authority order when sources conflict: **`context.md` > `DECISIONS.md` > `ARCHITECTURE.md` > other docs.**

---

## 1. Before Coding
- Read `PRD.md`, `ARCHITECTURE.md`, `DESIGN.md`, `RULES.md`, `TASKS.md`, `DECISIONS.md`, `MEMORY.md` (and `SECURITY.md`/`TEST_PLAN.md` when relevant).
- Inspect the existing workspace and implementation before creating or replacing files.
- Reuse existing functionality; do not duplicate logic.
- Make a plan for any non-trivial change and state it before coding.
- Work on **one task at a time** from `TASKS.md`. Never build the whole app in one prompt.
- Do not modify unrelated files.

## 2. Working Loop (every feature)
`READ → UNDERSTAND → PLAN → IMPLEMENT → TEST → REVIEW → FIX → COMMIT → UPDATE DOCUMENTATION`

Use **vertical slices** (a complete flow through database → API → UI) rather than building a whole layer at a time.

## 3. Architecture Rules
- One repository, one modular monolith. **No microservices**, brokers, or distributed jobs.
- Backend layering: **routes → services → repositories → models**. Routes contain no business or SQL logic; only repositories access the database.
- Scientific code goes behind `geospatial/` and `analysis/` interfaces; do not change API contracts to suit an implementation.
- Frontend: UI components contain no URL construction; use `services/apiClient.ts` and `services/endpoints/`.
- Map rendering goes through `PlanetaryMap` / `PlanetaryMapAdapter`; never import MapLibre directly in feature components.
- Keep ingestion separate from the API and frontend.
- Prefer a simple design over unnecessary complexity. Avoid empty files with no purpose.
- Do not change a decision in `DECISIONS.md` without recording a new/superseding ADR.

## 4. Scientific Integrity (non-negotiable)
- **Never** fabricate scores, probabilities, rasters, measurements, resolutions, citations, or dataset URLs.
- **Never** treat missing data as zero; use `null` / "unavailable".
- Similarity is a **ranking metric, not a probability**; do not label it as such.
- Preserve per-dimension results; do not hide everything inside one aggregate.
- Do not implement an arbitrary similarity score in the base.
- Demo data: `is_demo: true`, neutral names, no invented values, never presented as NASA observations.
- Do not guess dataset schemas, bands, filenames, resolutions, or CRS; inspect the real file first.
- Do not claim a command, test, or build succeeded unless it was actually run successfully.

## 5. Coordinates & Data
- Never assume EPSG:4326 or an Earth CRS for Moon/Mars.
- Store a CRS with every geometry, footprint, and raster asset.
- No distance/area/slope/cross-planet calculations until body-specific projection handling is implemented and validated.
- Large files stay out of Git and out of relational rows (`data/raw`, `data/processed`).
- `local_path` is always relative to the configured data root; never absolute or machine-specific.

## 6. API Rules
- All endpoints under `/api/v1`; `snake_case` JSON; UUID string IDs; `limit`/`offset` pagination.
- Validate with Pydantic. `404` unknown resource, `422` invalid input, `501` not-yet-implemented scientific operation.
- Use the common error envelope; never expose stack traces.
- UTC ISO-8601 timestamps.
- Never rename shared API fields or DB tables independently; contract changes go through review and update `docs/api-contracts.md`.
- Keep Pydantic schemas and TypeScript types in sync.

## 7. Frontend & UI Rules
- Follow `DESIGN.md`.
- Every fetched view handles **loading, empty, error**, and (where relevant) **not-implemented / not-configured / unavailable** states.
- A control must work, or be visibly disabled/labelled "coming later". Never make inactive controls look functional.
- Do not show placeholder percentages or scores.
- Responsive at 375 / 768 / 1440 px; keyboard-accessible; labelled forms.
- Use one HTTP approach consistently (Axios **or** fetch, per ADR-014 once decided).

## 8. Configuration & Dependencies
- Environment values live in `.env`; commit only `.env.example`.
- No paid APIs, paid tiles, API keys, or cloud services required for the base.
- No auth, user management, collaboration, or payments in the base.
- Do not add libraries without a clear need; heavy scientific libraries are imported only where used, never in startup paths.
- No machine-specific absolute paths or usernames in code or config.

## 9. Security
- Never commit secrets, credentials, or `.env`. Never log secrets.
- Never put secrets in `VITE_` variables (they are public).
- Validate all input; parameterized queries only (SQLAlchemy).
- Confine file access to `DATA_ROOT`.
- Follow `SECURITY.md`.

## 10. Testing
- Add tests for important functionality (health, catalog, regions, placeholder analysis routes are required).
- Run lint, type check, tests, and build after implementation; fix failures before continuing.
- Test empty-catalog behavior and `501` handling.
- Update `TEST_PLAN.md` statuses with **real** results only.

## 11. Git
- Single repo; **feature branches** (`feature/…`, `fix/…`); pull requests/merges.
- Small commits with descriptive messages (e.g. `feat: add region inspector`).
- Before pushing: `git status`, review diff, confirm no secrets or large files.
- Shared schemas/contracts changed only through review.

## 12. Debugging With AI
When something breaks, provide: **error**, **expected behavior**, **actual behavior**, **steps to reproduce**, **constraints**. Then:
1. Do not modify code yet; find the **root cause** (what, why, which file).
2. Propose the **smallest fix** and how to test it.
3. Implement only that fix; no unrelated refactoring.
4. Run relevant tests.

## 13. Reporting After Each Task
Report: (1) files changed, (2) what was implemented, (3) tests/commands actually executed and results, (4) remaining issues or anything unverified.

## 14. Documentation Upkeep
After each task update as needed: `TASKS.md`, `MEMORY.md`, `DECISIONS.md`, `README.md`, `ARCHITECTURE.md`, `TEST_PLAN.md`, `docs/api-contracts.md`. Documentation must describe the application that actually exists.

## 15. When to Ask vs. Decide
- **Ask the owner** when a choice affects scientific meaning, API contracts, data handling, scope, or anything marked **TBD**.
- **Decide with a sensible default** only for low-impact implementation details, and record the assumption in the README.
- Do not stop at a plan: implement, run available checks, fix issues, and state clearly what could not be verified.

## 16. Prompt Template for Tasks

```
CONTEXT
Read PRD.md, ARCHITECTURE.md, DESIGN.md, RULES.md, DECISIONS.md, MEMORY.md.

TASK
<one task from TASKS.md>

FILES
<relevant folders/files>

CONSTRAINTS
- Follow the existing architecture and RULES.md.
- Do not modify unrelated files.
- No fabricated scientific values.

ACCEPTANCE CRITERIA
<from TASKS.md / TEST_PLAN.md>

TESTING
Run lint, type check, relevant tests, and build.

REPORT
Files changed · what was implemented · tests executed · remaining issues
```
