import { createFileRoute } from '@tanstack/solid-router'
import { SamsonPage } from '~/pages/providers'

export const Route = createFileRoute('/samson')({
  component: SamsonPage,
})
