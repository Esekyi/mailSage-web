import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { axiosInstance } from '@/lib/axios'
import type { AxiosError } from 'axios'
import type { PreferencesData, UpdatePreferencesRequest, UpdatePreferencesResponse } from '@/types/preferences'
import { useToast } from '@/hooks/use-toast'

interface ApiErrorResponse {
  error: string;
}

export function usePreferences() {
  const queryClient = useQueryClient()
  const { success, error } = useToast()

  const { data: preferences, isLoading } = useQuery<PreferencesData>({
    queryKey: ['preferences'],
    queryFn: async () => {
      const { data } = await axiosInstance.get('/api/v1/profile/preferences')
      return data
    }
  })

  const updatePreferences = useMutation<UpdatePreferencesResponse, AxiosError<ApiErrorResponse>, UpdatePreferencesRequest>({
    mutationFn: async (updates) => {
      const { data } = await axiosInstance.put('/api/v1/profile/preferences', updates)
      return data
    },
    onSuccess: (response) => {
      queryClient.setQueryData(['preferences'], response.preferences)
      success({
        description: "Preferences updated successfully"
      })
    },
    onError: (err) => {
      error({
        description: err.response?.data?.error || "Failed to update preferences",
      })
    }
  })

  return {
    preferences,
    isLoading,
    updatePreferences: updatePreferences.mutateAsync,
    isUpdating: updatePreferences.isPending,
  }
}
