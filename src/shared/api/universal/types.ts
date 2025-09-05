import { type } from 'arktype'

// в рублях с 2 знаками после запятой
export const UniversalPrices = type({
  retail: 'number', // Рознична цена
  partner: 'number | undefined', // Цена для партнера
})

export type UniversalPrices = typeof UniversalPrices.infer

export const UniversalProvider = type('"komus" | "samson"')

export type UniversalProvider = typeof UniversalProvider.infer

export const UniversalProduct = type({
  id: 'string',
  provider: UniversalProvider,
  name: 'string',
  description: 'string | undefined',
  sku: 'string',
  barcodes: 'string[]',
  prices: UniversalPrices,
  brand: 'string | undefined',
  stock: 'number.integer',
  image: 'string | undefined',
})

// export const universalStock = type({
// total: 'number.integer',

export type UniversalProduct = typeof UniversalProduct.infer
