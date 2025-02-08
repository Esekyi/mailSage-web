import { useAuthStore } from '@/store/auth'


const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:80'
const API_VERSION = process.env.NEXT_PUBLIC_API_VERSION || 'v1'


export interface ApiError {
  status: string;
  message: string;
  errors?: Record<string, string[]>;
  code?: string; // For specific error codes like 'EMAIL_NOT_VERIFIED'
}

interface ApiResponse<T> {
  data: T;
  message?: string;
}


export const apiConfig = {
  baseUrl: `${API_URL}/api/${API_VERSION}`,
  headers: {
    'Content-Type': 'application/json',
  },
  endpoints: {
    auth: {
      login: '/auth/login',
      register: '/auth/register',
      verify: '/auth/verify-email',
      resend: '/auth/resend-verification',
      refresh: '/auth/refresh',
    },
    templates: '/templates',
    smtp: '/smtp/configs',
    apiKeys: '/auth/api-keys',
    analytics: '/analytics',
  },
};

// Token management
const getAuthToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('authToken');
  }
  return null;
};

const getRefreshToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('refreshToken');
  }
  return null;
};

export async function fetchApi<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const url = `${apiConfig.baseUrl}${endpoint}`
  const token = getAuthToken()

  const headers = {
    ...apiConfig.headers,
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  }

  console.log('API Request URL:', url);
  console.log('API Request Headers:', headers);
  try {
    const response = await fetch(url, {
      ...options,
      headers,
    })

    const data = await response.json()

    // Handle 401 errors with token refresh
    if (response.status === 401) {
      const refreshToken = getRefreshToken();
      if (refreshToken) {
        try {
          const refreshResponse = await fetch(`${apiConfig.baseUrl}${apiConfig.endpoints.auth.refresh}`, {
            method: 'POST',
            headers: apiConfig.headers,
            body: JSON.stringify({ refresh_token: refreshToken }),
          });

          if (refreshResponse.ok) {
            const { access_token } = await refreshResponse.json();
            localStorage.setItem('authToken', access_token);

            // Retry original request with new token
            return fetchApi<T>(endpoint, options);
          }
        } catch (_refreshError) {
          // Handle refresh failure
          localStorage.removeItem('authToken');
          localStorage.removeItem('refreshToken');
          window.location.href = '/login';
          throw {
            status: 'error',
            message: 'Session expired. Please login again.',
            code: 'SESSION_EXPIRED'
          } as ApiError;
          console.error('Refresh error:', _refreshError);
        }
      }
    }

	  if (!response.ok) {
		// Handle API error response
      const error: ApiError = {
        status: data.status || 'error',
        message: data.message || 'An unexpected error occurred',
        errors: data.errors,
        code: data.code
      }
      throw error
    }

    return {
      data: data as T,
      message: data.message
    }

  } catch (error) {
    if ((error as ApiError).status) {
    // If it's our ApiError type, throw it as is
    throw error
    }
    // For network errors or other unexpected errors
    console.error('API Error:', error)
    throw {
      status: 'error',
      message: 'Network error or server is unreachable',
      code: 'NETWORK_ERROR'
    } as ApiError
  }
}

// Utility functions for common API operations
export const api = {
  get: <T>(endpoint: string, options?: RequestInit) => {
    const tokens = useAuthStore.getState().tokens
    return fetchApi<T>(endpoint, {
      ...options,
      method: 'GET',
      headers: {
        ...options?.headers,
        ...(tokens?.access_token ? {
          Authorization: `Bearer ${tokens.access_token}`
        } : {}),
      }
    })
  },

  post: <T, D extends Record<string, unknown>>(endpoint: string, data: D, options?: RequestInit) => {
    const tokens = useAuthStore.getState().tokens
    return fetchApi<T>(endpoint, {
      ...options,
      method: 'POST',
      headers: {
        ...options?.headers,
        ...(tokens?.access_token ? {
          Authorization: `Bearer ${tokens.access_token}`
        } : {}),
      },
      body: JSON.stringify(data),
    })
  },

  put: <T, D extends Record<string, unknown>>(endpoint: string, data: D, options?: RequestInit) => {
    const tokens = useAuthStore.getState().tokens
    return fetchApi<T>(endpoint, {
      ...options,
      method: 'PUT',
      headers: {
        ...options?.headers,
        ...(tokens?.access_token ? {
          Authorization: `Bearer ${tokens.access_token}`
        } : {}),
      },
      body: JSON.stringify(data),
    })
  },

  delete: <T>(endpoint: string, options?: RequestInit) => {
    const tokens = useAuthStore.getState().tokens
    return fetchApi<T>(endpoint, {
      ...options,
      method: 'DELETE',
      headers: {
        ...options?.headers,
        ...(tokens?.access_token ? {
          Authorization: `Bearer ${tokens.access_token}`
        } : {}),
      },
    })
  },
};
