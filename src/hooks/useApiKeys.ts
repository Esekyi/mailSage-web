import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { axiosInstance } from '@/lib/axios'
import type { AxiosError } from 'axios'
import type {
  CreateAPIKeyRequest,
  CreateAPIKeyResponse,
  APIKeysListResponse,
  RevokeAPIKeyResponse,
  APIKeyUsageResponse
} from '@/types/api-keys'
import { useToast } from '@/hooks/use-toast'

export function useApiKeys() {
  const queryClient = useQueryClient()
  const { success, error, warning } = useToast()

  const { data: apiKeys, isLoading } = useQuery<APIKeysListResponse>({
    queryKey: ['api-keys'],
    queryFn: async () => {
      const { data } = await axiosInstance.get('/api/v1/api-keys')
      return data
    }
  })

  const createApiKey = useMutation<CreateAPIKeyResponse, AxiosError, CreateAPIKeyRequest>({
    mutationFn: async (request) => {
      const { data } = await axiosInstance.post('/api/v1/api-keys', {
        ...request,
        key_type: request.key_type.toLowerCase()
      })
      return data
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['api-keys'] })
      success({
        description: "Your new API key has been created successfully."
      })
    },
    onError: (err) => {
      error({
        title: "Error",
        description: err.response?.data?.error || "Failed to create API key"
      })
    }
  })

  const revokeApiKey = useMutation<RevokeAPIKeyResponse, AxiosError, number>({
    mutationFn: async (keyId) => {
      const { data } = await axiosInstance.delete(`/api/v1/api-keys/${keyId}`)
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['api-keys'] })
      warning({
        description: "The API key has been revoked successfully."
      })
    },
    onError: (err) => {
      error({
        title: "Error",
        description: err.response?.data?.error || "Failed to revoke API key"
      })
    }
  })

  const getKeyUsage = useMutation<APIKeyUsageResponse, AxiosError, { keyId: number, days?: number }>({
    mutationFn: async ({ keyId, days = 30 }) => {
      const { data } = await axiosInstance.get(`/api/v1/api-keys/${keyId}/usage`, {
        params: { days }
      })
      return data
    }
  })

  return {
    apiKeys: apiKeys?.api_keys || [],
    isLoading,
    createApiKey: createApiKey.mutateAsync,
    revokeApiKey: revokeApiKey.mutateAsync,
    getKeyUsage: getKeyUsage.mutateAsync,
    isCreating: createApiKey.isPending,
    isRevoking: revokeApiKey.isPending,
    isLoadingUsage: getKeyUsage.isPending
  }
}
