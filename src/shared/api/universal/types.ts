import { type } from 'arktype'

// в рублях с 2 знаками после запятой
export const UniversalPrices = type({
  retail: 'number', // Рознична цена
  partner: 'number | null', // Цена для партнера
})

export type UniversalPrices = typeof UniversalPrices.infer

export const UniversalProduct = type({
  id: 'string',
  provider: '"komus" | "samson"',
  name: 'string',
  description: 'string | null',
  sku: 'string | null',
  barcodes: 'string[]',
  prices: UniversalPrices,
  brand: 'string | null',
  manifacturer: 'string | null',
})

export type UniversalProduct = typeof UniversalProduct.infer
