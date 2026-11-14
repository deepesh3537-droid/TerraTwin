# Project Memory

> Current project state. Update at the end of every work session.
> Permanent decisions belong in `DECISIONS.md`.

**Last updated:** 2026-11-14

## Current Status
Phase 4 (Frontend Foundation) completed and verified. Vite + React + TypeScript + Tailwind stack configured, application shell with responsive sidebar/topbar implemented, shared feedback states created, all 8 page shells routed, and production build passing (`npm run build`).

## Completed
- Phase 0: Planning & Documentation (TASK-000, TASK-000a, TASK-000b)
- Phase 1: Repository Skeleton & Configuration (TASK-001 to TASK-006)
- Phase 2: Backend Foundation (TASK-010 to TASK-018)
- Phase 3: API Contracts (TASK-020 to TASK-029)
- Phase 4: Frontend Foundation:
  - TASK-030: Vite + React 18 + TypeScript + Tailwind CSS toolchain configured.
  - TASK-031: React Router with all 8 specified routes (`/`, `/explorer`, `/compare`, `/analog-finder`, `/suitability`, `/rover-lab`, `/catalog`, `/methodology`).
  - TASK-032: Responsive application shell (`AppShell`, `Sidebar`, `TopBar`) with planetary body selector state.
  - TASK-033: Reusable feedback components: `LoadingState`, `EmptyState`, `ErrorState`, `NotImplementedState` (honest 501, no fake scores), and `NotConfiguredState` (body-specific CRS disclosure).
  - TASK-034: Page components for all 8 application routes.
  - TASK-035: Standardized on Axios (ADR-014).
  - TASK-036: Design tokens configured in `tailwind.config.js` following dark space/science aesthetic.
  - Verification: Production build (`npm run build`) passed with 1501 modules transformed in 7.84s (FE-01, FE-02).

## Current Task
Phase 4 completed and verified. Awaiting authorization to begin Phase 5: Frontend Integration (`TASK-040` through `TASK-049`).

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
