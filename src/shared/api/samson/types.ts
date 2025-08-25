import { type } from 'arktype'
import type { UniversalProduct } from '../universal'

export const GetProductsRequest = type({
  pageIndex: 'number = 0',
  pageSize: 'number.integer <= 10000 = 10000',
})
  .pipe((data) => {
    const { pageIndex, pageSize, ...rest } = data
    return {
      pagination_page: pageIndex + 1,
      pagination_count: pageSize,
      ...rest,
    }
  })
  .to({
    response_format: '"json" | "xml" = "json"',
    pagination_count: 'number.integer',
    pagination_page: 'number.integer',
    'sort_type?': '"price" | "date" | "name" | "popularity"',
    photo_size: '"s" | "x" = "s"',
    'brand?': 'string[]',
    category: 'string = ""',
    code: 'string = ""', // разделитель - запятая
  })

export type GetProductsRequest = typeof GetProductsRequest.inferIn

const MaybeEmptyString = type('string').pipe((s) => (s === '' ? undefined : s))

const RuDate = type.string
  .pipe((d) => {
    if (d === '') return undefined
    const [day, month, year] = d.split('.')
    const output = `${year}-${month}-${day}`
    return output
  })
  .to('string.date | undefined')

const PriceList = type({
  /**
   * contract - договорная цена
   * infiltration - Рекомендованная розничная цена
   */
  type: '"contract" | "infiltration"',
  value: 'number',
})
  .array()
  .pipe((arr) => {
    const entries = arr.map((price) => [price.type, price.value])
    return Object.fromEntries(entries)
  })
  .to({
    contract: 'number',
    infiltration: 'number',
  })
  .pipe((prices) => ({
    retail: prices.infiltration,
    partner: prices.contract,
  }))

const StockList = type({
  /**
   * idp - остаток в филиале
   * transit - количество в пути
   * distribution_warehouse - остатки на РЦ
   * total - сумма остатков
   */
  type: '"idp" | "transit" | "distribution_warehouse" | "total"',
  value: 'number',
})
  .array()
  .pipe((arr) => {
    const entries = arr.map((stock) => [stock.type, stock.value])
    return Object.fromEntries(entries)
  })
  .to({
    idp: 'number',
    transit: 'number',
    distribution_warehouse: 'number',
    total: 'number',
  })

export const Product = type({
  sku: '100000 <= number.integer <= 999999', // Код
  name: 'string', // Наименование продукта
  // name_1c: 'string', // Наименование продукта в 1С
  category_list: 'number[]', // Список категорий
  manufacturer: 'string', // Производитель
  vendor_code: 'string', // Артикул
  barcode: MaybeEmptyString, // Штрихкод
  brand: type('string').pipe((s) => (s === 'NO NAME' ? undefined : s)), // Бренд
  description: 'string', // Описание
  description_ext: 'string', // Расширенное описание
  weight: 'number', // Вес
  volume: 'number', // Объем
  nds: 'number',
  ban_not_multiple: type('0 | 1').pipe((v) => Boolean(v)), // Запрет некратного набора
  out_of_stock: type('0 | 1').pipe((v) => Boolean(v)), // Вывод из ассортимента
  remove_date: RuDate, // Дата распродажи
  sale_date: RuDate, // Дата распродажи
  expiration_date: type('number.epoch').pipe((v) => (v === 0 ? undefined : v)), // Срок годности
  // video_list: 'string[]',
  // file_list: 'string[]',
  // certificate_list: 'string[]',
  photo_list: 'string[]',
  // package_list: 'Array', // Список размерностей упаковки
  price_list: PriceList,
  stock_list: StockList, // Список остатков
}).onUndeclaredKey('delete')

export type Product = typeof Product.inferOut

export const toUniversalProduct = (product: Product): UniversalProduct => ({
  id: `samson:${product.sku}`,
  provider: 'samson',
  name: product.name,
  description: product.description,
  sku: product.sku.toString(),
  barcodes: product.barcode ? [product.barcode] : [],
  prices: product.price_list,
  brand: product.brand,
  stock: product.stock_list.idp, // ? точно ли
  image: product.photo_list[0],
})

const getPaginationPageIndex = (url: string) => {
  const params = new URLSearchParams(new URL(url).search)
  const param = 'pagination_page'
  const page = params.has(param) ? parseInt(params.get(param)!, 10) : undefined
  const index = page === undefined ? undefined : page - 1
  return index
}

export const GetProductsResponse = type({
  data: Product.array(),
  meta: {
    pagination: type({
      'previous?': 'string.url',
      'next?': 'string.url',
    }).pipe((p) => ({
      prevPageIndex: p.previous ? getPaginationPageIndex(p.previous) : undefined,
      nextPageIndex: p.next ? getPaginationPageIndex(p.next) : undefined,
    })),
  },
})

export type GetProductsResponse = typeof GetProductsResponse.inferOut
