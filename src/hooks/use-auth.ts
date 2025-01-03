import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useRouter } from "next/navigation"
import { User, LoginResponse } from '@/types/auth'
import { api, apiConfig } from '@/lib/api-config'
import { useAuthStore } from '@/store/auth'
import { useEffect } from 'react'

export function useAuth() {
  const router = useRouter()
  const queryClient = useQueryClient()
  const { setAuth, logout, updateUser: updateUserStore, isAuthenticated } = useAuthStore()

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      router.replace('/dashboard')
    }
  }, [isAuthenticated, router])

  // Login mutation
  const loginMutation = useMutation({
    mutationFn: async ({
      email,
      password
    }: {
      email: string,
      password: string
    }) => {
      const response = await api.post<LoginResponse, { email: string, password: string }>(
        apiConfig.endpoints.auth.login,
        { email, password }
      )
      return response.data.data
    },
    onSuccess: (data) => {
      if (!data.user.email_verified) {
        throw new Error('EMAIL_NOT_VERIFIED')
      }

      // Update Zustand store
      setAuth({
        user: data.user,
        tokens: {
          access_token: data.access_token,
          refresh_token: data.refresh_token,
        },
      })

      // Update React Query cache
      queryClient.setQueryData(['auth-user'], data.user)
      router.push('/dashboard')
    },
    onError: (error) => {
      if (error instanceof Error && error.message === 'EMAIL_NOT_VERIFIED') {
        router.push('/resend-verification')
      }
      throw error
    },
  })


  // Logout mutation
  const logoutMutation = useMutation({
    mutationFn: async () => {
     // Clear Zustand store
      logout()
      // Clear React Query cache
      queryClient.clear()
      router.push('/login')
    },
  })

  // Update user mutation
  const updateUserMutation = useMutation({
    mutationFn: async (updatedUser: User) => {
      updateUserStore(updatedUser)
      return updatedUser
    },
    onSuccess: (updatedUser) => {
      queryClient.setQueryData(['auth-user'], updatedUser)
    },
  })

  return {
    ...useAuthStore(),
    login: loginMutation.mutateAsync,
    logout: logoutMutation.mutateAsync,
    updateUser: updateUserMutation.mutateAsync,
    isLoginLoading: loginMutation.isPending,
    isLogoutLoading: logoutMutation.isPending,
  }
}
