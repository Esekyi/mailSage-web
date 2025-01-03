import { useQuery } from '@tanstack/react-query'
import { usePagination } from '@/hooks/usePagination'
import { axiosInstance } from '@/lib/axios'
import {
  DashboardOverview,
  RecentActivity,
  EmailJob,
  Template,
  SMTPConfig,
  APIKey
} from '@/types/dashboard'
import { PaginationParams } from '@/types/pagination'

export const useDashboard = () => {
  return useQuery<DashboardOverview>({
    queryKey: ['dashboard-overview'],
    queryFn: async () => {
      const { data } = await axiosInstance.get('/api/v1/dashboard/overview')
      return data
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

export const useRecentActivity = (params: PaginationParams = {}) => {
  return usePagination<RecentActivity>(
    ['recent-activity'],
    '/api/v1/dashboard/recent-activity',
    params
  )
}

export const useEmailJobs = (params: PaginationParams = {}) => {
  return usePagination<EmailJob>(
    ['email-jobs'],
    '/api/v1/dashboard/email-jobs',
    params
  )
}

export const useTemplates = (params: PaginationParams = {}) => {
  return usePagination<Template>(
    ['templates'],
    '/api/v1/templates',
    params
  )
}

export const useSMTPConfigs = (params: PaginationParams = {}) => {
  return usePagination<SMTPConfig>(
    ['smtp-configs'],
    '/api/v1/smtp/configs',
    params
  )
}

export const useAPIKeys = (params: PaginationParams = {}) => {
  return usePagination<APIKey>(
    ['api-keys'],
    '/api/v1/auth/api-keys',
    params
  )
}
