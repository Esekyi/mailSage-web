import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { axiosInstance } from '@/lib/axios'
import { type Job, type JobAnalytics } from '@/types/jobs'
import { toast } from 'sonner'

export function useJobStatus(jobId: number) {
  return useQuery<Job>({
    queryKey: ['job', jobId],
    queryFn: async () => {
      const { data } = await axiosInstance.get<Job>(`/api/v1/jobs/${jobId}/status`)
      return data
    },
    refetchInterval: (query) => {
      const data = query.state.data
      return data && ['processing', 'pending'].includes(data.status) ? 5000 : false
    },
  })
}

export function useJobAnalytics(jobId: number) {
  return useQuery<JobAnalytics>({
    queryKey: ['job-analytics', jobId],
    queryFn: async () => {
      const { data } = await axiosInstance.get<JobAnalytics>(`/api/v1/jobs/${jobId}/analytics`)
      return data
    },
  })
}

export function useActiveJobs() {
  return useQuery<{ active_jobs: Job[] }>({
    queryKey: ['active-jobs'],
    queryFn: async () => {
      const { data } = await axiosInstance.get('/api/v1/jobs/active')
      return data
    },
    refetchInterval: 5000, // Refresh every 5 seconds for active jobs
  })
}

export function useJobs() {
  const queryClient = useQueryClient()

  const fetchJobs = async (params: {
    page: number
    per_page: number
    status?: string[]
    start_date?: string
    end_date?: string
  }) => {
    const { data } = await axiosInstance.get('/api/v1/jobs/history', { params })
    return data
  }

  const controlJobMutation = useMutation({
    mutationFn: async ({ jobId, action, maxRetries }: { jobId: number, action: 'pause' | 'resume' | 'stop' | 'retry', maxRetries?: number }) => {
      if (action === 'retry') {
        const { data } = await axiosInstance.post(`/api/v1/jobs/${jobId}/retry`, {
          max_retries: maxRetries || 3
        })
        return data
      }
      const { data } = await axiosInstance.post(`/api/v1/jobs/${jobId}/${action}`)
      return data
    },
    onSuccess: (data) => {
      // Show success message if it's a retry action
      if (data.retry_count !== undefined) {
        toast.success(`Queued ${data.retry_count} deliveries for retry`)
      }
      // Invalidate both jobs list and individual job queries
      queryClient.invalidateQueries({ queryKey: ['jobs'] })
      queryClient.invalidateQueries({ queryKey: ['job'] })
      queryClient.invalidateQueries({ queryKey: ['active-jobs'] })
    },
    onError: (error: Error & { response?: { data?: { error?: string } } }) => {
      toast.error(error.response?.data?.error || error.message || 'Failed to control job')
    }
  })

  const bulkControlMutation = useMutation({
    mutationFn: async (params: { job_ids: number[]; action: 'pause' | 'resume' | 'stop' | 'retry', maxRetries?: number }) => {
      if (params.action === 'retry') {
        const { data } = await axiosInstance.post('/api/v1/jobs/bulk/retry', {
          job_ids: params.job_ids,
          max_retries: params.maxRetries || 3
        })
        return data
      }
      const { data } = await axiosInstance.post('/api/v1/jobs/bulk/control', {
        job_ids: params.job_ids,
        action: params.action
      })
      return data
    },
    onSuccess: (data) => {
      if (data.total_retried !== undefined) {
        toast.success(`Queued ${data.total_retried} deliveries for retry across ${data.jobs_count} jobs`)
      }
      queryClient.invalidateQueries({ queryKey: ['jobs'] })
      queryClient.invalidateQueries({ queryKey: ['active-jobs'] })
    },
    onError: (error: Error & { response?: { data?: { error?: string } } }) => {
      toast.error(error.response?.data?.error || error.message || 'Failed to perform bulk action')
    }
  })

  return {
    fetchJobs,
    controlJob: controlJobMutation.mutateAsync,
    bulkControl: bulkControlMutation.mutateAsync,
  }
}
