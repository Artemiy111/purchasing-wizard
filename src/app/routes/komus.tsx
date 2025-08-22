import { useQuery } from '@tanstack/solid-query'
import { createFileRoute } from '@tanstack/solid-router'
import { ErrorBoundary, For, Suspense } from 'solid-js'
import { komus, UniversalPrices, type UniversalProduct } from '~/shared/api'
import { Button } from '~/shared/ui'

export const Route = createFileRoute('/komus')({
  component: KomusPage,
})

function KomusPage() {
  const query = useQuery(() => ({
    queryKey: ['komus/products'],
    queryFn: async () => {
      const res = await komus.api.getProducts({ limit: 50 })
      console.log('res', res)
      const MAX_COUNT = 250
      const universalProductTemplates = res.data.map((product) =>
        komus.toUniversalProductTemplate(product),
      )

      for (let i = 0; i < res.data.length; i += MAX_COUNT) {
        console.log('i', i)
        const artnumbers = res.data.slice(i, i + MAX_COUNT).map((item) => item.artnumber)
        const pricesRes = await komus.api.getProductsPrices({ artnumbers })
        console.log('prices', pricesRes)

        for (const [, prices] of Object.entries(pricesRes.content)) {
          const idx = res.data.findIndex((product) => product.artnumber === prices.artnumber)
          if (idx !== -1) {
            universalProductTemplates[idx] = komus.toUniversalProduct(
              universalProductTemplates[idx],
              prices,
            )
            // res.data[idx].prices = prices
          }
        }
      }
      return { data: universalProductTemplates as UniversalProduct[], meta: res.meta }
    },
    refetchOnMount: false,
  }))

  return (
    <main>
      <Button variant="ghost" onclick={() => komus.api.getProducts({})}>
        Button
      </Button>

      {String(query.error)}

      <Suspense fallback={<div>Loading...</div>}>
        <For each={query.data?.data.slice(0, 100)}>
          {(item) => <pre>{JSON.stringify(item, null, 2)}</pre>}
        </For>
      </Suspense>
    </main>
  )
}
