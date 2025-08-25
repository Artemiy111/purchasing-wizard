import { create, getByID, insert, search as searchOrama } from '@orama/orama'
import { useMutation, useQuery } from '@tanstack/solid-query'
import { createFileRoute } from '@tanstack/solid-router'
import { createEffect, createSignal, For, Index, Match, on, onMount, Switch } from 'solid-js'
import { mockProductsToSearch } from '~/shared/__mocks__'
import { db } from '~/shared/lib/db'
import {
  Button,
  Loader,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '~/shared/ui'

export const Route = createFileRoute('/search')({
  component: SearchPage,
})

const orama =
  // ? await restore('binary', persistedOrama.data, 'browser')
  create({
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
  const [productsToSearch, setProductsToSearch] = createSignal(mockProductsToSearch)

  const productsQuery = useQuery(() => ({
    queryKey: ['products'],
    queryFn: async () => {
      return await db.products.toArray()
    },
  }))

  const indexProducts = useMutation(() => ({
    mutationKey: ['index', () => productsQuery.data],
    mutationFn: async () => {
      const products = productsQuery.data
      if (!products) return

      // try {
      //   await insertMultiple(db, products, 50)
      // } catch {}

      for (let i = 0; i < products.length; i++) {
        const product = products[i]

        if (!getByID(orama, products[i].id))
          await insert(orama, {
            id: product.id,
            name: product.name,
            description: product.description,
          })
        if (i % 500 === 0) {
          await new Promise((r) => setTimeout(r))
        }
      }
    },
  }))

  const searchProducts = useMutation(() => ({
    mutationKey: ['search'],
    mutationFn: async () => {
      const entities = await Promise.all(
        productsToSearch().map(async (product) => {
          const res = await searchOrama(orama, {
            term: product.name,
            properties: ['name', 'description'],
            limit: 5,
            boost: {
              name: 2,
            },
          })

          const searched = await db.products
            .filter((product) => res.hits.map((item) => item.id).includes(product.id))
            .sortBy('prices.retail')

          return [product.name, searched] as const
        }),
      )

      const res = Object.fromEntries(entities)
      return res
    },
  }))

  onMount(async () => {
    try {
      await productsQuery.refetch()
      await indexProducts.mutateAsync()
      await searchProducts.mutateAsync()
    } catch {}
  })

  createEffect(
    on(
      productsToSearch,
      () => {
        searchProducts.mutate()
      },
      { defer: true },
    ),
  )

  return (
    <main class="container mx-auto grid auto-rows-auto grid-cols-1 gap-y-10 pt-20">
      <div class="flex gap-x-4">
        {/* <TextField class="w-full">
          <TextFieldInput
            value={searchText()}
            onInput={(e) => setSearch(e.currentTarget.value)}
            placeholder="Искать"
          />
        </TextField> */}
        {indexProducts.isPending ? 'Индексируем...' : 'Проиндексировано'}

        <Button disabled={indexProducts.isPending} onClick={() => indexProducts.mutate()}>
          Проиндексировать {indexProducts.isPending && <Loader />}
        </Button>

        <Button disabled={searchProducts.isPending} onClick={() => searchProducts.mutate()}>
          Найти {searchProducts.isPending && <Loader />}
        </Button>
      </div>

      <div class="">
        {productsQuery.isLoading
          ? 'Loading...'
          : 'Всего ' + productsQuery.data!.length + ' товаров'}
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Название</TableHead>
            <TableHead class="w-50">Необходимое кол-во</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <Index each={productsToSearch()}>
            {(item, idx) => (
              <>
                <TableRow class="bg-secondary">
                  <TableCell>
                    <input
                      class="w-full"
                      value={item().name}
                      onChange={(e) =>
                        setProductsToSearch((prev) =>
                          prev.map((item, i) =>
                            i === idx ? { ...item, name: e.currentTarget.value } : item,
                          ),
                        )
                      }
                    />
                  </TableCell>
                  <TableCell>{item().needCount}</TableCell>
                </TableRow>

                <Switch>
                  <Match
                    when={
                      searchProducts.status === 'success' &&
                      searchProducts.data &&
                      searchProducts.data[item().name]?.length === 0
                    }
                  >
                    <TableRow>
                      <TableCell colspan={2}>Ничего не найдено</TableCell>
                    </TableRow>
                  </Match>
                  <Match when={searchProducts.data && searchProducts.data[item().name]?.length > 0}>
                    <TableRow>
                      <TableCell colspan={2}>
                        <Table class="overflow-scroll">
                          <TableHeader>
                            <TableRow>
                              <TableHead class="min-w-25"></TableHead>
                              <TableHead>Поставщик</TableHead>
                              <TableHead class="min-w-40">Название</TableHead>
                              <TableHead class="w-full">Описание</TableHead>
                              <TableHead class="">Артикул</TableHead>
                              <TableHead class="">Штрихкод(ы)</TableHead>
                              <TableHead class="w-max text-nowrap">
                                Цена розничная &nbsp;Р
                              </TableHead>
                              <TableHead class="w-max text-nowrap">
                                Цена партнёрская &nbsp;Р
                              </TableHead>
                              <TableHead class="w-max text-nowrap">На складе</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            <For each={searchProducts.data![item().name]}>
                              {(item) => (
                                <TableRow>
                                  <TableCell>
                                    <img
                                      src={item.image}
                                      alt={item.name}
                                      class="aspect-square w-full object-contain"
                                    />
                                  </TableCell>
                                  <TableCell>{item.provider}</TableCell>
                                  <TableCell>{item.name}</TableCell>
                                  <TableCell>{item.description}</TableCell>
                                  <TableCell>{item.sku}</TableCell>
                                  <TableCell>{item.barcodes.join(', ')}</TableCell>
                                  <TableCell>{item.prices.retail}</TableCell>
                                  <TableCell>{item.prices.partner}</TableCell>
                                  <TableCell>{item.stock}</TableCell>
                                </TableRow>
                              )}
                            </For>
                          </TableBody>
                        </Table>
                      </TableCell>
                    </TableRow>
                  </Match>
                </Switch>
              </>
            )}
          </Index>
        </TableBody>
      </Table>
    </main>
  )
}
