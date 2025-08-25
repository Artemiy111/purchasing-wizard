import { api as _api } from './api'
import * as t from './types'

export namespace samson {
  export type Product = t.Product
  export type GetProductsRequest = t.GetProductsRequest
  export const toUniversalProduct = t.toUniversalProduct
  export const api = _api
}
