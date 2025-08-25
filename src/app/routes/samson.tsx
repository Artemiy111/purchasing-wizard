import { useInfiniteQuery } from '@tanstack/solid-query'
import { createFileRoute, Link } from '@tanstack/solid-router'
import { createEffect, For, on, Suspense } from 'solid-js'
import { samsonQueryOptions } from '~/shared/model/samson'
import { Button } from '~/shared/ui'

export const Route = createFileRoute('/samson')({
  component: SamsonPage,
})

function SamsonPage() {
  const query = useInfiniteQuery(() => samsonQueryOptions)

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
      <Link to="/">Home</Link>

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
