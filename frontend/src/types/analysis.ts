/**
 * Analysis interfaces matching analysis.py backend schema.
 */

export interface AnalysisCapabilities {
  modules: Record<string, string>;
  supported_dimensions: string[];
}

export interface FeatureExtractionRequest {
  region_id: string;
  dataset_ids: string[];
  features: string[];
}

export interface ComparisonRequest {
  reference_region_id: string;
  candidate_region_id: string;
  variables: string[];
  weights?: Record<string, number> | null;
}

export interface SimilarityRequest {
  target_region_id: string;
  candidate_planet?: string;
  variables: string[];
  weights?: Record<string, number> | null;
  limit?: number;
}

export interface SuitabilityRequest {
  region_id: string;
  criteria: string[];
  weights?: Record<string, number> | null;
}

export interface RoverTestingRequest {
  target_environment: string;
  test_capabilities: string[];
  candidate_region_ids?: string[] | null;
}

export interface AnalysisRun {
  id: string;
  analysis_type: string;
  status: string;
  parameters: Record<string, unknown>;
  results?: Record<string, unknown> | null;
  error_message?: string | null;
  created_at: string;
  completed_at?: string | null;
}
