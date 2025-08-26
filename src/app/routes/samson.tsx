import { createFileRoute } from '@tanstack/solid-router'
import { SamsonPage } from '~/pages/providers'
import { queryClient } from '~/shared/lib/query-client'
import { samsonQueryOptions } from '~/shared/model/products'

export const Route = createFileRoute('/samson')({
  component: SamsonPage,
  loader: () => {
    queryClient.prefetchInfiniteQuery(samsonQueryOptions)
  },
})
