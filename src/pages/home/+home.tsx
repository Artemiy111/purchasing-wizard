import { createFileRoute, Link } from '@tanstack/solid-router'
import { Charset, Index, IndexedDB, Worker } from 'flexsearch'
import { createMemo, createSignal, For } from 'solid-js'
import { mockProducts } from '~/shared/__mocks__'
import { Button, TextField, TextFieldInput } from '~/shared/ui/kit'

const index = new Index({
  tokenize: 'forward',
  fastupdate: true,
  encoder: Charset.LatinBalance,
  cache: 100,
})

const [products] = createSignal(mockProducts)

for (const item of products()) {
  index.add(item.id, item.name)
}

export function HomePage() {
  const [search, setSearch] = createSignal('')

  const result = createMemo(() => {
    if (!search()) return products()
    const ids = index.search(search(), {
      suggest: true,
      limit: 10,
    })
    const res = ids.map((id) => products().find((item) => item.id === id)!)
    return res
  })

  return (
    <div class="container mx-auto">
      <TextField>
        <TextFieldInput value={search()} onInput={(e) => setSearch(e.currentTarget.value)} />
      </TextField>

      <For each={result()}>{(item) => <div>{item.name}</div>}</For>
    </div>
  )
}
