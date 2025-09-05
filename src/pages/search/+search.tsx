import { queryOptions, useMutation, useQuery } from '@tanstack/solid-query'
import {
  type Accessor,
  createEffect,
  createMemo,
  createSignal,
  For,
  Index,
  Match,
  on,
  Switch,
} from 'solid-js'
import { unwrap } from 'solid-js/store'
import { mockSearchingProducts } from '~/shared/__mocks__'
import type { UniversalProduct, UniversalProvider } from '~/shared/api'
import {
  cn,
  db,
  PROVIDERS_LABELS,
  searchProductsInIndex,
  upsertProductsInIndex,
} from '~/shared/lib'
import type { SearchedProduct, SearchingProduct } from '~/shared/types'
import {
  Badge,
  Button,
  Loader,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '~/shared/ui'

type Barcode = string
type SearchingProductName = string

const getAllMatchingProductsByBarcodes = (products: UniversalProduct[]) => {
  const record: Partial<Record<Barcode, UniversalProduct[]>> = {}

  for (const product of products) {
    for (const barcode of product.barcodes) {
      if (!record[barcode]) {
        record[barcode] = []
      }
      record[barcode].push(product)
    }
  }

  for (const barcode in record) {
    if (record[barcode]!.length === 1) {
      delete record[barcode]
    }
  }
  return record
}

const useIndexProducts = (products: Accessor<UniversalProduct[] | undefined>) => {
  return useMutation(() => ({
    mutationKey: ['index', products],
    mutationFn: () => upsertProductsInIndex(products()),
  }))
}

const searchProductsWithMatchingBarcodes = (
  searchedProducts: UniversalProduct[],
  allMatchingProductsByBarcodes: Partial<Record<Barcode, UniversalProduct[]>>,
) => {
  return searchedProducts.flatMap((searchedProduct) => {
    const result: SearchedProduct[] = [{ ...searchedProduct, type: 'original' }]

    for (const barcode of searchedProduct.barcodes) {
      const matchingProducts = allMatchingProductsByBarcodes[barcode] ?? []

      for (const matchedProduct of matchingProducts) {
        if (
          matchedProduct.id !== searchedProduct.id &&
          !result.find((item) => item.id === matchedProduct.id)
        ) {
          const matched = { ...matchedProduct, type: 'matching-barcodes' as const }
          result.push(matched)
        }
      }
    }

    return result
  })
}

const searchProducts = async (
  searchingProducts: SearchingProduct[],
  allMatchingProductsByBarcodes: Partial<Record<Barcode, UniversalProduct[]>>,
) => {
  const promises = searchingProducts.map(async (searchingProduct, idx) => {
    const searchedIndex = await searchProductsInIndex(searchingProduct)
    console.log('searchedIndex', searchedIndex.hits)

    const searchedProducts = await db.products
      .filter((product) => searchedIndex.hits.map((item) => item.id).includes(product.id))
      .sortBy('prices.retail')

    const searchedProductsWithMatchingBarcodes = searchProductsWithMatchingBarcodes(
      searchedProducts,
      allMatchingProductsByBarcodes,
    )

    searchedProductsWithMatchingBarcodes.sort((a, b) => {
      const aGroupByCount = a.stock >= searchingProduct.needCount ? 1 : 0
      const bGroupByCount = b.stock >= searchingProduct.needCount ? 1 : 0

      if (aGroupByCount !== bGroupByCount) {
        return bGroupByCount - aGroupByCount
      }

      const aGroupByType = a.type === 'original' ? 1 : 0
      const bGroupByType = b.type === 'original' ? 1 : 0

      if (aGroupByType !== bGroupByType) {
        return bGroupByType - aGroupByType
      }

      return a.prices.retail - b.prices.retail
    })

    return [searchingProduct.name, searchedProductsWithMatchingBarcodes] as const
  })

  const entities = await Promise.all(promises)

  const res = Object.fromEntries(entities)
  return res satisfies Record<SearchingProductName, SearchedProduct[]>
}

const searchedProductsQueryOptions = (
  searchingProducts: SearchingProduct[],
  allMatchingProductsByBarcodes: Partial<Record<Barcode, UniversalProduct[]>>,
) => {
  return queryOptions({
    queryKey: [
      'search',
      {
        searchingProducts,
        allMatchingProductsByBarcodes,
      },
    ] as const,
    queryFn: async () => {
      await new Promise((res) => setTimeout(res, 0))

      const res = await searchProducts(searchingProducts, allMatchingProductsByBarcodes)
      console.log('res', unwrap(res))
      // const toDb = Object.entries(res).map(([key, value]) => ({
      //   name: key,
      //   searchedProducts: value,
      // }))
      // db.searched.bulkPut(toDb)

      return res
    },
    // initialData: () =>
    //  await  db.searched
    //     .toArray()
    //     .then((arr) => arr.map((item) => ({ [item.name]: item.searchedProducts }))),
    placeholderData: (old) => old,
    enabled: false,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  })
}

export function SearchPage() {
  const [searchingProducts, setSearchingProducts] = createSignal(mockSearchingProducts)

  // const products = createLiveQuery(() => db.products.toArray())

  // const productsLiveQuery = liveQuery(() => db.products.toArray())

  // productsLiveQuery.subscribe((products) => {
  //   queryClient.setQueryData(['products'], products)
  // })

  const productsQuery = useQuery(() => ({
    queryKey: ['products'],
    queryFn: async () => {
      // return []
      return await db.products.toArray()
    },
  }))

  const allMatchingBarcodes = createMemo(() =>
    productsQuery.data
      ? getAllMatchingProductsByBarcodes(productsQuery.data)
      : ({} as Record<Barcode, UniversalProduct[]>),
  )

  const indexProducts = useIndexProducts(() => productsQuery.data)
  const searchedProductsQuery = useQuery(() =>
    searchedProductsQueryOptions(searchingProducts(), allMatchingBarcodes()),
  )

  createEffect(
    on(
      () => productsQuery.isSuccess,
      async () => {
        await indexProducts.mutateAsync(undefined)
        await searchedProductsQuery.refetch()
      },
    ),
  )

  return (
    <main class="container mx-auto grid auto-rows-auto grid-cols-1 gap-y-10 pt-20">
      <div class="flex items-center gap-x-4">
        <Button disabled={indexProducts.isPending} onClick={() => indexProducts.mutate()}>
          Проиндексировать {indexProducts.isPending && <Loader />}
        </Button>

        <Button
          disabled={!indexProducts.isSuccess || searchedProductsQuery.isFetching}
          onClick={() => searchedProductsQuery.refetch()}
        >
          Найти {searchedProductsQuery.isFetching && <Loader />}
        </Button>

        {indexProducts.isSuccess && <p>Проиндексировано</p>}
      </div>

      <div class="">
        {productsQuery.isLoading
          ? 'Loading...'
          : 'Всего ' + productsQuery.data!.length + ' товаров'}
      </div>

      <Table class="">
        <TableHeader>
          <TableRow>
            <TableHead class="w-10">№</TableHead>
            <TableHead class="w-full">Название</TableHead>
            <TableHead class="min-w-25 text-nowrap">Нужно шт.</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <Index each={searchingProducts()}>
            {(searchingProduct, idx) => (
              <>
                <TableRow class="sticky top-0 z-1 bg-secondary hover:bg-[reset]">
                  <TableCell>{idx + 1}</TableCell>
                  <TableCell>
                    <input
                      class="w-full"
                      onChange={(e) =>
                        setSearchingProducts((prev) =>
                          prev.map((item, i) =>
                            i === idx ? { ...item, name: e.currentTarget.value } : item,
                          ),
                        )
                      }
                      value={searchingProduct().name}
                    />
                  </TableCell>
                  <TableCell>{searchingProduct().needCount}</TableCell>
                </TableRow>

                <Switch>
                  <Match
                    when={
                      searchedProductsQuery.isSuccess &&
                      searchedProductsQuery.data[searchingProduct().name]?.length === 0
                    }
                  >
                    <TableRow>
                      <TableCell colspan={2}>Ничего не найдено</TableCell>
                    </TableRow>
                  </Match>

                  <Match
                    when={
                      searchedProductsQuery.isSuccess &&
                      searchedProductsQuery.data[searchingProduct().name]?.length > 0
                    }
                  >
                    <TableRow class="hover:bg-[reset]">
                      <TableCell class="p-0" colspan={3}>
                        <SearchTable
                          searchedProducts={searchedProductsQuery.data!}
                          searchingProduct={searchingProduct()}
                        />
                      </TableCell>
                    </TableRow>

                    <TableRow class="hover:bg-[reset]">
                      <TableCell class="p-0" colspan={3}></TableCell>
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

const SearchTable = (props: {
  searchingProduct: SearchingProduct
  searchedProducts: Record<SearchingProductName, SearchedProduct[]>
}) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead class="min-w-25"></TableHead>
          <TableHead class="min-w-60">Название</TableHead>
          <TableHead class="w-full">Описание</TableHead>
          <TableHead>Поставщик</TableHead>
          <TableHead>Артикул</TableHead>
          <TableHead class="min-w-25">Штрихкоды</TableHead>
          <TableHead class="w-max text-nowrap">Розничная &nbsp;₽</TableHead>
          <TableHead class="w-max text-nowrap">Партнёрская &nbsp;₽</TableHead>
          <TableHead class="min-w-25 text-nowrap">На складе</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <Index each={props.searchedProducts[props.searchingProduct.name]}>
          {(searched) => (
            <TableRow
              class={cn(
                searched().stock < props.searchingProduct.needCount &&
                  'bg-error hover:bg-[reset] dark:bg-[color-mix(in_oklab,var(--color-error)_20%,var(--color-background))]',
                searched().type === 'matching-barcodes' && 'text-violet-200',
              )}
            >
              <TableCell>
                <img
                  alt={searched.name}
                  class="aspect-square w-full rounded-lg object-contain"
                  src={searched().image}
                />
              </TableCell>
              <TableCell>
                <p>{searched().name}</p>
              </TableCell>
              <TableCell>
                <p class="line-clamp-3 text-ellipsis">{searched().description}</p>
              </TableCell>
              <TableCell>
                <Badge variant={searched().provider === 'komus' ? 'secondary' : 'outline'}>
                  {PROVIDERS_LABELS[searched().provider]}
                </Badge>
              </TableCell>
              <TableCell class="font-mono">{searched().sku}</TableCell>
              <TableCell>
                <p class="line-clamp-3 w-[13ch] font-mono">{searched().barcodes.join(', ')}</p>
              </TableCell>
              <TableCell>{searched().prices.retail}</TableCell>
              <TableCell>{searched().prices.partner}</TableCell>
              <TableCell>{searched().stock}</TableCell>
            </TableRow>
          )}
        </Index>
      </TableBody>
    </Table>
  )
}
