import { createFileRoute } from '@tanstack/solid-router'
import { KomusPage } from '~/pages/providers'

export const Route = createFileRoute('/komus')({
  component: KomusPage,
})
