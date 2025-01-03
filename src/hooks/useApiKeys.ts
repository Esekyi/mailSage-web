import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { axiosInstance } from '@/lib/axios'
import type { AxiosError } from 'axios'
import type {
  CreateAPIKeyRequest,
  CreateAPIKeyResponse,
  APIKeysListResponse,
  RevokeAPIKeyResponse
} from '@/types/api-keys'
import { useToast } from '@/hooks/use-toast'

interface ApiErrorResponse {
  error: string;
  current_usage?: number;
  limit?: number;
}

export function useApiKeys() {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  const { data: apiKeys, isLoading } = useQuery<APIKeysListResponse>({
    queryKey: ['api-keys'],
    queryFn: async () => {
      const { data } = await axiosInstance.get('/api/v1/auth/api-keys')
      return data
    }
  })

  const createApiKey = useMutation<CreateAPIKeyResponse, AxiosError<ApiErrorResponse>, CreateAPIKeyRequest>({
    mutationFn: async (request) => {
      const { data } = await axiosInstance.post('/api/v1/auth/api-keys', request)
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['api-keys'] })
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.response?.data?.error || "Failed to create API key",
        variant: "destructive",
      })
    }
  })

  const revokeApiKey = useMutation<RevokeAPIKeyResponse, AxiosError<ApiErrorResponse>, number>({
    mutationFn: async (keyId) => {
      const { data } = await axiosInstance.delete(`/api/v1/auth/api-keys/${keyId}`)
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['api-keys'] })
      toast({
        title: "Success",
        description: "API key revoked successfully",
      })
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.response?.data?.error || "Failed to revoke API key",
        variant: "destructive",
      })
    }
  })

  return {
    apiKeys: apiKeys?.api_keys || [],
    isLoading,
    createApiKey: createApiKey.mutateAsync,
    revokeApiKey: revokeApiKey.mutateAsync,
    isCreating: createApiKey.isPending,
    isRevoking: revokeApiKey.isPending,
  }
}
