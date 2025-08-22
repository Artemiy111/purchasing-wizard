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

const MaybeEmptyString = type('string').pipe((s) => (s === '' ? null : s))

const RuDate = type.string
  .pipe((d) => {
    if (d === '') return null
    const [day, month, year] = d.split('.')
    const output = `${year}-${month}-${day}`
    return output
  })
  .to('null | string.date')

export const Product = type({
  sku: 'number.integer', // Код
  name: 'string', // Наименование продукта
  // name_1c: 'string', // Наименование продукта в 1С
  category_list: 'number[]', // Список категорий
  manufacturer: 'string', // Производитель
  vendor_code: 'string', // Артикул
  barcode: MaybeEmptyString, // Штрихкод
  brand: 'string', // Бренд
  description: 'string', // Описание
  description_ext: 'string', // Расширенное описание
  weight: 'number', // Вес
  volume: 'number', // Объем
  nds: 'number',
  ban_not_multiple: '0 | 1', // Запрет некратного набора
  out_of_stock: '0 | 1', // Вывод из ассортимента:
  remove_date: RuDate, // Дата распродажи
  sale_date: RuDate, // Дата распродажи
  expiration_date: '0 | number.epoch', // Срок годности
  // video_list: 'string[]',
  // file_list: 'string[]',
  // certificate_list: 'string[]',
  // photo_list: 'string[]',
  // package_list: 'Array', // Список размерностей упаковки
  price_list: type({
    /**
     * contract - договорная цена
     * infiltration - Рекомендованная розничная цена
     */
    type: '"contract" | "infiltration"',
    value: 'number',
  }).array(),
  // Список остатков
  stock_list: type({
    type: '"idp" | "transit" | "distribution_warehouse" | "total"',
    value: 'number',
  }).array(),
}).onUndeclaredKey('delete')

export type Product = typeof Product.inferOut

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
