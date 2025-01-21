import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { axiosInstance } from "@/lib/axios"
import { AxiosError } from "axios"
import { useToast } from "@/hooks/use-toast"
import {
  type APIKey,
  type APIKeysListResponse,
  type CreateAPIKeyRequest,
  type ApiKeyUsageResponse,
} from "@/types/api-keys"

interface ApiErrorResponse {
  error: string
  errors?: Record<string, string[]>
}

export function useApiKeys() {
  const queryClient = useQueryClient()
  const { error } = useToast()

  const { data, isLoading } = useQuery<APIKeysListResponse, AxiosError<ApiErrorResponse>>({
    queryKey: ["api-keys"],
    queryFn: async () => {
      const { data } = await axiosInstance.get<APIKeysListResponse>("/api/v1/api-keys")
      return data
    },
  })

  const createApiKey = useMutation<
    { api_key: APIKey; key: string },
    AxiosError<ApiErrorResponse>,
    CreateAPIKeyRequest
  >({
    mutationFn: async (data) => {
      const response = await axiosInstance.post("/api/v1/api-keys", data)
      return response.data
    },
    onError: (err) => {
      error({
        description: err.response?.data.error || "Failed to create API key",
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["api-keys"] })
    },
  })

  const deleteApiKey = useMutation<void, AxiosError<ApiErrorResponse>, number>({
    mutationFn: async (id) => {
      await axiosInstance.delete(`/api/v1/api-keys/${id}`)
    },
    onError: (err) => {
      error({
        description: err.response?.data.error || "Failed to delete API key",
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["api-keys"] })
    },
  })

  const useApiKeyUsage = (id: number, days = 30) => {
    return useQuery<ApiKeyUsageResponse, AxiosError<ApiErrorResponse>>({
      queryKey: ["api-key-usage", id, days],
      queryFn: async () => {
        const { data } = await axiosInstance.get<ApiKeyUsageResponse>(
          `/api/v1/api-keys/${id}/usage?days=${days}`
        )
        return data
      },
      enabled: !!id,
    })
  }

  return {
    apiKeys: data?.api_keys || [],
    isLoading,
    createApiKey,
    deleteApiKey,
    useApiKeyUsage,
  }
}
