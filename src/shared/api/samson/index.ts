import { api as _api } from './api'
import type * as t from './types'

export namespace samson {
  export type Product = t.Product
  export type GetProductsRequest = t.GetProductsRequest
  export const api = _api
}
