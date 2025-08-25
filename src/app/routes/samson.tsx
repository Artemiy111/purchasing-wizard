import { useInfiniteQuery } from '@tanstack/solid-query'
import { createFileRoute, Link } from '@tanstack/solid-router'
import { createEffect, createMemo, on, Show } from 'solid-js'
import { samsonQueryOptions } from '~/shared/model/products'
import { Button, Loader } from '~/shared/ui'

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

      <div class="flex flex-col gap-y-3 rounded-2xl bg-primary-foreground p-8">
        <div class="flex items-center gap-x-3">
          <span class="font-semibold text-3xl">Самсон</span>
          <Show when={query.isPending || query.isLoading}>
            <Loader />
          </Show>
        </div>
        <ul class="space-y-2">
          <li class="">Страниц {query.data?.pages.length}</li>
          <li>Товаров {totalCount()}</li>
          <li class="">Есть ещё страницы {query.hasNextPage ? 'Да' : 'Нет'}</li>
        </ul>
        <Show when={query.isError}>
          <p class="rounded bg-error px-3 py-2 text-error-foreground">{String(query.error)}</p>
        </Show>
      </div>
    </main>
  )
}
