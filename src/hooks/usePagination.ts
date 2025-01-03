import { useQuery } from '@tanstack/react-query'
import axiosInstance from '@/lib/axios'
import { PaginatedResponse, PaginationParams } from '@/types/pagination'

export function usePagination<T>(
  queryKey: string[],
  endpoint: string,
  params: PaginationParams = {}
) {
  return useQuery<PaginatedResponse<T>>({
    queryKey: [...queryKey, params],
    queryFn: async () => {
      const { data } = await axiosInstance.get(endpoint, { params })
      return data
    },
    placeholderData: (previousData) => previousData
  })
}
