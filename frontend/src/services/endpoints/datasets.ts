import { apiClient } from '../apiClient';
import { Dataset, DatasetFilterParams, Layer, PaginatedResponse } from '../../types';

export async function getDatasets(params?: DatasetFilterParams): Promise<PaginatedResponse<Dataset>> {
  const response = await apiClient.get<PaginatedResponse<Dataset>>('/datasets', {
    params,
  });
  return response.data;
}

export async function getDataset(id: string): Promise<Dataset> {
  const response = await apiClient.get<Dataset>(`/datasets/${id}`);
  return response.data;
}

export async function getDatasetLayers(id: string): Promise<Layer[]> {
  const response = await apiClient.get<Layer[]>(`/datasets/${id}/layers`);
  return response.data;
}
