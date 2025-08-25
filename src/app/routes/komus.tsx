import { useInfiniteQuery } from '@tanstack/solid-query'
import { createFileRoute, Link } from '@tanstack/solid-router'
import { RotateCcwIcon } from 'lucide-solid'
import { createEffect, createMemo, For, on } from 'solid-js'
import { komusQueryOptions } from '~/shared/model/products'
import { Button, Loader } from '~/shared/ui'
export const Route = createFileRoute('/komus')({
  component: KomusPage,
})

function KomusPage() {
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
      <Button variant="ghost" onclick={() => query.fetchNextPage()}>
        Button
      </Button>
      <Link to="/">Home</Link>

      <div class="flex flex-col gap-y-3 rounded-2xl bg-primary-foreground p-8">
        <div class="flex items-center gap-x-3">
          <span class="font-semibold text-3xl">Самсон</span>
          {query.isPending || (query.isLoading && <Loader />)}
        </div>
        <ul class="space-y-2">
          <li class="">Страниц {query.data?.pages.length}</li>
          <li>Товаров {totalCount()}</li>
          <li class="">Есть ещё страницы {query.hasNextPage ? 'Да' : 'Нет'}</li>
        </ul>
        <Button class="w-fit" onClick={() => query.refetch()}>
          <RotateCcwIcon />
        </Button>
        {query.isError && (
          <p class="rounded bg-error px-3 py-2 text-error-foreground">{String(query.error)}</p>
        )}
      </div>

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
