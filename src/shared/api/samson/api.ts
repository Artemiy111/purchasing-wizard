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
  async getUniversalProducts(params: t.GetProductsRequest, signal?: AbortSignal) {
    const res = await this.getProducts(params, signal)
    const products = res.data.map((product) => t.toUniversalProduct(product))
    return { data: products, meta: res.meta }
  },

  /**
   * @see https://api.samsonopt.ru/v1/doc/index.html#tag/Tovary/paths/~1sku/get
   */
  getProducts: async (params_: t.GetProductsRequest, signal?: AbortSignal) => {
    const params = t.GetProductsRequest.from(params_)

    try {
      const res = await $fetch('/sku', { params, signal })
      console.log(res)
      const validated = t.GetProductsResponse.from(res)
      console.log(validated)
      return validated
    } catch (error) {
      console.error('FFF', error)
      throw error
    }
  },
}
