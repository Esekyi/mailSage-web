import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Template } from '@/types/template'
import { axiosInstance } from '@/lib/axios'
import { PaginationParams, PaginatedResponse } from '@/types/pagination'


interface CreateTemplateData {
  name: string
  description?: string
  html_content: string
}

export function useTemplates(params: PaginationParams) {
  return useQuery<PaginatedResponse<Template>>({
    queryKey: ['templates', params],
    queryFn: async () => {
      const { data } = await axiosInstance.get('/api/v1/templates', {
        params: {
          page: params.page,
          per_page: params.per_page,
          search: params.search,
          sort_by: params.sort_by,
          sort_order: params.sort_order
        }
      })
      return data
    }
  })
}

export function useCreateTemplate() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (templateData: CreateTemplateData) => {
      const { data } = await axiosInstance.post('/api/v1/templates', templateData)
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['templates'] })
    }
  })
}

export function useDeleteTemplate() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (templateId: number) => {
      await axiosInstance.delete(`/api/v1/templates/${templateId}`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['templates'] })
    }
  })
}

export function useUpdateTemplate() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      templateId,
      data
    }: {
      templateId: number
      data: {
        name: string
        description?: string
        html_content: string
        change_summary?: string
      }
    }) => {
      const response = await axiosInstance.put(`/api/v1/templates/${templateId}`, data)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['templates'] })
    }
  })
}
