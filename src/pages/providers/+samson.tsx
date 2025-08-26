import { useInfiniteQuery } from '@tanstack/solid-query'
import { Link } from '@tanstack/solid-router'
import { createEffect, createMemo, on } from 'solid-js'
import { samsonQueryOptions } from '~/shared/model/products'
import { Button, ProviderStatus } from '~/shared/ui'

export function SamsonPage() {
  const query = useInfiniteQuery(() => samsonQueryOptions)

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
      <Button onclick={() => query.fetchNextPage()} variant="ghost">
        Button
      </Button>
      <Link to="/">Home</Link>

      <ProviderStatus
        query={query}
        title="Самсон"
        totalCount={totalCount()}
        totalPages={query.data?.pages.length}
      />
    </main>
  )
}
