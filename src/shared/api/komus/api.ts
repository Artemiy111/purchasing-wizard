import { type } from 'arktype'

import { ofetch } from 'ofetch'
import * as t from './types'

const $fetch = ofetch.create({
  // baseURL: 'https://komus-opt.ru/api2',
  baseURL: '/api/komus',
  headers: {
    token: import.meta.env.VITE_KOMUS_API_KEY,
  },
})

export const api = {
  /**
   * @see https://komus-opt.ru/api2/docs/api.html#tag/Tovary/operation/getAllElements
   */
  getProducts: async (params_: t.GetProductsRequest) => {
    const params = t.GetProductsRequest(params_)
    if (params instanceof type.errors) throw params.toTraversalError()

    try {
      const res = await $fetch('/elements', { params })
      const validated = t.GetProductsResponse(res)

      if (validated instanceof type.errors) throw validated
      return validated
    } catch (e) {
      const error = t.GetProductsRequestError(e)
      if (error instanceof type.errors) throw error.toTraversalError()
      throw Error(error.message, { cause: error.details })
    }
  },
}
