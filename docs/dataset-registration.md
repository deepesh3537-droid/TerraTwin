# TerraTwin Dataset Registration & Ingestion Protocol

This guide defines the standardized 7-step protocol for acquiring, validating, preprocessing, and registering open Earth observation and planetary remote sensing datasets into TerraTwin.

---

## Ingestion Protocol Overview

```
┌──────────────────┐     ┌──────────────────┐     ┌──────────────────┐
│  1. INSPECT      │ ──► │  2. PROVENANCE   │ ──► │  3. UNITS & CRS  │
│  Raw Data Format │     │  & Open License  │     │  Validation      │
└──────────────────┘     └──────────────────┘     └──────────────────┘
                                                           │
┌──────────────────┐     ┌──────────────────┐              ▼
│  6. PREPROCESS   │ ◄── │  5. AUTHOR       │ ◄── ┌──────────────────┐
│  COG / Overviews │     │  JSON Manifest   │     │  4. STORE RAW    │
└────────┬─────────┘     └──────────────────┘     │  & Compute Hash  │
         │                                        └──────────────────┘
         ▼
┌──────────────────┐
│  7. REGISTER     │
│  Database & API  │
└──────────────────┘
```

---

## Step 1: Inspect Raw Data (No Assumed Formats)

Planetary remote sensing archives (NASA Planetary Data System, USGS Astrogeology, ESA Planetary Science Archive) distribute data in various container formats (GeoTIFF, PDS3/PDS4 labels, ISIS cubes, VICAR, NetCDF, HDF5).

**Rule:** Never assume the file format, byte order, band arrangement, or nodata values. Always inspect the raw file using standard GIS tools before processing:

```powershell
# Using GDAL to inspect raster structure
gdalinfo data/raw/earth/sample_elevation.tif

# Or using Python rasterio in backend virtualenv
python -c "import rasterio; ds = rasterio.open('data/raw/earth/sample_elevation.tif'); print(ds.meta, 'NoData:', ds.nodata)"
```

### Inspection Checklist:
- [ ] Container format verified (GeoTIFF, NetCDF, PDS label).
- [ ] Number of raster bands and data type confirmed (e.g., `Float32`, `Int16`).
- [ ] Pixel dimensions and ground sample distance (resolution) recorded.
- [ ] Value range checked for physical plausibility (e.g., negative elevations in basins, minimum temperatures $>0\text{ K}$).
- [ ] Sentinel `nodata` value identified (e.g., `-9999.0`, `-32768`).

---

## Step 2: Provenance & Open License Verification

TerraTwin requires full traceability for every registered dataset:
1. **Source Agency:** Identify the publishing institution (e.g., NASA, USGS, ESA, JAXA).
2. **Mission & Instrument:** Record the spacecraft, mission, and sensor (e.g., LRO LOLA, MRO CTX, SRTM).
3. **Processing Level:** Note the calibration level (`Level 1` raw telemetry, `Level 2` calibrated radiance, `Level 3` gridded map product).
4. **License Compliance:** Verify that the dataset has an open research license (e.g., NASA Open Data Policy, USGS Public Domain, Creative Commons CC-BY).
5. **Academic Citation:** Locate the official DOI and citation text to be displayed in the Data Catalog.

---

## Step 3: Validate Coordinate Reference System & Units

### 3.1 CRS Validation
Verify the native projection and spatial reference:
- **Earth Data:** WGS 84 (`EPSG:4326`) or appropriate UTM/polar projection.
- **Moon Data:** Must use IAU Moon reference frames (`IAU2000:30100` or `IAU_2015:30100`). Mean lunar radius $R = 1737.4\text{ km}$.
- **Mars Data:** Must use IAU Mars reference frames (`IAU2000:49900` or `IAU_2015:49900`). Mean Martian radius $R = 3389.5\text{ km}$.

> [!CAUTION]
> If a lunar or Martian file header defaults to WGS 84, it must be re-tagged with the appropriate IAU planetary coordinate frame using `gdal_edit.py -a_srs "IAU2000:30100"`. Extraterrestrial coordinates must **never** be coerced into `EPSG:4326`.

### 3.2 Physical Units Validation
Ensure values match the platform data dictionary:
- Elevation: `meters`
- Slope: `degrees` ($0^\circ - 90^\circ$)
- Temperature: `Kelvin`
- Roughness: `dimensionless` ($0.0 - 1.0$)

---

## Step 4: Store Raw Asset & Compute Checksum

1. Move the original raw file into the appropriate body directory under `data/raw/`:
   ```
   data/raw/earth/
   data/raw/moon/
   data/raw/mars/
   ```
