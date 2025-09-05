import type { UseInfiniteQueryResult } from '@tanstack/solid-query'
import RotateCcwIcon from 'lucide-solid/icons/rotate-ccw'
import { Button } from './button'
import { Loader } from './loader'

export type ProviderStatusProps = {
  title: string
  totalCount: number | undefined
  totalPages: number | undefined
  query: UseInfiniteQueryResult
}

export const ProviderStatus = (props: ProviderStatusProps) => {
  return (
    <div class="flex flex-col gap-y-3 rounded-2xl bg-primary-foreground p-8">
      <div class="flex items-center gap-x-3">
        <span class="font-semibold text-3xl">{props.title}</span>
        <Show when={props.query.isPending || props.query.isLoading}>
          <Loader />
        </Show>
      </div>
      <ul class="space-y-2">
        <li class="">Страниц {props.totalPages}</li>
        <li>Товаров {props.totalCount}</li>
        <li class="">Есть ещё страницы {props.query.hasNextPage ? 'Да' : 'Нет'}</li>
      </ul>
      <Button class="w-fit" onClick={() => props.query.refetch()}>
        <RotateCcwIcon />
      </Button>

      <Show when={props.query.isError}>
        <p class="rounded bg-error px-3 py-2 text-error-foreground">{String(props.query.error)}</p>
      </Show>
    </div>
  )
}
