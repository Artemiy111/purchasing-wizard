import { createFileRoute } from '@tanstack/solid-router'

export const Route = createFileRoute('/search')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/search"!</div>
}
