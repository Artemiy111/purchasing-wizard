import { createFileRoute } from '@tanstack/solid-router'

import logo from '~/logo.svg'
import { Button } from '~/shared/ui'

export const Route = createFileRoute('/')({
  component: HomePage,
})

function HomePage() {
  return (
    <div class="text-center">
      <header class="flex min-h-screen flex-col items-center justify-center bg-[#282c34] text-[calc(10px+2vmin)] text-white">
        <img
          src={logo}
          class="pointer-events-none h-[40vmin] animate-[spin_20s_linear_infinite]"
          alt="logo"
        />
        <p>
          Edit <code>src/routes/index.tsx</code> and save to reload.
        </p>
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
        <Button>Button</Button>
        <Button variant="ghost">Button</Button>
        <Button variant={'outline'}>Button</Button>
      </header>
    </div>
  )
}
