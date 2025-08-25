import { ColorModeProvider, ColorModeScript, createLocalStorageManager } from '@kobalte/core'
import { QueryClientProvider } from '@tanstack/solid-query'
import { SolidQueryDevtools } from '@tanstack/solid-query-devtools'
import { createRouter, RouterProvider } from '@tanstack/solid-router'
import { render } from 'solid-js/web'

import { routeTree } from '~/routeTree.gen'
import '~/shared/assets/css/main.css'
import { queryClient } from './query-client'

const router = createRouter({
  routeTree,
  defaultPreload: 'intent',
  scrollRestoration: true,
  defaultPreloadStaleTime: 0,
})

declare module '@tanstack/solid-router' {
  interface Register {
    router: typeof router
  }
}

function App() {
  const storageManager = createLocalStorageManager('ui-theme')

  return (
    <>
      <ColorModeScript storageType={storageManager.type} />
      <ColorModeProvider storageManager={storageManager}>
        <QueryClientProvider client={queryClient}>
          <RouterProvider router={router} />
          <SolidQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
      </ColorModeProvider>
    </>
  )
}

const root = document.getElementById('root')
if (root) {
  render(() => <App />, root)
}
