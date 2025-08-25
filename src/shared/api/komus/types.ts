import { type } from 'arktype'
import type { UniversalPrices, UniversalProduct } from '../universal'

export const GetProductsPricesRequestParams = type({
  format: '"json" | "xml" = "json"',
})

export const GetProductsPricesRequest = type({
  artnumbers: '1 <= number.integer[] <= 250',
})

export type GetProductsPricesRequest = typeof GetProductsPricesRequest.inferIn

export const ProductPricesRegional = type({
  region: 'number.integer', // Идентификатор региона в Комус-опт
  partnerPrice: 'number', // Цена партнера (с учетом ценовых условий партнера, но без учета доп. скидок) в рублях с округлением до 2-х знаков.
  rrcPrice: 'number', // Рекомендованная розничная цена для розничного магазина в рублях с округлением до 2-х знаков.
  pricePmc: 'number', // Порог минимальной цены для интернет магазина (ПМЦ) в рублях с округлением до 2-х знаков
  modTime: type('string.date | null').pipe((v) => (v === null ? undefined : v)), // Изменение цен в формате full-date full-time "YYYY-MM-DD HH:MM:SS"
})

export type ProductPricesRegional = typeof ProductPricesRegional.infer

export const ProductPriceItem = type({
  artnumber: 'number.integer', // Артикул товара
  nds: 'number',
  prices: ProductPricesRegional.array(),
}).pipe((item) => {
  const { prices: regionalPrices, ...rest } = item
  return { regionalPrices, ...rest }
})

export type ProductPriceItem = typeof ProductPriceItem.infer

export const GetProductsPricesResponse = type({
  content: ProductPriceItem.array().pipe((arr) => {
    const entries = arr.map((item) => [item.artnumber, item])
    console.log('entries', entries)
    const prices = Object.fromEntries(entries) as Record<string, ProductPriceItem>
    return prices
  }),
  'artnumberLost?': 'number.integer[]', // Массив не найденных или не доступных пользователю артикулов
})

export const toUniversalPrices = (price: ProductPriceItem): UniversalPrices => {
  return {
    retail: price.regionalPrices[0]!.rrcPrice,
    partner: price.regionalPrices[0]!.partnerPrice,
  }
}

export type GetProductsPricesResponse = typeof GetProductsPricesResponse.infer

export const GetProductsStocksRequest = type({
  artnumbers: '1 <= number.integer[] <= 250',
})

export type GetProductsStocksRequest = typeof GetProductsStocksRequest.inferIn

export const GetProductsStocksResponse = type({
  content: type({
    artnumber: 'number.integer',
    stock: type({
      region: 'number.integer', // Идентификатор региона в Комус-опт
      quantity: 'number.integer', // Остатки по региону, шт.
    })
      .array()
      .atLeastLength(1),
  })
    .array()
    .atLeastLength(1)
    .pipe((arr) => {
      const entries = arr.map((item) => [item.artnumber, item])
      return Object.fromEntries(entries) as Record<string, (typeof arr)[number]>
    }),
  'artnumberLost?': 'number.integer[]', // Массив не найденных или не доступных пользователю артикулов
})

export type GetProductsStocksResponse = typeof GetProductsStocksResponse.infer

export const GetProductsRequest = type({
  pageIndex: 'number = 0',
  pageSize: '1 <= number <= 1000 = 1000',
})
  .pipe((data) => ({
    page: data.pageIndex + 1,
    limit: data.pageSize,
  }))
  .to({
    format: '"json" | "xml" = "json"',
    limit: '1 <= number <= 1000 = 1000',
    page: 'number = 1',
  })

export const GetProductsRequestError = type({
  status: 'string',
  message: 'string',
  'details?': 'string[]',
})

export type GetProductsRequest = typeof GetProductsRequest.inferIn

export const Product = type({
  artnumber: 'number.integer', // Артикул товара
  categoryId: 'number.integer',
  name: 'string',
  image: type('string').pipe((s) => `https://komus-opt.ru/${s}`),
})

export type Product = typeof Product.inferOut

type UniversalProductTemplate = Omit<UniversalProduct, 'prices'>

export const toUniversalProductTemplate = (product: Product): UniversalProductTemplate => ({
  id: `komus:${product.artnumber}`,
  provider: 'komus',
  name: product.name,
  description: undefined,
  sku: product.artnumber.toString(),
  barcodes: [],
  brand: undefined,
  stock: 0,
  image: product.image,
})

export const toUniversalProduct = (
  productTemplate: UniversalProductTemplate,
  prices: ProductPriceItem,
): UniversalProduct => ({
  ...productTemplate,
  prices: toUniversalPrices(prices),
})

export const GetProductsResponse = type({
  content: Product.array(),
  count: 'number.integer',
  page: 'number.integer',
  prev: 'number.integer | null',
  next: 'number.integer | null',
  pages: 'number.integer',
}).pipe((res) => ({
  data: res.content,
  meta: {
    pagination: {
      totalCount: res.count,
      currentPage: res.page,
      prevPage: res.prev ?? undefined,
      nextPage: res.next ?? undefined,
      totalPages: res.pages,
    },
  },
}))

export type GetProductsResponse = typeof GetProductsResponse.infer
