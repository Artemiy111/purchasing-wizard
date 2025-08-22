import { createFileRoute, Link } from '@tanstack/solid-router'
import { Charset, Index, IndexedDB, Worker} from 'flexsearch'
import { createMemo, createSignal, For } from 'solid-js'
import { TextField, TextFieldInput } from '~/shared/ui/kit'

export const Route = createFileRoute('/')({
  component: HomePage,
})

type GenericProduct = {
  provider: "komus" | "samson"
  name: string
  description: string | null
  manifacturer: string | null
  sku: string | null
  barcode: string | null
}

const mockData: GenericProduct[] = [
  {
    provider: "komus",
    name: 'Product 1',
    description: 'Description 1',
    manifacturer: 'Manufacturer 1',
    sku: 'SKU1',
    barcode: 'Barcode1',
  },
  {
    provider: "komus",
    name: 'Черешня 2',
    description: 'Description 2',
    manifacturer: 'Manufacturer 2',
    sku: 'SKU2',
    barcode: 'Barcode2',
  },
]

const index = new Index({
  tokenize: 'forward',
  'fastupdate': true,
  encoder: Charset.LatinBalance
})


function HomePage() {
  const [search, setSearch] = createSignal('')

  const result = createMemo(() => {
    if (!search()) return mockData.map(d => d.name)
    const res = index.search(search(), {
      suggest: true,
      limit: 10
    })
    return res
  })

  return (
    <div class="text-center">
      <header class="flex min-h-screen flex-col items-center justify-center bg-[#282c34] text-sm text-white">
        <Link to="/komus">komus</Link>
        <Link to="/samson">samson</Link>

        <TextField>
          <TextFieldInput value={search()} onInput={setSearch} />
        </TextField>

        <For each={result()}>{item => (
          <div>{item}</div>
        )}</For>
      </header>
    </div>
  )
}
