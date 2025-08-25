import { api as _api } from './api'
import * as t from './types'

export namespace komus {
  export type Product = t.Product
  export const Product = t.Product
  export const toUniversalProductTemplate = t.toUniversalProductTemplate
  export const toUniversalProduct = t.toUniversalProduct
  export const toUniversalPrices = t.toUniversalPrices
  export const api = _api
}
