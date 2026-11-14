import { apiClient } from '../apiClient';
import {
  AnalysisCapabilities,
  AnalysisRun,
  ComparisonRequest,
  FeatureExtractionRequest,
  RoverTestingRequest,
  SimilarityRequest,
  SuitabilityRequest,
} from '../../types';

export async function getCapabilities(): Promise<AnalysisCapabilities> {
  const response = await apiClient.get<AnalysisCapabilities>('/analysis/capabilities');
  return response.data;
}

export async function extractFeatures(data: FeatureExtractionRequest): Promise<unknown> {
  const response = await apiClient.post('/analysis/features', data);
  return response.data;
}

export async function compareRegions(data: ComparisonRequest): Promise<unknown> {
  const response = await apiClient.post('/analysis/compare', data);
  return response.data;
}

export async function findAnalogs(data: SimilarityRequest): Promise<unknown> {
  const response = await apiClient.post('/analysis/similarity', data);
  return response.data;
}

export async function assessSuitability(data: SuitabilityRequest): Promise<unknown> {
  const response = await apiClient.post('/analysis/suitability', data);
  return response.data;
}

export async function identifyRoverTestbeds(data: RoverTestingRequest): Promise<unknown> {
  const response = await apiClient.post('/analysis/rover-testing', data);
  return response.data;
}

export async function getAnalysisRun(id: string): Promise<AnalysisRun> {
  const response = await apiClient.get<AnalysisRun>(`/analysis/runs/${id}`);
  return response.data;
}