2. Compute the cryptographic SHA-256 hash for data integrity tracking:
   ```powershell
   Get-FileHash -Algorithm SHA256 data/raw/earth/sample_elevation.tif
   ```
3. Ensure the file is covered by `.gitignore` (all files in `data/raw/` except `.gitkeep` are ignored).

---

## Step 5: Author Dataset Manifest

Create a JSON manifest in `data/manifests/<dataset-slug>.manifest.json` conforming to the schema in [`data/manifests/dataset_manifest.example.json`](../data/manifests/dataset_manifest.example.json):

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "Dataset Registration Manifest",
  "dataset": {
    "id": "ds-moon-lola-dem-118m",
    "name": "LRO LOLA Global Lunar Elevation Grid (118m)",
    "description": "High-resolution topographic model of the Moon derived from the Lunar Orbiter Laser Altimeter.",
    "planet_id": "moon",
    "category": "elevation",
    "variable": "elevation",
    "source_agency": "NASA / GSFC",
    "mission": "Lunar Reconnaissance Orbiter (LRO)",
    "instrument": "Lunar Orbiter Laser Altimeter (LOLA)",
    "format": "GeoTIFF",
    "unit": "meters",
    "native_resolution": "118m/pixel",
    "temporal_start": "2009-06-18T00:00:00Z",
    "temporal_end": "2013-12-31T23:59:59Z",
    "coordinate_reference_system": "IAU2000:30100",
    "processing_level": "Level 3",
    "license": "NASA Open Data Policy (Public Domain)",
    "source_url": "https://pds-geosciences.wustl.edu/lro/lro-l-lola-3-rdr-v1/",
    "citation": "Smith, D. E., et al. (2010). The Lunar Orbiter Laser Altimeter Investigation on the Lunar Reconnaissance Orbiter Mission. Space Science Reviews, 150(1-4), 209-241.",
    "local_path": "raw/moon/lola_dem_118m.tif",
    "checksum": "sha256:7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069",
    "ingestion_status": "available",
    "quality_notes": "Reprojected to IAU2000:30100 polar stereographic for high latitudes.",
    "is_demo": false
  }
}
```

---

## Step 6: Preprocess & Tile (Cloud-Optimized GeoTIFF)

For high-performance web map streaming, convert raw rasters to Cloud-Optimized GeoTIFFs (COG) with tiled layout and internal pyramid overviews:

```powershell
# Convert to COG format
gdal_translate data/raw/moon/lola_dem_118m.tif data/processed/moon/lola_dem_118m_cog.tif -co TILED=YES -co COMPRESS=DEFLATE -co COPY_SRC_OVERVIEWS=YES

# Derive terrain slope raster
gdaldem slope data/processed/moon/lola_dem_118m_cog.tif data/processed/moon/lola_slope.tif -compute_edges
```

Save the processed assets in `data/processed/<planet_id>/`.

---

## Step 7: Register in Database & Verify

### 7.1 Database Registration
Insert the dataset into the PostgreSQL/PostGIS database using the seed script, migration script, or backend repository service:

```python
from app.db.session import SessionLocal
from app.models.dataset import Dataset
from app.models.layer import Layer

with SessionLocal() as db:
    dataset = Dataset(
        id="ds-moon-lola-dem-118m",
        name="LRO LOLA Global Lunar Elevation Grid (118m)",
        planet_id="moon",
        category="elevation",
        variable="elevation",
        source_agency="NASA / GSFC",
        coordinate_reference_system="IAU2000:30100",
        local_path="processed/moon/lola_dem_118m_cog.tif",
        ingestion_status="available",
        is_demo=False
    )
    db.add(dataset)
    
    # Register associated renderable layer
    layer = Layer(
        id="layer-moon-lola-dem",
        name="LOLA Lunar Topography",
        planet_id="moon",
        category="elevation",
        dataset_id=dataset.id,
        variable="elevation",
        unit="meters",
        available=True,
        rendering_type="raster",
        coordinate_reference_system="IAU2000:30100"
    )
    db.add(layer)
    db.commit()
```

### 7.2 Verification Checklist
- [ ] Dataset queries successfully from the API: `GET /api/v1/datasets/ds-moon-lola-dem-118m`.
- [ ] Appears in the **Data Catalog** UI (`/catalog`) with correct provenance drawer.
- [ ] Appears in the **Planetary Explorer** layer panel (`/explorer`).
- [ ] If lunar/Martian, confirms `NotConfiguredState` prevents invalid Earth-projected rendering until dedicated IAU tile service is attached.
