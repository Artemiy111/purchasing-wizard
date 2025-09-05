import { create, search, upsert } from '@orama/orama'
import type { UniversalProduct } from '~/shared/api'
import type { SearchingProduct } from '~/shared/types'

export const productsIndex = create({
  schema: {
    id: 'string',
    name: 'string',
    description: 'string',
  },
  language: 'russian',
  sort: {
    enabled: true,
  },
})

export const upsertProductsInIndex = async (products: UniversalProduct[] | undefined) => {
  if (!products) return

  for (let i = 0; i < products.length; i++) {
    const product = products[i]

    await upsert(productsIndex, {
      id: product.id,
      name: product.name,
      description: product.description,
    })

    if (i % 50 === 0) await new Promise((r) => setTimeout(r))
  }
}

export const searchProductsInIndex = async (searchingProduct: SearchingProduct) => {
  return await search(productsIndex, {
    term: searchingProduct.name,
    properties: ['name', 'description'],
    limit: 5,
    boost: {
      name: 2,
    },
  })
}
