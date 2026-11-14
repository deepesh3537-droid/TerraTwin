# Project Memory

> Current project state. Update at the end of every work session.
> Permanent decisions belong in `DECISIONS.md`.

**Last updated:** 2026-11-14

## Current Status
**Base Platform & 3D Mission Control Visual Experience Complete & Verified.**
The platform features an immersive 3D Solar System Entry Screen and an interactive 3D Planetary Mission Control Dashboard (OrbitTrack-inspired):
- **3D Solar System Entry Screen:** Procedural Sun, Earth, Moon, and Mars objects with Keplerian orbits, starfield, ephemeris telemetry, and smooth warp fly-in transition.
- **3D Mission Control Globe:** High-fidelity interactive 3D globes for Earth (continents, oceans, separate drifting cloud shell, Rayleigh scattering), Moon (anorthosite highlands, volcanic maria, crater rays), and Mars (iron oxide rust, volcanic plains, polar caps) with physics-damped OrbitControls.
- **Spherical Region Projections:** Real geographic coordinates ($\text{lat}, \text{lon}$) from backend GeoJSON footprints projected into 3D Cartesian coordinates with interactive glowing beacon pins and telemetry tooltips.
- **HUD & Dual-Mode Toggle:** Mission Control HUD with ephemeris constants (Radius, Gravity, Day length, Orbital velocity, CRS) and seamless switching between 3D Globe and 2D GIS MapLibre canvas.
- **Optimized Bundle & Laptop Performance:** Rollup manualChunks code-splitting (`three-core`, `three-react`, `react-vendor`, `map-vendor`), lazy loading of 3D scenes, and lightweight procedural canvas textures (<5ms generation, 0 external network requests).

## Completed
- Phase 0: Planning & Documentation (TASK-000, TASK-000a, TASK-000b)
- Phase 1: Repository Skeleton & Configuration (TASK-001 to TASK-006)
- Phase 2: Backend Foundation (TASK-010 to TASK-018)
- Phase 3: API Contracts (TASK-020 to TASK-029)
- Phase 4: Frontend Foundation (TASK-030 to TASK-036)
- Phase 5: Frontend Integration (TASK-040 to TASK-049)
- Phase 6: Documentation & Validation (TASK-050 to TASK-056)
- Phase 7: Handoff Readiness
- 3D Mission Control Upgrade:
  - Phase 1: Cinematic 3D Solar System Entry Screen (`PlanetaryEntryScreen.tsx`, `SolarSystemScene.tsx`, `Sun.tsx`, `Planet.tsx`, `StarField.tsx`, `CameraRig.tsx`)
  - Phase 2: Interactive 3D Planetary Mission Control Dashboard (`PlanetaryGlobe.tsx`, `PlanetaryGlobeScene.tsx`, `EarthGlobe.tsx`, `MoonGlobe.tsx`, `MarsGlobe.tsx`, `GlobeRegionMarkers.tsx`, `GlobeMissionHUD.tsx`)
  - Phase 3: Application Integration & Laptop Optimization (`vite.config.ts` manualChunks, `AppShell.tsx` lazy loading, `TopBar.tsx`, `Sidebar.tsx`, `OverviewPage.tsx`)

## Verification Summary
- **Backend Tests:** 22/22 passed in 0.58s (`pytest -v`).
- **Frontend Production Build:** `npm run build` passed cleanly in 15.97s with zero chunk size warnings (`three-core`, `three-react`, `react-vendor`, `map-vendor` split).
- **No laptop-specific absolute paths:** Confirmed clean across repository.
- **No committed credentials or large raw datasets:** Confirmed.

## Next Step
Ready for team distribution and Phase 8 post-handoff extensions per `docs/team-ownership.md`.
