import Dexie, { type EntityTable } from 'dexie'
import type { UniversalProduct } from '~/shared/api'

export const db = new Dexie('db') as Dexie & {
  products: EntityTable<UniversalProduct, 'id'>
}

db.version(1).stores({
  products: 'id',
})
