import { createFileRoute } from '@tanstack/solid-router'
import { HomePage } from '~/pages/home'

export const Route = createFileRoute('/')({
  component: HomePage,
})
