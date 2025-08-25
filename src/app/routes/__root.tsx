import { createRootRouteWithContext, Link, Outlet } from '@tanstack/solid-router'
import { TanStackRouterDevtools } from '@tanstack/solid-router-devtools'

export const Route = createRootRouteWithContext()({
  component: RootComponent,
})

function RootComponent() {
  return (
    <>
      <div>
        <header class="container flex gap-x-4 border-b p-4">
          <Link to="/">Home</Link>
          <Link to="/komus">komus</Link>
          <Link to="/samson">samson</Link>
        </header>
        <Outlet />
        <TanStackRouterDevtools />
      </div>
    </>
  )
}
