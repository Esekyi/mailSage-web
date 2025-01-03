import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { axiosInstance } from '@/lib/axios'
import type { SMTPListResponse, CreateSMTPConfig, UpdateSMTPConfig, TestEmailResponse, SMTPResponse } from '@/types/smtp'
import { useToast } from '@/hooks/use-toast'
import type { AxiosError } from 'axios'

interface ApiErrorResponse {
  error: string;
  errors?: Record<string, string[]>;
}

interface TestEmailParams {
  id: number;
  to_email: string;
}

export function useSmtp() {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  const { data: smtpConfigs, isLoading } = useQuery<SMTPListResponse>({
    queryKey: ['smtp-configs'],
    queryFn: async () => {
      const { data } = await axiosInstance.get('/api/v1/smtp/configs')
      return data
    }
  })

  const createSmtp = useMutation<SMTPResponse, AxiosError<ApiErrorResponse>, CreateSMTPConfig>({
    mutationFn: async (config) => {
      const { data } = await axiosInstance.post('/api/v1/smtp/configs', config)
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['smtp-configs'] })
      toast({
        title: "Success",
        description: "SMTP configuration created successfully",
      })
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.response?.data?.error || "Failed to create SMTP configuration",
        variant: "destructive",
      })
    }
  })

  const updateSmtp = useMutation<SMTPResponse, AxiosError<ApiErrorResponse>, UpdateSMTPConfig>({
    mutationFn: async ({ id, ...config }) => {
      const { data } = await axiosInstance.put(`/api/v1/smtp/configs/${id}`, config)
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['smtp-configs'] })
      toast({
        title: "Success",
        description: "SMTP configuration updated successfully",
      })
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.response?.data?.error || "Failed to update SMTP configuration",
        variant: "destructive",
      })
    }
  })

  const deleteSmtp = useMutation<{ message: string }, AxiosError<ApiErrorResponse>, number>({
    mutationFn: async (id) => {
      const { data } = await axiosInstance.delete(`/api/v1/smtp/configs/${id}`)
      return data
    },
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ['smtp-configs'] })
      toast({
        title: "Success",
        description: response.message,
      })
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.response?.data?.error || "Failed to delete SMTP configuration",
        variant: "destructive",
      })
    }
  })

  const testSmtp = useMutation<TestEmailResponse, AxiosError<ApiErrorResponse>, TestEmailParams>({
    mutationFn: async ({ id, to_email }) => {
      const { data } = await axiosInstance.post(`/api/v1/smtp/configs/${id}/test`, {
        to_email
      })
      return data
    },
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ['smtp-configs'] })
      toast({
        title: "Success",
        description: response.message,
      })
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.response?.data?.error || "Failed to test SMTP configuration",
        variant: "destructive",
      })
    }
  })

  const setDefaultSmtp = useMutation<SMTPResponse, AxiosError<ApiErrorResponse>, number>({
    mutationFn: async (id) => {
      const { data } = await axiosInstance.post(`/api/v1/smtp/configs/${id}/set-default`)
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['smtp-configs'] })
      toast({
        title: "Success",
        description: "Default SMTP configuration updated",
      })
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.response?.data?.error || "Failed to set default SMTP configuration",
        variant: "destructive",
      })
    }
  })

  return {
    smtpConfigs: smtpConfigs?.smtp_configurations || [],
    isLoading,
    createSmtp: createSmtp.mutateAsync,
    updateSmtp: updateSmtp.mutateAsync,
    deleteSmtp: deleteSmtp.mutateAsync,
    testSmtp: testSmtp.mutateAsync,
    setDefaultSmtp: setDefaultSmtp.mutateAsync,
    isCreating: createSmtp.isPending,
    isUpdating: updateSmtp.isPending,
    isDeleting: deleteSmtp.isPending,
    isTesting: testSmtp.isPending,
    isSettingDefault: setDefaultSmtp.isPending,
  }
}
