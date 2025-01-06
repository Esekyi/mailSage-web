import { useQuery } from '@tanstack/react-query'
import { axiosInstance } from '@/lib/axios'
import type { DocCategory, DocDetail, SearchResponse } from '@/types/docs'

interface ApiDocItem {
  slug: string
  title: string
  description?: string
  order: number
}

type ApiDocsResponse = Record<string, ApiDocItem[]>

export function useDocs() {
  const { data: categories, isLoading: isLoadingCategories, error: categoriesError } = useQuery<DocCategory>({
    queryKey: ['docs-categories'],
    queryFn: async () => {
      try {
        const { data } = await axiosInstance.get('/api/v1/docs/categories')
        console.log('Categories data:', data)
        // Transform categories data if needed
        return data
      } catch (error) {
        console.error('Error fetching categories:', error)
        throw error
      }
    },
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  })

  const { data: docs, isLoading: isLoadingDocs, error: docsError } = useQuery<DocCategory>({
    queryKey: ['docs'],
    queryFn: async () => {
      try {
        const { data } = await axiosInstance.get<ApiDocsResponse>('/api/v1/docs')
        console.log('Docs data:', data)

        // Transform the data into the expected format
        const sections = Object.entries(data).map(([title, items]) => ({
          title,
          items: items.map(item => ({
            ...item,
            description: item.description || ''
          }))
        }))

        return { sections }
      } catch (error) {
        console.error('Error fetching docs:', error)
        throw error
      }
    },
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  })

  const useDocDetail = (slug: string) => {
    return useQuery<DocDetail>({
      queryKey: ['doc-detail', slug],
      queryFn: async () => {
        try {
          const { data } = await axiosInstance.get(`/api/v1/docs/${slug}`)
          return data
        } catch (error) {
          console.error(`Error fetching doc detail for ${slug}:`, error)
          throw error
        }
      },
      staleTime: 1000 * 60 * 5, // Cache for 5 minutes
      enabled: !!slug,
    })
  }

  const searchDocs = async (query: string): Promise<SearchResponse> => {
    try {
      const { data } = await axiosInstance.get('/api/v1/docs/search', {
        params: { q: query }
      })
      return data
    } catch (error) {
      console.error('Error searching docs:', error)
      throw error
    }
  }

  return {
    categories,
    docs,
    isLoading: isLoadingCategories || isLoadingDocs,
    error: categoriesError || docsError,
    useDocDetail,
    searchDocs
  }
}
