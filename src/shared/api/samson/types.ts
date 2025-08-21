import { type } from 'arktype'

export const GetProductsRequest = type({
  response_format: '"json" | "xml" = "json"',
  pagination_count: 'number = 10000',
  pagination_page: 'number = 1',
  'sort_type?': '"price" | "date" | "name" | "popularity"',
  photo_size: '"s" | "x" = "x"',
  'brand?': 'string[]',
  category: 'string = ""',
  code: 'string = ""', // разделитель - запятая
})

export type GetProductsRequest = typeof GetProductsRequest.inferIn

export const Product = type({
  sku: 'number.integer', // Код
  name: 'string',
  name_1c: 'string',
  category_list: 'number[]',
  manufacturer: 'string',
  vendor_code: 'string', // артикул
  barcode: 'string',
  brand: 'string',
  description: 'string',
  description_ext: 'string',
  weight: 'string',
  volume: 'string',
  nds: 'number',
  ban_not_multiple: '0 | 1', // Запрет некратного набора
  out_of_stock: '0 | 1', // Вывод из ассортимента:
  remove_date: 'string.date', // Дата распродажи
  expiration_date: 'number.epoch', // Срок годности
  video_list: 'string[]',
  file_list: 'string[]',
  certificate_list: 'string[]',
  manufacturer_code: 'number.integer',
  photo_list: 'string[]',
  price_list: type({
    /**
     * contract - договорная цена
     * infiltration - Рекомендованная розничная цена
     */
    type: '"contract"|"infiltration"',
    value: 'number.integer',
  }).array(),
  // Список остатков
  stock_list: type({
    type: '"idp" | "transit" | "distribution_warehouse" | "total"',
    value: 'number.integer',
  }).array(),
})

export type Product = typeof Product.inferOut

export const GetProductsResponse = type([
  {
    data: Product.array(),
    meta: type({
      previous: 'unknown',
      next: 'unknown',
    }),
  },
])

export type GetProductsResponse = typeof GetProductsResponse.inferOut
