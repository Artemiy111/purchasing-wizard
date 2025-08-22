import { type } from 'arktype'

export const GetProductsRequest = type({
  format: '"json" | "xml" = "json"',
  limit: '1 <= number <= 1000 = 50',
  page: 'number = 1',
})

export const GetProductsRequestError = type({
  status: 'string',
  message: 'string',
  'details?': 'string[]',
})

export type GetProductsRequest = typeof GetProductsRequest.inferIn

export const Product = type({
  artnumber: 'number.integer', // Артикул товара
  categoryId: 'number.integer',
  name: 'string',
  image: 'string',
})

export type Product = typeof Product.inferOut

export const GetProductsResponse = type({
  content: Product.array(),
  count: 'number.integer',
  page: 'number.integer',
  prev: 'number.integer | null',
  next: 'number.integer | null',
  pages: 'number.integer',
}).pipe((res) => ({
  data: res.content,
  meta: {
    pagination: {
      totalCount: res.count,
      currentPage: res.page,
      prevPage: res.prev,
      nextPage: res.next,
      totalPages: res.pages,
    },
  },
}))
