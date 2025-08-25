import { useQuery } from '@tanstack/solid-query'
import { createFileRoute, Link } from '@tanstack/solid-router'
import { For, Suspense } from 'solid-js'
import { komus } from '~/shared/api'
import { db } from '~/shared/lib/db'
import { Button } from '~/shared/ui'

export const Route = createFileRoute('/komus')({
  component: KomusPage,
})

function KomusPage() {
  const query = useQuery(() => ({
    queryKey: ['komus/products'],
    queryFn: async ({ signal }) => {
      const res = await komus.api.getUniversalProducts({}, signal)
      db.products.bulkAdd(res.data)
      return res
    },
  }))

  return (
    <main>
      <Button variant="ghost" onclick={() => komus.api.getProducts({})}>
        Button
      </Button>
      <Link to="/">Home</Link>

      <div>{String(query.error)}</div>

      <Suspense fallback={<div>Loading...</div>}>
        <For each={query.data?.data.slice(0, 100)}>
          {(item) => <pre>{JSON.stringify(item, null, 2)}</pre>}
        </For>
      </Suspense>
    </main>
  )
}
