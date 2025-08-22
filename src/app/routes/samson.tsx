import { useInfiniteQuery, useQuery } from '@tanstack/solid-query'
import { createFileRoute } from '@tanstack/solid-router'
import { createEffect, For, on, Suspense } from 'solid-js'
import { samson } from '~/shared/api'
import { Button } from '~/shared/ui'

export const Route = createFileRoute('/samson')({
  component: SamsonPage,
})

function SamsonPage() {
  const query = useInfiniteQuery(() => ({
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
  }))

  createEffect(
    on(
      () => query.dataUpdatedAt,
      () => {
        if (query.hasNextPage) {
          query.fetchNextPage()
        }
      },
      { defer: true },
    ),
  )

  return (
    <main>
      <Button variant="ghost" onclick={() => query.fetchNextPage()}>
        Button
      </Button>

      <pre>{String(query.error)}</pre>

      <Suspense fallback={<div>Loading...</div>}>
        <For each={query.data?.pages}>
          {(page) => (
            <>
              <For each={page.data}>{(product) => <div>{product.name}</div>}</For>
            </>
          )}
        </For>
      </Suspense>
    </main>
  )
}
