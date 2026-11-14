# Project Memory

> Current project state. Update at the end of every work session.
> Permanent decisions belong in `DECISIONS.md`.

**Last updated:** 2026-11-14

## Current Status
Phase 1 (Repository Skeleton & Configuration) executed. Directory structure, configuration files, Git repository initialization, and initial commit completed. Docker Compose configuration created; container verification pending host Docker Desktop installation.

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

## Environment Notes & Discoveries
- Python: 3.14.6 (`python.exe` in PATH).
- Node.js: v25.2.1 (`node.exe` in PATH). Note: In Windows PowerShell, run `npm.cmd` directly as `npm.ps1` is blocked by default ExecutionPolicy.
- Git: Installed via winget to `$env:LOCALAPPDATA\Programs\Git\cmd\git.exe`.
- Docker Desktop: Not installed on this host; WSL2 is not enabled. `docker compose` cannot run until Docker Desktop is installed and running.

## Current Task
Phase 1 verification and sign-off. TASK-001 to TASK-006 complete; TASK-007 pending Docker availability on host.

## Not Verified / Not Done
- TASK-007 / DB-01: PostGIS container startup not verified (Docker not installed on host).
- NASA-provided datasets have not been inspected; formats, CRS, and schemas are unknown.

## Known Issues / Open Items
- Target users, hackathon deadline, team member names, and design token values remain **TBD** (see `PRD.md` §14 and `DESIGN.md`).

## Assumptions Recorded
- File `RULES.md` (the request said `RULE.md`; the guide and all cross-references use `RULES.md`).
- Uppercase doc filenames confirmed (TASK-000b).

## Next Step
Obtain owner approval to begin Phase 1 (TASK-001).
