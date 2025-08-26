import { ColorModeProvider, ColorModeScript, createLocalStorageManager } from '@kobalte/core'
import { QueryClientProvider } from '@tanstack/solid-query'
import { SolidQueryDevtools } from '@tanstack/solid-query-devtools'
import { RouterProvider } from '@tanstack/solid-router'
import { TanStackRouterDevtools } from '@tanstack/solid-router-devtools'
import { render } from 'solid-js/web'

import '~/shared/assets/css/main.css'
import { queryClient } from './query-client'
import { router } from './router'

function App() {
  const storageManager = createLocalStorageManager('ui-theme')

  return (
    <>
      <ColorModeScript storageType={storageManager.type} />
      <ColorModeProvider storageManager={storageManager}>
        <QueryClientProvider client={queryClient}>
          <RouterProvider router={router} />
          <TanStackRouterDevtools router={router} />
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
