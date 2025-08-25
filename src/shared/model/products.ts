import { infiniteQueryOptions } from '@tanstack/solid-query'
import { komus, samson } from '~/shared/api'

export const komusQueryOptions = infiniteQueryOptions({
  queryKey: ['komus/products'],
  queryFn: async ({ pageParam, signal }) => {
    console.log('quryFn lomus', pageParam)
    return await komus.api.getUniversalProducts({ pageIndex: pageParam }, signal)
  },
  initialPageParam: 0,
  getNextPageParam: (res) => {
    console.log('getNextPageParam', res.meta.pagination.nextPage)
    return res.meta.pagination.nextPage
  },
})

export const samsonQueryOptions = infiniteQueryOptions({
  queryKey: ['samson/products'],
  queryFn: async ({ pageParam, signal }) => {
    console.log('quryFn lomus', pageParam)
    return await samson.api.getUniversalProducts({ pageIndex: pageParam }, signal)
  },
  initialPageParam: 0,
  getNextPageParam: (res) => {
    console.log('getNextPageParam', res.meta.pagination.nextPage)
    return res.meta.pagination.nextPage
  },
})
