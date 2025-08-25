import { experimental_createQueryPersister as createQueryPersister } from '@tanstack/query-persist-client-core'
import { QueryClient } from '@tanstack/solid-query'
import * as idb from 'idb-keyval'

const _persister = createQueryPersister({
  storage: {
    getItem: idb.get,
    setItem: idb.set,
    removeItem: idb.del,
    entries: idb.entries,
  },
  maxAge: 1000 * 60 * 5,
})

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
      // persister: persister.persisterFn,
    },
  },
})
