import { infiniteQueryOptions } from '@tanstack/solid-query'
import { samson } from '~/shared/api'

export const samsonQueryOptions = infiniteQueryOptions({
  queryKey: ['samson/products'],
  queryFn: async ({ pageParam, signal }) => {
    console.log('quryFn', pageParam)
    const res = await samson.api.getProducts({ pagination_page: pageParam }, signal)
    const universalProducts = res.data.map((p) => samson.toUniversalProduct(p))
    console.log('meta', res.meta)
    return { data: universalProducts, meta: res.meta }
  },
  initialPageParam: 1,
  getNextPageParam: (res) => {
    console.log('getNextPageParam', res.meta.pagination.nextPage)
    return res.meta.pagination.nextPage
  },
})