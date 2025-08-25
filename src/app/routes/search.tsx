import {
  create,
  getByID,
  type InternalTypedDocument,
  insert,
  insertMultiple,
  type Result,
  search,
} from '@orama/orama'
import { useInfiniteQuery } from '@tanstack/solid-query'
import { createFileRoute } from '@tanstack/solid-router'
import { createEffect, createMemo, createSignal, For, Suspense } from 'solid-js'
import { samsonQueryOptions } from '~/shared/model/samson'
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

const db = create({
  schema: {
    id: 'string',
    provider: 'string',
    name: 'string',
    description: 'string',
    prices: {
      retail: 'number',
      partner: 'number',
    },
    manifacturer: 'string',
    brand: 'string',
    barcodes: 'string[]',
  },
  language: 'russian',
  sort: {
    enabled: true,
  },
})

// for (const product of mockProducts) {
//   insert(db, {
//     id: product.id,
//     provider: product.provider,
//     name: product.name,
//     description: product.description,
//     prices: {
//       retail: product.prices.retail,
//       partner: product.prices.partner,
//     },
//     manifacturer: product.manifacturer,
//     brand: product.brand,
//     barcodes: product.barcodes,
//   })
// }

function SearchPage() {
  const [searchText, setSearch] = createSignal('')
  const [result, setResult] = createSignal<
    Result<
      InternalTypedDocument<{
        id: string
        provider: string
        name: string
        description: string
        prices: {
          retail: number
          partner: number
        }
        manifacturer: string
        brand: string
        barcodes: string[]
      }>
    >[]
  >([])

  const query = useInfiniteQuery(() => samsonQueryOptions)
  const totalCount = createMemo(
    () => query.data?.pages.reduce((acc, page) => acc + page.data.length, 0) ?? 0,
  )

  const [insertLoading, setInsertLoading] = createSignal(false)
  const insertToIndex = async () => {
    if (!query.data?.pages) return

    setInsertLoading(true)
    const products = query.data.pages.flatMap(({ data }) => data)

    // try {
    //   await insertMultiple(db, products, 50)
    // } catch {}
    for (let i = 0; i < products.length; i++) {
      if (!getByID(db, products[i].id)) await insert(db, products[i])
      if (i % 100 === 0) {
        await new Promise((r) => setTimeout(r))
      }
    }

    setInsertLoading(false)
  }

  createEffect(async () => {
    // if (!searchText()) setResult()
    query.data

    const res = await search(db, {
      term: searchText(),
      properties: ['name', 'description'],
      limit: 20,
    })
    console.log(res)

    setResult(res.hits)
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

      <div class="">{query.isLoading ? 'Loading...' : 'Всего ' + totalCount() + ' товаров'}</div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Id</TableHead>
            <TableHead>Название</TableHead>
            <TableHead>Цена розничная</TableHead>
            <TableHead>Цена партнёрская</TableHead>
            <TableHead>Описание</TableHead>
            <TableHead>Релевантность</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <Suspense>
            <For each={result()}>
              {(item) => (
                <TableRow>
                  <TableHead>{item.document.id}</TableHead>
                  <TableCell>{item.document.name}</TableCell>
                  <TableCell>{item.document.prices.retail}</TableCell>
                  <TableCell>{item.document.prices.partner}</TableCell>
                  <TableCell>{item.document.description}</TableCell>
                  <TableCell>{item.score.toFixed(2)}</TableCell>
                </TableRow>
              )}
            </For>
          </Suspense>
        </TableBody>
      </Table>
    </main>
  )
}
