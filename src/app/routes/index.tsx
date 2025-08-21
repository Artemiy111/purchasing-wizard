import { useQuery } from '@tanstack/solid-query'
import { createFileRoute } from '@tanstack/solid-router'
import { For, Suspense } from 'solid-js'
import logo from '~/logo.svg'
import { samson } from '~/shared/api'
import { Button } from '~/shared/ui'

export const Route = createFileRoute('/')({
  component: HomePage,
})

function HomePage() {
  const query = useQuery(() => ({
    queryKey: ['products'],
    queryFn: () => samson.api.getProducts({}),
    refetchOnMount: false,
  }))

  return (
    <div class="text-center">
      <header class="flex min-h-screen flex-col items-center justify-center bg-[#282c34] text-[calc(10px+2vmin)] text-white">
        <img
          src={logo}
          class="pointer-events-none h-[40vmin] animate-[spin_20s_linear_infinite]"
          alt="logo"
        />
        <p></p>
        <a
          class="text-[#61dafb] hover:underline"
          href="https://solidjs.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn Solid
        </a>
        <a
          class="text-[#61dafb] hover:underline"
          href="https://tanstack.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn TanStack
        </a>
        <a href="/about">about</a>

        <Button variant="ghost" onclick={() => samson.api.getProducts({})}>
          Button
        </Button>

        <Suspense>
          <For each={query.data}>{(item) => <pre>{JSON.stringify(item, null, 2)}</pre>}</For>
        </Suspense>
      </header>
    </div>
  )
}
