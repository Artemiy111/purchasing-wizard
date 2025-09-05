import type { UniversalProduct } from '~/shared/api'

export type SearchedProduct = UniversalProduct & { type: 'original' | 'matching-barcodes' }
