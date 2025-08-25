import { createFileRoute, Link } from '@tanstack/solid-router'
import { Charset, Index, IndexedDB, Worker } from 'flexsearch'
import { createMemo, createSignal, For } from 'solid-js'
import { mockProducts } from '~/shared/__mocks__'
import { Button, TextField, TextFieldInput } from '~/shared/ui/kit'

export const Route = createFileRoute('/')({
  component: HomePage,
})

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

function HomePage() {
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
    <div class="text-center">
      <header class="flex min-h-screen flex-col items-center bg-[#282c34] pt-20 text-sm text-white">
        <Link to="/komus">komus</Link>
        <Link to="/samson">samson</Link>
        <Link to="/search">search</Link>

        <Button onClick={() => index.export()}>Export</Button>

        <TextField>
          <TextFieldInput value={search()} onInput={(e) => setSearch(e.currentTarget.value)} />
        </TextField>

        <For each={result()}>{(item) => <div>{item.name}</div>}</For>
      </header>
    </div>
  )
}
