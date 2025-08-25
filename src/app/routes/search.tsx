import {
  create,
  getByID,
  type InternalTypedDocument,
  insert,
  insertMultiple,
  type Result,
  search,
} from '@orama/orama'
import { useInfiniteQuery, useQuery } from '@tanstack/solid-query'
import { createFileRoute } from '@tanstack/solid-router'
import { createEffect, createMemo, createSignal, For, Suspense } from 'solid-js'
import type { UniversalProduct } from '~/shared/api'
import { db } from '~/shared/lib/db'
import { samsonQueryOptions } from '~/shared/model/products'
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TextField,
  TextFieldInput,
} from '~/shared/ui'

export const Route = createFileRoute('/search')({
  component: SearchPage,
})

const orama = create({
  schema: {
    id: 'string',
    // provider: 'string',
    name: 'string',
    description: 'string',
    // prices: {
    //   retail: 'number',
    //   partner: 'number',
    // },
    // brand: 'string',
    // barcodes: 'string[]',
  },
  language: 'russian',
  sort: {
    enabled: true,
  },
})

function SearchPage() {
  const [searchText, setSearch] = createSignal('')
  const [result, setResult] = createSignal<UniversalProduct[]>([])

  const query = useQuery(() => ({
    queryKey: ['products'],
    queryFn: async () => {
      return await db.products.toArray()
    },
  }))

  const [insertLoading, setInsertLoading] = createSignal(false)
  const insertToIndex = async () => {
    const products = query.data
    if (!products) return

    setInsertLoading(true)

    // try {
    //   await insertMultiple(db, products, 50)
    // } catch {}

    for (let i = 0; i < products.length; i++) {
      if (!getByID(orama, products[i].id)) await insert(orama, products[i])
      if (i % 100 === 0) {
        await new Promise((r) => setTimeout(r))
      }
    }

    setInsertLoading(false)
  }

  createEffect(async () => {
    // if (!searchText()) setResult()
    query.data

    const res = await search(orama, {
      term: searchText(),
      properties: ['name', 'description'],
      limit: 20,
    })
    console.log(res)

    const searched = await db.products
      .filter((product) => res.hits.map((item) => item.id).includes(product.id))
      .toArray()

    setResult(searched)
  })

  return (
    <main class="container mx-auto grid auto-rows-auto grid-cols-1 gap-y-10 pt-20">
      <div class="flex gap-x-4">
        <TextField class="w-full">
          <TextFieldInput
            value={searchText()}
            onInput={(e) => setSearch(e.currentTarget.value)}
            placeholder="Искать"
          />
        </TextField>
        {insertLoading()}
        <Button disabled={insertLoading()} onClick={insertToIndex}>
          Проиндексировать {insertLoading() ? '...' : '🚀'}
        </Button>
      </div>

      <div class="">
        {query.isLoading ? 'Loading...' : 'Всего ' + query.data!.length + ' товаров'}
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Id</TableHead>
            <TableHead>Название</TableHead>
            <TableHead>Цена розничная</TableHead>
            <TableHead>Цена партнёрская</TableHead>
            <TableHead>Описание</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <Suspense>
            <For each={result()}>
              {(item) => (
                <TableRow>
                  <TableHead>{item.id}</TableHead>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>{item.prices.retail}</TableCell>
                  <TableCell>{item.prices.partner}</TableCell>
                  <TableCell>{item.description}</TableCell>
                </TableRow>
              )}
            </For>
          </Suspense>
        </TableBody>
      </Table>
    </main>
  )
}
