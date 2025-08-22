import Dexie, { type EntityTable } from 'dexie'
import type { UniversalProduct } from '../api'

const db = new Dexie('db') as Dexie & {
  products: EntityTable<UniversalProduct, '_id'>
}

db.version(1).stores({
  products: '_id',
})

export const useIdb = () => {
  return {
    db,
  }
}
