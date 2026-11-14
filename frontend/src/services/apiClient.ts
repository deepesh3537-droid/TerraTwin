import axios, { AxiosError, AxiosInstance, AxiosResponse } from 'axios';
import { ErrorEnvelope } from '../types';

export class ApiError extends Error {
  code: string;
  statusCode?: number;
  details?: unknown;
  requestId?: string;

  constructor(code: string, message: string, statusCode?: number, details?: unknown, requestId?: string) {
    super(message);
    this.name = 'ApiError';
    this.code = code;
    this.statusCode = statusCode;
    this.details = details;
    this.requestId = requestId;
  }
}

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1';

export const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError<ErrorEnvelope | unknown>) => {
    if (error.response) {
      const status = error.response.status;
      const data = error.response.data as ErrorEnvelope;

      if (data && data.error && typeof data.error === 'object') {
        const { code, message, details, request_id } = data.error;
        return Promise.reject(new ApiError(code || 'SERVER_ERROR', message || error.message, status, details, request_id));
      }

      const defaultMsg = status === 501
        ? 'This scientific analysis capability is planned in the API contract but not yet implemented.'
        : error.message || `Request failed with status ${status}`;

      return Promise.reject(new ApiError(`HTTP_${status}`, defaultMsg, status, error.response.data));
    }

    if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
      return Promise.reject(new ApiError('TIMEOUT', 'Request timed out after 15 seconds. Please try again.', 408));
    }

    return Promise.reject(
      new ApiError(
        'NETWORK_ERROR',
        'Unable to connect to the TerraTwin backend server. Please verify that the backend is running.',
        0
      )
    );
  }
);

export function formatApiError(err: unknown): string {
  if (err instanceof ApiError) {
    return err.message;
  }
  if (err instanceof Error) {
    return err.message;
  }
  return 'An unexpected error occurred while communicating with the server.';
}
