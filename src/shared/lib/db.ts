import Dexie, { type EntityTable } from 'dexie'
import type { UniversalProduct } from '~/shared/api'

export const db = new Dexie('db') as Dexie & {
  products: EntityTable<UniversalProduct, 'id'>
  orama: EntityTable<{ data: string | Buffer<ArrayBufferLike> }, 'data'>
}

db.version(1).stores({
  products: 'id',
})
