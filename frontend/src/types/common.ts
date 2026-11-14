/**
 * Common TypeScript interfaces matching backend schemas (common.py).
 */

export interface PaginationParams {
  limit?: number;
  offset?: number;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  limit: number;
  offset: number;
}

export interface ErrorDetail {
  code: string;
  message: string;
  details?: unknown;
  request_id?: string;
}

export interface ErrorEnvelope {
  error: ErrorDetail;
}
