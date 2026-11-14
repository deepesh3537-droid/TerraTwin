/**
 * Dataset interfaces matching dataset.py backend schema.
 */

export interface Dataset {
  id: string;
  name: string;
  description?: string | null;
  planet_id: string;
  category: string;
  variable: string;
  source_agency?: string | null;
  mission?: string | null;
  instrument?: string | null;
  format?: string | null;
  unit?: string | null;
  native_resolution?: string | null;
  temporal_start?: string | null;
  temporal_end?: string | null;
  coordinate_reference_system: string;
  processing_level?: string | null;
  license?: string | null;
  source_url?: string | null;
  citation?: string | null;
  local_path?: string | null;
  checksum?: string | null;
  ingestion_status: string;
  quality_notes?: string | null;
  is_demo: boolean;
  created_at: string;
  updated_at: string;
}

export interface DatasetFilterParams {
  planet?: string;
  category?: string;
  variable?: string;
  status?: string;
  limit?: number;
  offset?: number;
}
