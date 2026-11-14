import maplibregl, { Map as MapLibreInstance, StyleSpecification } from 'maplibre-gl';
import { Layer } from '../../types';
import { MapOptions, PlanetaryMapAdapter } from './PlanetaryMapAdapter';

// Neutral dark canvas style per ADR-006 & FE-06 when VITE_EARTH_MAP_STYLE_URL is empty
const NEUTRAL_FALLBACK_STYLE: StyleSpecification = {
  version: 8,
  sources: {},
  layers: [
    {
      id: 'background',
      type: 'background',
      paint: {
        'background-color': '#070b13',
      },
    },
  ],
};

export class MapLibreAdapter implements PlanetaryMapAdapter {
  private map: MapLibreInstance | null = null;
  private isLoaded = false;
  private pendingFootprint: { regionId: string; footprint: unknown } | null = null;

  initialize(container: HTMLElement, options?: MapOptions): void {
    const styleUrl = options?.styleUrl || import.meta.env.VITE_EARTH_MAP_STYLE_URL;

    this.map = new maplibregl.Map({
      container,
      style: styleUrl && styleUrl.trim().length > 0 ? styleUrl : NEUTRAL_FALLBACK_STYLE,
      center: options?.center || [0, 20],
      zoom: options?.zoom || 1.5,
    });

    this.map.addControl(new maplibregl.NavigationControl({ showCompass: true }), 'top-right');

    this.map.on('load', () => {
      this.isLoaded = true;
      if (this.pendingFootprint) {
        this.renderFootprint(this.pendingFootprint.regionId, this.pendingFootprint.footprint);
        this.pendingFootprint = null;
      }
    });
  }

  destroy(): void {
    if (this.map) {
      this.map.remove();
      this.map = null;
    }
    this.isLoaded = false;
    this.pendingFootprint = null;
  }

  setCenter(center: [number, number], zoom?: number): void {
    if (!this.map) return;
    this.map.flyTo({
      center,
      zoom: zoom !== undefined ? zoom : this.map.getZoom(),
      essential: true,
    });
  }

  addLayer(layer: Layer): void {
    if (!this.map || !this.isLoaded) return;
    if (layer.rendering_type === 'raster' && layer.rendering_url) {
      const sourceId = `source-${layer.id}`;
      const layerId = `layer-${layer.id}`;
      if (!this.map.getSource(sourceId)) {
        this.map.addSource(sourceId, {
          type: 'raster',
          tiles: [layer.rendering_url],
          tileSize: 256,
        });
        this.map.addLayer({
          id: layerId,
          type: 'raster',
          source: sourceId,
          paint: { 'raster-opacity': 0.8 },
        });
      }
    }
  }

  removeLayer(layerId: string): void {
    if (!this.map || !this.isLoaded) return;
    const lId = `layer-${layerId}`;
    const sId = `source-${layerId}`;
    if (this.map.getLayer(lId)) {
      this.map.removeLayer(lId);
    }
    if (this.map.getSource(sId)) {
      this.map.removeSource(sId);
    }
  }

  setRegionFootprint(regionId: string, footprint: unknown): void {
    if (!this.isLoaded || !this.map) {
      this.pendingFootprint = { regionId, footprint };
      return;
    }
    this.renderFootprint(regionId, footprint);
  }

  private renderFootprint(_regionId: string, footprint: unknown): void {
    if (!this.map) return;

    const sourceId = 'region-footprint';
    const fillLayerId = 'region-footprint-fill';
    const strokeLayerId = 'region-footprint-stroke';

    // Remove existing footprint layers if any
    if (this.map.getLayer(strokeLayerId)) this.map.removeLayer(strokeLayerId);
    if (this.map.getLayer(fillLayerId)) this.map.removeLayer(fillLayerId);
    if (this.map.getSource(sourceId)) this.map.removeSource(sourceId);

    if (!footprint || typeof footprint !== 'object') return;

    try {
      const geojsonFeature = {
        type: 'Feature' as const,
        geometry: footprint as GeoJSON.Geometry,
        properties: {},
      };

      this.map.addSource(sourceId, {
        type: 'geojson',
        data: geojsonFeature,
      });

      this.map.addLayer({
        id: fillLayerId,
        type: 'fill',
        source: sourceId,
        paint: {
          'fill-color': '#0ea5e9',
          'fill-opacity': 0.25,
        },
      });

      this.map.addLayer({
        id: strokeLayerId,
        type: 'line',
        source: sourceId,
        paint: {
          'line-color': '#38bdf8',
          'line-width': 2,
        },
      });

      // Fit bounds if geometry has coordinates
      const geom = footprint as { type: string; coordinates: unknown };
      if (geom.coordinates && Array.isArray(geom.coordinates)) {
        const bounds = new maplibregl.LngLatBounds();
        this.extendBounds(bounds, geom.coordinates);
        if (!bounds.isEmpty()) {
          this.map.fitBounds(bounds, { padding: 40, maxZoom: 12, duration: 1000 });
        }
      }
    } catch {
      // Graceful fallback for non-polygon or unparsable geometry
    }
  }

  private extendBounds(bounds: maplibregl.LngLatBounds, coords: unknown): void {
    if (Array.isArray(coords)) {
      if (typeof coords[0] === 'number' && typeof coords[1] === 'number') {
        bounds.extend([coords[0], coords[1]]);
      } else {
        for (const item of coords) {
          this.extendBounds(bounds, item);
        }
      }
    }
  }

  clearFootprint(): void {
    if (!this.map || !this.isLoaded) return;
    if (this.map.getLayer('region-footprint-stroke')) this.map.removeLayer('region-footprint-stroke');
    if (this.map.getLayer('region-footprint-fill')) this.map.removeLayer('region-footprint-fill');
    if (this.map.getSource('region-footprint')) this.map.removeSource('region-footprint');
  }
}
