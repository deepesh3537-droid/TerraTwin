import { apiClient } from '../apiClient';
import { Layer, LayerFilterParams } from '../../types';

export async function getLayers(params?: LayerFilterParams): Promise<Layer[]> {
  const response = await apiClient.get<Layer[]>('/layers', {
    params,
  });
  return response.data;
}

export async function getLayer(id: string): Promise<Layer> {
  const response = await apiClient.get<Layer>(`/layers/${id}`);
  return response.data;
}
