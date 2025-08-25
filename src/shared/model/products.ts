import { infiniteQueryOptions } from '@tanstack/solid-query'
import { komus, samson } from '~/shared/api'
import { db } from '~/shared/lib/db'

export const komusQueryOptions = infiniteQueryOptions({
  queryKey: ['products/komus'],
  queryFn: async ({ pageParam, signal }) => {
    const res = await komus.api.getUniversalProducts({ pageIndex: pageParam }, signal)
    db.products.bulkAdd(res.data)

    return res
  },
  initialPageParam: 0,
  getNextPageParam: (res) => {
    return res.meta.pagination.nextPageIndex
  },
})

export const samsonQueryOptions = infiniteQueryOptions({
  queryKey: ['products/samson'],
  queryFn: async ({ pageParam, signal }) => {
    const res = await samson.api.getUniversalProducts({ pageIndex: pageParam }, signal)
    db.products.bulkAdd(res.data)

    return res
  },
  initialPageParam: 0,
  getNextPageParam: (res) => {
    console.log('getNextPageParam', res.meta.pagination.nextPageIndex)
    return res.meta.pagination.nextPageIndex
  },
})
