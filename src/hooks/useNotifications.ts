import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { axiosInstance } from '@/lib/axios'
import { NotificationsResponse, UnreadCountResponse, MarkAsReadResponse } from '@/types/notifications'
import { useToast } from '@/hooks/use-toast'

export function useNotifications(page = 1, per_page = 12) {
  const queryClient = useQueryClient()
  const { success, error } = useToast()

  const notificationsQuery = useQuery<NotificationsResponse>({
    queryKey: ['notifications', page, per_page],
    queryFn: async () => {
      const { data } = await axiosInstance.get(
        `/api/v1/profile/notifications?page=${page}&per_page=${per_page}`
      )
      return data
    }
  })

  const unreadCountQuery = useQuery<UnreadCountResponse>({
    queryKey: ['notifications-unread'],
    queryFn: async () => {
      const { data } = await axiosInstance.get('/api/v1/profile/notifications/unread')
      return data
    },
    refetchInterval: 30000 // Refetch every 30 seconds
  })

  const markAsReadMutation = useMutation<MarkAsReadResponse, Error, number[]>({
    mutationFn: async (notificationIds) => {
      const { data } = await axiosInstance.post('/api/v1/profile/notifications/read', {
        notification_ids: notificationIds
      })
      return data
    },
    onSuccess: (_data) => {
      // Invalidate queries to refetch data
      queryClient.invalidateQueries({ queryKey: ['notifications'] })
      queryClient.invalidateQueries({ queryKey: ['notifications-unread'] })

      success({
        title: "Success",
        description: "Notifications marked as read",
      })
    },
    onError: (err: Error | { response?: { data?: { error?: string } } }) => {
      error({
        title: "Oops!",
        description: err.response?.data?.error || "Failed to mark notifications as read",
      })
    }
  })

  return {
    notifications: notificationsQuery.data?.notifications || [],
    pagination: notificationsQuery.data?.pagination,
    isLoading: notificationsQuery.isLoading,
    unreadCount: unreadCountQuery.data?.unread_count || 0,
    isLoadingUnreadCount: unreadCountQuery.isLoading,
    markAsRead: markAsReadMutation.mutateAsync,
    isMarkingAsRead: markAsReadMutation.isPending,
  }
}
