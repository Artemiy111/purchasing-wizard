import { api as _api } from './api'
import * as t from './types'

export namespace komus {
  export type Product = t.Product
  export const Product = t.Product
  export const api = _api
}
