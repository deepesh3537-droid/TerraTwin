import { Layer } from '../../types';

export interface MapOptions {
  center?: [number, number]; // [lon, lat]
  zoom?: number;
  styleUrl?: string;
  onSelectFeature?: (featureId: string) => void;
}

export interface PlanetaryMapAdapter {
  initialize(container: HTMLElement, options?: MapOptions): void;
  destroy(): void;
  setCenter(center: [number, number], zoom?: number): void;
  addLayer(layer: Layer): void;
  removeLayer(layerId: string): void;
  setRegionFootprint(regionId: string, footprint: unknown): void;
  clearFootprint(): void;
}
