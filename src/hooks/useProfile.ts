import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { ProfileResponse, ProfileUpdateData } from '@/types/profile'
import { useToast } from '@/hooks/use-toast'
import { useAuthStore } from '@/store/auth'
import axiosInstance from '@/lib/axios'

export function useProfile() {
  const { toast } = useToast()
  const queryClient = useQueryClient()
  const { updateUser } = useAuthStore()

  // Query for getting profile
  const profileQuery = useQuery<ProfileResponse>({
    queryKey: ['profile'],
    queryFn: async () => {
      const { data } = await axiosInstance.get('/api/v1/profile')
      if (data?.profile) {
        updateUser({
          ...data.profile,
          email_verified: true,
          notifications_settings: data.notifications_settings || {
            email_notifications: false,
            in_app_notifications: false
          }
        })
      }
      return data
    }
  })

  // Profile mutation
  const updateProfileMutation = useMutation<ProfileResponse, Error, ProfileUpdateData>({
    mutationFn: async (data: ProfileUpdateData) => {
      const response = await axiosInstance.put('/api/v1/profile', data)
      return response.data
    },
    onSuccess: async () => {
      // Refetch the profile data
      await queryClient.invalidateQueries({ queryKey: ['profile'] })

      toast({
        title: "Success",
        description: "Your profile has been updated.",
      })
    },
  })


  return {
    profile: profileQuery.data,
    isLoading: profileQuery.isLoading,
    updateProfile: updateProfileMutation.mutateAsync,
    isUpdating: updateProfileMutation.isPending,
  }
}
