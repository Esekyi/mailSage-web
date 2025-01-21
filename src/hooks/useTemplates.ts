import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { axiosInstance } from '@/lib/axios'
import type {
  Template,
  TemplateListResponse,
  CreateTemplatePayload,
  UpdateTemplatePayload,
  CompareVersionsResponse,
  TemplateDifference,
  TemplateApiError
} from '@/types/templates'
import { AxiosError } from 'axios'

interface UseTemplatesOptions {
  page?: number
  per_page?: number
  sort_by?: string
  sort_order?: 'asc' | 'desc'
  search?: string
  tags?: string[]
}

export function useTemplates(options: UseTemplatesOptions = {}) {
  const queryClient = useQueryClient()
  const {
    page = 1,
    per_page = 10,
    sort_by = 'updated_at',
    sort_order = 'desc',
    search = '',
    tags = []
  } = options

  // List templates with pagination, sorting, and filtering
  const {
    data: templatesData,
    isLoading,
    error
  } = useQuery<TemplateListResponse, AxiosError<TemplateApiError>>({
    queryKey: ['templates', { page, per_page, sort_by, sort_order, search, tags }],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: page.toString(),
        per_page: per_page.toString(),
        sort_by,
        sort_order
      })

      if (search) {
        params.append('search', search)
      }

      if (tags.length > 0) {
        tags.forEach(tag => params.append('tags', tag))
      }

      const { data } = await axiosInstance.get('/api/v1/templates', { params })
      return data
    }
  })

  // Get a specific template version
  const getTemplateVersion = async (templateId: number, version: number) => {
    const { data } = await axiosInstance.get<Template>(
      `/api/v1/templates/${templateId}/versions/${version}`
    )
    return data
  }

  // Compare two versions of a template
  const compareVersions = async (templateId: number, version1: number, version2: number): Promise<CompareVersionsResponse & { differences: TemplateDifference[] }> => {
    const { data } = await axiosInstance.get<CompareVersionsResponse>(
      `/api/v1/templates/${templateId}/versions/compare`,
      { params: { version1, version2 } }
    )

    // Compute differences manually
    const differences: TemplateDifference[] = []

    // Compare html_content
    if (data.version1.html_content !== data.version2.html_content) {
      differences.push({
        field: 'HTML Content',
        old_value: data.version1.html_content || '',
        new_value: data.version2.html_content || ''
      })
    }

    // Compare meta_data fields
    const metaFields = {
      name: 'Name',
      description: 'Description',
      archived_at: 'Archived At',
      change_summary: 'Change Summary'
    } as const

    Object.entries(metaFields).forEach(([key, label]) => {
      const oldValue = data.version1.meta_data[key as keyof typeof metaFields]
      const newValue = data.version2.meta_data[key as keyof typeof metaFields]

      if (oldValue !== newValue) {
        differences.push({
          field: label,
          old_value: oldValue || 'None',
          new_value: newValue || 'None'
        })
      }
    })

    // Add version information
    differences.push({
      field: 'Version',
      old_value: `Version ${data.version1.version}`,
      new_value: `Version ${data.version2.version}`
    })

    // Add creation date information
    differences.push({
      field: 'Created At',
      old_value: new Date(data.version1.created_at).toLocaleString(),
      new_value: new Date(data.version2.created_at).toLocaleString()
    })

    return {
      ...data,
      differences
    }
  }

  // Create template mutation
  const createTemplate = useMutation<Template, AxiosError<TemplateApiError>, CreateTemplatePayload>({
    mutationFn: async (payload) => {
      const { data } = await axiosInstance.post('/api/v1/templates', payload)
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['templates'] })
    }
  })

  // Update template mutation
  const updateTemplate = useMutation<Template, AxiosError<TemplateApiError>, { id: number; payload: UpdateTemplatePayload }>({
    mutationFn: async ({ id, payload }) => {
      const { data } = await axiosInstance.put(`/api/v1/templates/${id}`, payload)
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['templates'] })
    }
  })

  // Revert to version mutation
  const revertToVersion = useMutation<Template, AxiosError<TemplateApiError>, { templateId: number; version: number }>({
    mutationFn: async ({ templateId, version }) => {
      const { data } = await axiosInstance.post(
        `/api/v1/templates/${templateId}/versions/${version}/revert`
      )
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['templates'] })
    }
  })

  // Delete template mutation
  const deleteTemplate = useMutation<void, AxiosError<TemplateApiError>, number>({
    mutationFn: async (id) => {
      await axiosInstance.delete(`/api/v1/templates/${id}`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['templates'] })
    }
  })

  return {
    templates: templatesData?.templates || [],
    pagination: templatesData?.pagination,
    isLoading,
    error,
    getTemplateVersion,
    compareVersions,
    createTemplate,
    updateTemplate,
    revertToVersion,
    deleteTemplate
  }
}
