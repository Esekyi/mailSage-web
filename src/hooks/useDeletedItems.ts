import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { axiosInstance } from '@/lib/axios'
import { DeletedItemsResponse, RestoreResponse, DeleteResponse } from '@/types/deleted-items'
import { useToast } from '@/hooks/use-toast'

export function useDeletedItems() {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  const { data, isLoading } = useQuery<DeletedItemsResponse>({
    queryKey: ['deleted-items'],
    queryFn: async () => {
      const { data } = await axiosInstance.get('/api/v1/profile/deleted')
      return data
    }
  })

  const restoreTemplate = useMutation<RestoreResponse, Error, number>({
    mutationFn: async (templateId) => {
      const { data } = await axiosInstance.post(`/api/v1/profile/restore/template/${templateId}`)
      return data
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['deleted-items'] })
      toast({ title: "Success", description: data.message })
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.response?.data?.error || "Failed to restore template",
        variant: "destructive"
      })
    }
  })

  const restoreSmtp = useMutation<RestoreResponse, Error, number>({
    mutationFn: async (smtpId) => {
      const { data } = await axiosInstance.post(`/api/v1/profile/restore/smtp/${smtpId}`)
      return data
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['deleted-items'] })
      toast({ title: "Success", description: data.message })
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.response?.data?.error || "Failed to restore SMTP",
        variant: "destructive"
      })
    }
  })

  const permanentlyDeleteTemplate = useMutation<DeleteResponse, Error, number>({
    mutationFn: async (templateId) => {
      const { data } = await axiosInstance.delete(`/api/v1/profile/template/${templateId}/permanent`, {
        data: { confirmation_text: "PERMANENT DELETE" }
      })
      return data
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['deleted-items'] })
      toast({ title: "Success", description: data.message })
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.response?.data?.error || "Failed to delete template",
        variant: "destructive"
      })
    }
  })

  const permanentlyDeleteSmtp = useMutation<DeleteResponse, Error, number>({
    mutationFn: async (smtpId) => {
      const { data } = await axiosInstance.delete(`/api/v1/profile/smtp/${smtpId}/permanent`, {
        data: { confirmation_text: "PERMANENT DELETE" }
      })
      return data
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['deleted-items'] })
      toast({ title: "Success", description: data.message })
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.response?.data?.error || "Failed to delete SMTP",
        variant: "destructive"
      })
    }
  })

  const permanentlyDeleteAllTemplates = useMutation<DeleteResponse, Error, void>({
    mutationFn: async () => {
      const { data } = await axiosInstance.delete('/api/v1/profile/templates/permanent-delete-all', {
        data: { confirmation_text: "PERMANENT DELETE ALL TEMPLATES" }
      })
      return data
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['deleted-items'] })
      toast({ title: "Success", description: data.message })
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.response?.data?.error || "Failed to delete all templates",
        variant: "destructive"
      })
    }
  })

  const permanentlyDeleteAllSmtps = useMutation<DeleteResponse, Error, void>({
    mutationFn: async () => {
      const { data } = await axiosInstance.delete('/api/v1/profile/smtps/permanent-delete-all', {
        data: { confirmation_text: "PERMANENT DELETE ALL SMTP CONFIGS" }
      })
      return data
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['deleted-items'] })
      toast({ title: "Success", description: data.message })
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.response?.data?.error || "Failed to delete all SMTP configs",
        variant: "destructive"
      })
    }
  })

  return {
    deletedItems: data,
    isLoading,
    restoreTemplate: restoreTemplate.mutateAsync,
    restoreSmtp: restoreSmtp.mutateAsync,
    permanentlyDeleteTemplate: permanentlyDeleteTemplate.mutateAsync,
    permanentlyDeleteSmtp: permanentlyDeleteSmtp.mutateAsync,
    permanentlyDeleteAllTemplates: permanentlyDeleteAllTemplates.mutateAsync,
    permanentlyDeleteAllSmtps: permanentlyDeleteAllSmtps.mutateAsync,
  }
}
