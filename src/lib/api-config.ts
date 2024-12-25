const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

export const apiConfig = {
  baseUrl: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
}

export interface ApiError {
  status: string;
  message: string;
  errors?: Record<string, string[]>;
}

export async function fetchApi<T>(endpoint: string, options: RequestInit = {}):Promise<T> {
  const url = `${apiConfig.baseUrl}${endpoint}`
  const token = localStorage.getItem('authToken')

  const headers = {
    ...apiConfig.headers,
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers,
	})
	  
	  const data = await response.json()

	  if (!response.ok) {
		// Handle API error response
      const error: ApiError = {
        status: data.status || 'error',
        message: data.message || 'An unexpected error occurred',
        errors: data.errors
      }
      throw error
    }

    return data

  } catch (error) {
    if ((error as ApiError).status) {
    // If it's our ApiError type, throw it as is
    throw error
    }
    // For network errors or other unexpected errors
    console.error('API Error:', error)
    throw {
      status: 'error',
      message: 'Network error or server is unreachable'
    } as ApiError
  }
}