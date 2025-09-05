import Dexie, { type EntityTable, liveQuery } from 'dexie'
import { from } from 'solid-js'
import type { UniversalProduct } from '~/shared/api'
import type { SearchedProduct } from '../types'

const db = new Dexie('db') as Dexie & {
  products: EntityTable<UniversalProduct, 'id'>
  searched: EntityTable<{ name: string; searchedProducts: SearchedProduct[] }, 'name'>
  orama: EntityTable<{ data: string | Buffer<ArrayBufferLike> }, 'data'>
}

db.version(1).stores({
  products: 'id',
})

export { db }

export const createLiveQuery = <T>(queuer: () => T | Promise<T>) => from(liveQuery(queuer))
