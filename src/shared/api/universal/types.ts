import { type } from 'arktype'

// в рублях с 2 знаками после запятой
export const UniversalPrices = type({
  retail: 'number', // Рознична цена
  partner: 'number | undefined', // Цена для партнера
})

export type UniversalPrices = typeof UniversalPrices.infer

export const UniversalProduct = type({
  id: 'string',
  provider: '"komus" | "samson"',
  name: 'string',
  description: 'string | undefined',
  sku: 'string | undefined',
  barcodes: 'string[]',
  prices: UniversalPrices,
  brand: 'string | undefined',
  manifacturer: 'string | undefined',
})

export type UniversalProduct = typeof UniversalProduct.infer
