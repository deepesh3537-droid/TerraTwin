import { apiClient } from '../apiClient';
import { Planet } from '../../types';

export async function getPlanets(): Promise<Planet[]> {
  const response = await apiClient.get<Planet[]>('/planets');
  return response.data;
}

export async function getPlanet(id: string): Promise<Planet> {
  const response = await apiClient.get<Planet>(`/planets/${id}`);
  return response.data;
}
