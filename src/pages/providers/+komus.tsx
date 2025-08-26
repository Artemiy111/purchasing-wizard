import { useInfiniteQuery } from '@tanstack/solid-query'
import { Link } from '@tanstack/solid-router'
import { createEffect, createMemo, on } from 'solid-js'
import { komusQueryOptions } from '~/shared/model/products'
import { Button, ProviderStatus } from '~/shared/ui'

export function KomusPage() {
  const query = useInfiniteQuery(() => komusQueryOptions)

  const totalCount = createMemo(() =>
    query.data === undefined
      ? undefined
      : query.data.pages.reduce((acc, page) => acc + page.data.length, 0),
  )

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
      <Button onClick={() => query.fetchNextPage()} variant="ghost">
        Button
      </Button>
      <Link to="/">Home</Link>

      <ProviderStatus
        query={query}
        title="Комус"
        totalCount={totalCount()}
        totalPages={query.data?.pages.length}
      />

      <ul>
        <For each={query.data?.pages}>
          {(page) => (
            <For each={page.data}>
              {(product) => (
                <li>
                  <pre>{JSON.stringify(product, null, 2)}</pre>
                </li>
              )}
            </For>
          )}
        </For>
      </ul>
    </main>
  )
}
