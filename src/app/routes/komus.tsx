import { useQuery } from '@tanstack/solid-query'
import { createFileRoute } from '@tanstack/solid-router'
import { For, Suspense } from 'solid-js'
import { komus } from '~/shared/api'
import { Button } from '~/shared/ui'

export const Route = createFileRoute('/komus')({
  component: KomusPage,
})

function KomusPage() {
  const query = useQuery(() => ({
    queryKey: ['komus/products'],
    queryFn: () => komus.api.getProducts({}),
    refetchOnMount: false,
  }))

  return (
    <main>
      <Button variant="ghost" onclick={() => komus.api.getProducts({})}>
        Button
      </Button>

      <Suspense fallback={<div>Loading...</div>}>
        <For each={query.data?.data.slice(0, 100)}>
          {(item) => <pre>{JSON.stringify(item, null, 2)}</pre>}
        </For>
      </Suspense>
    </main>
  )
}
