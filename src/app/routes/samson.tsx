import { useInfiniteQuery } from '@tanstack/solid-query'
import { createFileRoute, Link } from '@tanstack/solid-router'
import { createEffect, createMemo, on } from 'solid-js'
import { samsonQueryOptions } from '~/shared/model/products'
import { Button, ProviderStatus } from '~/shared/ui'

export const Route = createFileRoute('/samson')({
  component: SamsonPage,
})

function SamsonPage() {
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
      <Button variant="ghost" onclick={() => query.fetchNextPage()}>
        Button
      </Button>
      <Link to="/">Home</Link>

      <ProviderStatus
        title="Самсон"
        query={query}
        totalCount={totalCount()}
        totalPages={query.data?.pages.length}
      />
    </main>
  )
}
