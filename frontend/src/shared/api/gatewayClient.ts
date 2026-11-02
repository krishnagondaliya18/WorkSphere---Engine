import axios, { type InternalAxiosRequestConfig, type AxiosError } from 'axios';
import type { ApiResponse } from './types';

// Create dedicated axios client strictly targeting the API Gateway
export const gatewayClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api/v1',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  timeout: 15000,
});

// Helper to generate UUID v4 for correlation ID tracing
function generateUuid(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

// Request interceptor: Injects JWT, Active Tenant, and Correlation ID
gatewayClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Inject Correlation ID
    config.headers.set('X-Correlation-Id', generateUuid());

    // Inject Access Token from localStorage if present
    const token = localStorage.getItem('worksphere_token');
    if (token) {
      config.headers.set('Authorization', `Bearer ${token}`);
    }

    // Inject Active Organization ID if selected
    const activeOrgId = localStorage.getItem('worksphere_active_org_id');
    if (activeOrgId) {
      config.headers.set('X-Active-Org', activeOrgId);
    }

    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Response interceptor: Handles global auth expiry and error extraction
gatewayClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiResponse<unknown>>) => {
    if (error.response?.status === 401) {
      // Clear token and trigger re-auth if token expired
      localStorage.removeItem('worksphere_token');
      localStorage.removeItem('worksphere_active_org_id');
      if (window.location.pathname !== '/login' && window.location.pathname !== '/register') {
        window.location.href = '/login?expired=true';
      }
    }
    return Promise.reject(error);
  }
);
