/**
 * Region interfaces matching region.py backend schema.
 */

export interface Region {
  id: string;
  name: string;
  description?: string | null;
  planet_id: string;
  footprint?: {
    type: string;
    coordinates: unknown;
  } | null;
  coordinate_reference_system: string;
  source_provenance?: string | null;
  tags?: string[] | null;
  characteristics?: Record<string, unknown> | null;
  is_demo: boolean;
  created_at: string;
  updated_at: string;
}

export interface RegionFilterParams {
  planet?: string;
  search?: string;
  limit?: number;
  offset?: number;
}
