import { apiClient } from '../apiClient';
import { Dataset, Layer, PaginatedResponse, Region, RegionFilterParams } from '../../types';

export async function getRegions(params?: RegionFilterParams): Promise<PaginatedResponse<Region>> {
  const response = await apiClient.get<PaginatedResponse<Region>>('/regions', {
    params,
  });
  return response.data;
}

export async function getRegion(id: string): Promise<Region> {
  const response = await apiClient.get<Region>(`/regions/${id}`);
  return response.data;
}

export async function getRegionDatasets(id: string): Promise<Dataset[]> {
  const response = await apiClient.get<Dataset[]>(`/regions/${id}/datasets`);
  return response.data;
}

export async function getRegionLayers(id: string): Promise<Layer[]> {
  const response = await apiClient.get<Layer[]>(`/regions/${id}/layers`);
  return response.data;
}
