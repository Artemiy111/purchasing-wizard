import { create, insert } from '@orama/orama'
import { useQueryClient } from '@tanstack/solid-query'
import { createFileRoute } from '@tanstack/solid-router'
import { createSignal } from 'solid-js'
import { TextField, TextFieldInput } from '~/shared/ui'
import { mockProducts } from './config'

export const Route = createFileRoute('/search')({
  component: SearchPage,
})

const db = create({
  schema: {
    id: 'string',
    provider: 'enum',
    name: 'string',
    description: 'string',
  },
})

for (const product of mockProducts) {
  insert(db, {
    id: product.id,
    provider: product.provider,
    name: product.name,
    description: product.description,
  })
}

function SearchPage() {
  const [search, setSearch] = createSignal('')
  const queryClient = useQueryClient()

  return (
    <main class="container mx-auto">
      <TextField>
        <TextFieldInput
          value={search()}
          onInput={(e) => setSearch(e.currentTarget.value)}
          placeholder="Искать"
        />
      </TextField>
    </main>
  )
}
