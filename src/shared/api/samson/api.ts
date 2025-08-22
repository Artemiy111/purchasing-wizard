import { type } from 'arktype'

import { ofetch } from 'ofetch'
import * as t from './types'

const $fetch = ofetch.create({
  // baseURL: 'https://api.samsonopt.ru/v1',
  baseURL: '/api/samson',
  params: {
    api_key: import.meta.env.VITE_SAMSON_API_KEY,
  },
})

export const api = {
  /**
   * @see https://api.samsonopt.ru/v1/doc/index.html#tag/Tovary/paths/~1sku/get
   */
  getProducts: async (params_: t.GetProductsRequest) => {
    const params = t.GetProductsRequest(params_)

    if (params instanceof type.errors) throw params.toTraversalError()

    const res = await $fetch('/sku', { params })
    return res as t.GetProductsResponse
    // const validated = t.GetProductsResponse(res)

    // if (validated instanceof type.errors) throw validated.toTraversalError()
    // return validated
  },
}
