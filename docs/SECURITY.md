# Security Requirements

> Source: `context.md` constraints and the Vibe Coding guide's security checklist.
> Scope: the **base version**, a local-development, no-authentication hackathon foundation. If hosting, authentication, or user data are added later, this document must be revisited. Items depending on that are marked **TBD**.

Security is not added five minutes before deployment.

---

## 1. Threat Context (base version)

- Runs locally; no user accounts, no payments, no paid APIs, no cloud services
- Public/open scientific data; no personal data collected
- Main risks: leaked credentials, accidental commit of large/proprietary data, unvalidated input, path traversal via data paths, over-verbose errors, vulnerable or unnecessary dependencies, misleading scientific output

## 2. Authentication & Authorization

- **Base version has no authentication or user management** (explicitly out of scope).
- Consequently all base endpoints are open and read-oriented; there are no per-user resources.
- **TBD:** if auth is introduced later, define private routes, ownership checks, and server-side verification, and record it in `DECISIONS.md`.
- Do not expose any admin/ingestion capability through unauthenticated HTTP endpoints. Ingestion stays separate from the API.

## 3. Secrets & Configuration

- Never commit real secrets, credentials, or `.env`.
- Commit `.env.example` only, with safe local defaults and **empty** values for optional keys (e.g. `VITE_EARTH_MAP_STYLE_URL=`).
- Docker Compose DB password is a **local development value only**, described as such in the README.
- All environment-specific values live in environment variables (`DATABASE_URL`, `CORS_ORIGINS`, `DATA_ROOT`, `VITE_API_BASE_URL`, …), never hard-coded.
- No paid API keys are required for the base; if a map provider ever needs a key, it must stay out of source code and out of client bundles where possible. **TBD** if applicable.
- Anything prefixed `VITE_` is public in the browser bundle. Never place secrets there.
- Never log secrets, full connection strings, or credentials.

## 4. Input Validation

- Validate all query parameters and request bodies with Pydantic; invalid input → `422`.
- Constrain pagination (`limit` max, `offset` ≥ 0).
- Constrain enumerations (`planet` ∈ `earth|moon|mars`, known category/status values).
- Validate that referenced IDs exist (`404` otherwise).
- Validate weights/variables in analysis request contracts even though execution returns `501`.
- Treat `search` strings as data; never concatenate into SQL.

## 5. Database

- All access through SQLAlchemy with parameterized queries; no string-built SQL.
- Only repositories touch the database.
- Least-privilege DB user for anything beyond local dev (**TBD** if deployed).
- Migrations only through Alembic; no manual schema drift.
- Do not store large raster/binary payloads in relational rows.
- Readiness endpoint must not leak connection details.

## 6. API & Error Handling

- Use the common error envelope; never return stack traces or internal paths to clients.
- Include `request_id` for traceability where available.
- CORS: allow only configured origins (`CORS_ORIGINS`, e.g. `http://localhost:5173`); do not use wildcard in non-local environments.
- Return `404`/`422`/`501` consistently; no fabricated success responses.
- `501` handlers must not pretend to have processed anything.

## 7. File & Data Handling

- `local_path` is **relative to the configured data root**, never an absolute machine path.
- Resolve file paths against `DATA_ROOT` and reject anything that escapes it (path traversal such as `..`).
- Record `checksum` for registered datasets to detect corruption/tampering.
- No file-upload endpoints in the base. If ever added, validate type, size, and filename.
- Do not commit large datasets; `data/raw/` and `data/processed/` are Git-ignored except `.gitkeep`.
- Respect dataset **license/usage terms**; record them in the catalog. Do not redistribute data whose terms are unknown. **TBD** per dataset.

## 8. Dependencies & Supply Chain

- Add libraries only with a clear need.
- Pin versions via the chosen dependency approach (ADR-015).
- Prefer official documentation for technical decisions.
- Review and update dependencies periodically; run available audit tools (`npm audit`, Python equivalent) before handoff. Exact tooling **TBD**.
- Heavy optional libraries (GeoPandas, Rasterio, …) imported only where needed, not at startup.

## 9. Scientific / Data Integrity (treated as a security property)

Misleading output is a harm in this product.
- No fabricated scores, probabilities, rasters, measurements, citations, or URLs.
- Missing data is `null`/unavailable, never `0`.
- Demo data marked `is_demo: true` and never presented as NASA observations.
- Provenance (source, instrument, unit, CRS, resolution, processing) recorded for every dataset.
- Do not perform cross-planet or metric calculations without validated body-specific CRS handling.

## 10. Logging & Monitoring

- Centralized logging (`core/logging.py`); log requests/errors with `request_id`.
- Do not log secrets or sensitive config.
- Production monitoring (error tracking, uptime, backups) is **TBD**: depends on whether deployment is in scope.

## 11. Git Hygiene

- `.gitignore` covers `.env`, virtual environments, `node_modules`, build output, and data directories (except `.gitkeep`).
- Before each push: `git status`, review the diff, confirm no secrets or large files.
- Small, descriptive commits; feature branches; reviewed merges for shared contracts.
- If a secret is ever committed: rotate it immediately; removing it from the latest commit is not enough.

## 12. Pre-Handoff / Pre-Deployment Checklist

**Secrets & repo**
- [ ] No secrets in Git (including history)
- [ ] `.env.example` present and contains no real values
- [ ] No large datasets committed

**Backend**
- [ ] All inputs validated; errors use the common envelope
- [ ] CORS restricted to configured origins
- [ ] File paths confined to `DATA_ROOT`
- [ ] No stack traces exposed

**Frontend**
- [ ] No secrets in `VITE_` variables
- [ ] No ad hoc URLs bypassing the API client

**Integrity**
- [ ] No fabricated scientific values anywhere
- [ ] Demo data labelled

**Dependencies**
- [ ] Audit run; findings reviewed

**If deployed (TBD)**
- [ ] Hosting, HTTPS, environment separation (dev/preview/production values), DB access policies, backups, monitoring
