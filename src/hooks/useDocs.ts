import { useQuery } from '@tanstack/react-query'
import { axiosInstance } from '@/lib/axios'
import type { DocCategory, DocDetail, SearchResponse, DocSection } from '@/types/docs'

interface ApiDocItem {
  slug: string
  title: string
  description?: string
  order: number
}

type ApiDocsResponse = Record<string, ApiDocItem[]>

// Default category order
const DEFAULT_CATEGORY_ORDER: Record<string, number> = {
  'Overview': 1,
  'API Reference': 2,
  'Guides': 3
} as const

// Helper function to get category order
const getCategoryOrder = (category: string): number => {
  return DEFAULT_CATEGORY_ORDER[category] ?? 999
}

export function useDocs() {
  const { data: categories, isLoading: isLoadingCategories, error: categoriesError } = useQuery<DocCategory>({
    queryKey: ['docs-categories'],
    queryFn: async () => {
      try {
        const { data } = await axiosInstance.get('/api/v1/docs/categories')
        console.log('Categories API response:', data)
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
        console.log('Raw docs API response:', data)

        // Transform and sort the data
        const sections: DocSection[] = Object.entries(data)
          // Sort by predefined category order first
          .sort(([titleA], [titleB]) => {
            const orderA = getCategoryOrder(titleA)
            const orderB = getCategoryOrder(titleB)
            const orderDiff = orderA - orderB
            if (orderDiff === 0) {
              return titleA.localeCompare(titleB)
            }
            return orderDiff
          })
          .map(([title, items]) => ({
            title,
            items: items
              // Sort items by their order, then by title
              .sort((a, b) => {
                const orderDiff = (a.order || 0) - (b.order || 0)
                if (orderDiff === 0) {
                  return (a.title || '').localeCompare(b.title || '')
                }
                return orderDiff
              })
              .map(item => ({
                ...item,
                description: item.description || ''
              }))
          }))

        console.log('Transformed sections:', sections)
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
