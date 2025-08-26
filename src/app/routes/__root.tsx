import type { QueryClient } from '@tanstack/solid-query'
import { createRootRouteWithContext, Link, Outlet } from '@tanstack/solid-router'

export const Route = createRootRouteWithContext<{
  queryClient: QueryClient
}>()({
  component: RootComponent,
})

function RootComponent() {
  return (
    <div>
      <header class="container flex gap-x-4 border-b p-4">
        <Link to="/">Home</Link>
        <Link to="/komus">komus</Link>
        <Link to="/samson">samson</Link>
        <Link to="/search">search</Link>
      </header>
      <Outlet />
    </div>
  )
}
