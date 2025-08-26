import { createRouter } from '@tanstack/solid-router'
import { queryClient } from '~/shared/lib/query-client'
import { routeTree } from './route-tree.gen'

export const router = createRouter({
  routeTree,
  defaultPreload: 'intent',
  scrollRestoration: true,
  context: {
    queryClient,
  },
  defaultPreloadStaleTime: 0,
})

declare module '@tanstack/solid-router' {
  interface Register {
    router: typeof router
  }
}
