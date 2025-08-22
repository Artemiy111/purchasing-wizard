import { useQuery } from '@tanstack/solid-query'
import { createFileRoute } from '@tanstack/solid-router'
import { For, Suspense } from 'solid-js'
import { samson } from '~/shared/api'
import { Button } from '~/shared/ui'

export const Route = createFileRoute('/samson')({
  component: SamsonPage,
})

function SamsonPage() {
  const query = useQuery(() => ({
    queryKey: ['samson/products'],
    queryFn: async () => {
      const res = await samson.api.getProducts({})
      const universalProducts = res.data.map((p) => samson.toUniversalProduct(p))

      return { data: universalProducts, meta: res.meta }
    },
    refetchOnMount: false,
  }))

  return (
    <main>
      <Button variant="ghost" onclick={() => query.refetch()}>
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
