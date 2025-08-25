import { ofetch } from 'ofetch'
import type { UniversalProduct } from '../universal'
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
  async getUniversalProducts(params: t.GetProductsRequest, signal?: AbortSignal) {
    const res = await this.getProducts(params, signal)
    console.log('res', res)
    const MAX_COUNT = 250
    const products = res.data.map((product) => t.toUniversalProductTemplate(product))

    for (let i = 0; i < res.data.length; i += MAX_COUNT) {
      const artnumbers = res.data.slice(i, i + MAX_COUNT).map((item) => item.artnumber)

      const pricesRes = await this.getProductsPrices({ artnumbers }, signal)
      const stocksRes = await this.getProductsStock({ artnumbers }, signal)

      for (const [, prices] of Object.entries(pricesRes.content)) {
        const idx = res.data.findIndex((product) => product.artnumber === prices.artnumber)
        if (idx !== -1) {
          products[idx] = t.toUniversalProduct(products[idx], prices)
        }
      }

      for (const [, stocks] of Object.entries(stocksRes.content)) {
        const idx = res.data.findIndex((product) => product.artnumber === stocks.artnumber)
        if (idx !== -1) {
          products[idx].stock = stocks.stock[0]!.quantity
        }
      }
    }

    return {
      data: products as UniversalProduct[],
      meta: res.meta,
    }
  },

  getProducts: async (params_: t.GetProductsRequest, signal?: AbortSignal) => {
    const params = t.GetProductsRequest.from(params_)

    try {
      const res = await $fetch('/elements', { params, signal })
      const validated = t.GetProductsResponse.from(res)
      return validated
    } catch (e) {
      if (e instanceof Error) throw e
      const error = t.GetProductsRequestError.assert(e)
      throw Error(error.message, { cause: error.details })
    }
  },

  getProductsPrices: async (body_: t.GetProductsPricesRequest, signal?: AbortSignal) => {
    const body = t.GetProductsPricesRequest.from(body_)

    const res = await $fetch('/prices', { method: 'POST', body, signal })
    const validated = t.GetProductsPricesResponse.from(res)

    return validated
  },

  getProductsStock: async (body_: t.GetProductsStocksRequest, signal?: AbortSignal) => {
    const body = t.GetProductsStocksRequest.from(body_)

    const res = await $fetch('/stock', { method: 'POST', body, signal })
    console.log('stock', res)
    const validated = t.GetProductsStocksResponse.from(res)
    console.log(validated)
    return validated
  },
}
