# Design System

> DESIGN.md = **HOW IT SHOULD LOOK AND FEEL**.
> Source direction (`context.md` §5.1): *"a polished, responsive scientific dashboard with a dark, space/science-oriented visual direction. Prioritize clarity and usability over decorative animation. The map/workspace should be the main focus."*
> Exact colors, fonts, and radii are **not specified** in the sources. Values below marked **Proposed** are suggestions pending owner approval. Do not treat them as final.

---

## 1. Principles

1. **Map first.** The Explorer map/workspace is the focal point of the product.
2. **Clarity over decoration.** No gratuitous animation.
3. **Honesty in the UI.** A control either works or is clearly disabled/labelled "coming later". Never display a fake score, percentage, probability, or measurement.
4. **Missing ≠ zero.** Absent data is shown as "not available" / "not configured", never `0`.
5. **Preserve per-dimension information.** Do not collapse results into one number.
6. **Consistency.** Reuse shared components; no per-page one-off styles.

## 2. Visual Direction

- Dark, space/science-oriented theme
- Dense-but-readable scientific dashboard
- Tailwind CSS for styling; Lucide React for icons; Recharts for charts (only when charts are needed)

## 3. Design Tokens (Proposed, pending approval)

| Token | Proposed value | Status |
|---|---|---|
| Background | very dark navy/near-black | Proposed |
| Surface (panels/cards) | slightly lighter than background | Proposed |
| Border | low-contrast line | Proposed |
| Text primary / muted | high-contrast light / reduced-contrast light | Proposed |
| Accent | single accent color | **TBD** |
| Typography | one sans-serif family + monospace for IDs/coordinates | **TBD** (family) |
| Radius | consistent single radius for cards/panels | **TBD** |

Planetary-body identity (Earth / Moon / Mars) may use subtle per-body accent cues in the selector and top bar. Colors **TBD**.

Semantic status colors (must be distinguishable without relying on color alone; pair with icon/text): success, warning, error, info, **not-implemented**, **not-configured**, **unavailable**, **demo**.

## 4. Application Shell

```
┌─────────────────────────────────────────────────────────┐
│ Top bar: app name │ global search (placeholder) │ body │ ⚙ │
├──────────┬──────────────────────────────────────────────┤
│ Sidebar  │ Main content area                            │
│ nav      │                                              │
└──────────┴──────────────────────────────────────────────┘
```

- **Sidebar:** Overview, Explorer, Compare, Analog Finder, Suitability, Rover Lab, Catalog, Methodology.
- **Top bar:** app name; global search *placeholder* (clearly disabled if not functional); current planetary body/context; settings/menu affordance.
- **Main area:** page content.
- Sidebar collapses on narrow screens.

## 5. Pages

| Route | Layout notes |
|---|---|
| `/` Overview | Summary cards (system/module status, catalog counts if available), quick links |
| `/explorer` | Map dominates. Planet selector, layer panel, region search/select, Region Inspector panel (opens on selection), zoom/reset controls |
| `/compare` | Source/candidate region selectors + not-implemented state |
| `/analog-finder` | Input form wired to contract + honest not-ready state on submit (`501`) |
| `/suitability` | Future criteria list + not-ready state |
| `/rover-lab` | Future workflow explanation + not-ready state |
| `/catalog` | Filter bar (planet, category, variable, status) + list + detail view with provenance |
| `/methodology` | Plain-language comparison dimensions, data limitations, "under development" statement |

## 6. Key Components

### Planet selector
Earth · Moon · Mars. Changing it updates map, layer panel, region list, inspector (shared state). Switching must never pretend valid Moon/Mars imagery exists.

### Map canvas (`PlanetaryMap`)
- Earth: map canvas when a style source is configured; neutral canvas/empty state if not.
- Moon/Mars: explicit **"Imagery not configured"** state explaining why (separate coordinate systems and projections).
- Zoom/reset controls where supported.

### Layer panel
- Grouped by category (geology/mineralogy, terrain/elevation, slope/roughness, temperature/illumination, water/ice/permafrost, dust/wind/erosion, caves/lava tubes/subsurface, biology/habitability).
- Each row: name, toggle, unit/CRS on hover/detail, availability badge.
- Layers with no data/render source: toggle disabled + "Not configured" / "Unavailable" label.

### Region Inspector
Fields: name and ID; planetary body; coordinates/footprint **with CRS**; description; available datasets/layers; source/metadata; a **"Not yet computed"** empty state for characteristics. Demo regions display a visible **Demo** badge.

### Catalog list and detail
Card/row: name, planet, category, variable, status. Detail: source agency, mission/instrument, units, resolution, temporal range, format, CRS, license/use terms, source URL, ingestion status, quality notes. Unknown fields displayed as "Unknown", not blank or zero.

## 7. State Components (required, reusable)

| State | Use | Message pattern |
|---|---|---|
| **Loading** | Awaiting API | Skeleton or spinner matching final layout |
| **Empty** | Valid response, zero items | Explain why and what to do (e.g. "No datasets registered yet.") |
| **Error** | Network/`4xx`/`5xx` | Plain message + retry; show `request_id` if provided |
| **Not implemented** | `501` or scaffolded page | "This analysis module is scaffolded but has not been implemented yet." No scores |
| **Not configured** | No map source / no Moon/Mars imagery | Explain what configuration is missing |
| **Unavailable** | Layer without data/render source | Disabled control + reason |

The app must look intentional with an **empty catalog**.

## 8. UX Requirements

- Responsive: verified at **375px, 768px, 1440px**
- Loading, empty, error, not-implemented, not-configured states everywhere data is fetched
- Accessible forms: labels, focus states, error text tied to fields
- Keyboard navigation for sidebar, selectors, layer toggles, and inspector
- Sufficient contrast on the dark theme; do not rely on color alone
- Units and CRS visible wherever a measurement or geometry is shown
- No decorative animation that hinders clarity

## 9. Content & Terminology Rules

- Say **"similarity ranking"**, never "probability of being an analog".
- Do not show placeholder similarity percentages or suitability scores.
- Do not describe demo entries as NASA observations.
- Use "Demo Earth Region", "Demo Lunar Region", "Demo Martian Region" for sample names.
- Use body names consistently: Earth, Moon, Mars (IDs `earth`, `moon`, `mars`).
