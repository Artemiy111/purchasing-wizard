import { createRouter } from '@tanstack/solid-router'
import { routeTree } from './route-tree.gen'

export const router = createRouter({
  routeTree,
  // defaultPreload: 'intent',
  // scrollRestoration: true,
  // defaultPreloadStaleTime: 0,
})

declare module '@tanstack/solid-router' {
  interface Register {
    router: typeof router
  }
}
