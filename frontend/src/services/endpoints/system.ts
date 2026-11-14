import { apiClient } from '../apiClient';
import { ReadinessResponse, RootHealth, SystemInfo } from '../../types';

export async function getRootHealth(): Promise<RootHealth> {
  // Root health is at /health (unversioned)
  const response = await apiClient.get<RootHealth>('/health', {
    baseURL: apiClient.defaults.baseURL?.replace(/\/api\/v1\/?$/, '') || 'http://localhost:8000',
  });
  return response.data;
}

export async function getReadiness(): Promise<ReadinessResponse> {
  const response = await apiClient.get<ReadinessResponse>('/health/ready');
  return response.data;
}

export async function getSystemInfo(): Promise<SystemInfo> {
  const response = await apiClient.get<SystemInfo>('/system/info');
  return response.data;
}
