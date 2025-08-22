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
    const params = t.GetProductsRequest.from(params_)

    try {
      const res = await $fetch('/elements', { params })
      const validated = t.GetProductsResponse.from(res)
      return validated
    } catch (e) {
      if (e instanceof Error) throw e
      const error = t.GetProductsRequestError.assert(e)
      throw Error(error.message, { cause: error.details })
    }
  },

  getProductsPrices: async (body_: t.GetProductsPricesRequest) => {
    const body = t.GetProductsPricesRequest.from(body_)

    const res = await $fetch('/prices', { method: 'POST', body })
    const validated = t.GetProductsPricesResponse.from(res)

    return validated
  },

  getProductsStocks: async (body_: t.GetProductsStocksRequest) => {
    const body = t.GetProductsStocksRequest.from(body_)

    const res = await $fetch('/stocks', { method: 'POST', body })
    console.log(res)
    const validated = t.GetProductsStocksResponse.from(res)
    console.log(validated)
    return validated
  },
}
