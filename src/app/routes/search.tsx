import { createFileRoute } from '@tanstack/solid-router'
import { SearchPage } from '~/pages/search'

export const Route = createFileRoute('/search')({
  component: SearchPage,
})
