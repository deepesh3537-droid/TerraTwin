/**
 * Layer interfaces matching layer.py backend schema.
 */

export interface Layer {
  id: string;
  name: string;
  description?: string | null;
  planet_id: string;
  category: string;
  dataset_id?: string | null;
  variable: string;
  unit?: string | null;
  available: boolean;
  rendering_type: 'raster' | 'vector' | 'metadata_only';
  rendering_url?: string | null;
  coordinate_reference_system: string;
  style?: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
}

export interface LayerFilterParams {
  planet?: string;
  category?: string;
  available?: boolean;
}
