/**
 * System and Health interfaces matching backend responses.
 */

export interface RootHealth {
  status: string;
  app: string;
}

export interface ReadinessResponse {
  status: 'ready' | 'degraded' | string;
  database: 'connected' | 'disconnected' | string;
  services: {
    database: string;
    [key: string]: string;
  };
}

export interface SystemInfo {
  app_name: string;
  version: string;
  api_version: string;
  environment: string;
  modules: Record<string, string>;
}
