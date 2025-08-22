import { type } from 'arktype'
import type { UniversalProduct } from '../universal'

export const GetProductsRequest = type({
  response_format: '"json" | "xml" = "json"',
  pagination_count: 'number.integer <= 10000 = 10000',
  pagination_page: 'number.integer = 1',
  'sort_type?': '"price" | "date" | "name" | "popularity"',
  photo_size: '"s" | "x" = "s"',
  'brand?': 'string[]',
  category: 'string = ""',
  code: 'string = ""', // разделитель - запятая
})

export type GetProductsRequest = typeof GetProductsRequest.inferIn

const MaybeEmptyString = type('string').pipe((s) => (s === '' ? null : s))

const RuDate = type.string
  .pipe((d) => {
    if (d === '') return null
    const [day, month, year] = d.split('.')
    const output = `${year}-${month}-${day}`
    return output
  })
  .to('null | string.date')

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
  brand: type('string').pipe((s) => (s === 'NO NAME' ? null : s)), // Бренд
  description: 'string', // Описание
  description_ext: 'string', // Расширенное описание
  weight: 'number', // Вес
  volume: 'number', // Объем
  nds: 'number',
  ban_not_multiple: type('0 | 1').pipe((v) => Boolean(v)), // Запрет некратного набора
  out_of_stock: type('0 | 1').pipe((v) => Boolean(v)), // Вывод из ассортимента
  remove_date: RuDate, // Дата распродажи
  sale_date: RuDate, // Дата распродажи
  expiration_date: '0 | number.epoch', // Срок годности
  // video_list: 'string[]',
  // file_list: 'string[]',
  // certificate_list: 'string[]',
  // photo_list: 'string[]',
  // package_list: 'Array', // Список размерностей упаковки
  price_list: PriceList,
  stock_list: StockList, // Список остатков
}).onUndeclaredKey('delete')

export type Product = typeof Product.inferOut

export const toUniversalProduct = (product: Product): UniversalProduct => ({
  _id: `samson:${product.sku}`,
  _provider: 'samson',
  name: product.name,
  description: product.description,
  sku: product.sku.toString(),
  barcodes: product.barcode ? [product.barcode] : [],
  prices: product.price_list,
  manifacturer: product.manufacturer,
  brand: product.brand,
})

export const GetProductsResponse = type({
  data: Product.array(),
  meta: {
    pagination: type({
      'previous?': 'string.url',
      'next?': 'string.url',
    }).pipe((p) => ({
      previousUrl: p.previous ?? null,
      nextUrl: p.next ?? null,
    })),
  },
})

export type GetProductsResponse = typeof GetProductsResponse.inferOut
