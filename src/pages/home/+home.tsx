import { createLiveQuery, db } from '~/shared/lib'
import { Button, ProviderStatus, TextField, TextFieldInput } from '~/shared/ui/kit'

export function HomePage() {
  const komusProducts = createLiveQuery(() =>
    db.products.filter((p) => p.provider === 'komus').toArray(),
  )
  const samsonProduct = createLiveQuery(() =>
    db.products.filter((p) => p.provider === 'samson').toArray(),
  )

  return (
    <div class="container mx-auto mt-10 flex flex-col gap-y-8">
      <Button class="w-fit" onClick={() => db.products.clear()}>
        Очистить всё
      </Button>

      <div class="grid grid-cols-2 gap-10">
        <div class="flex flex-col gap-y-3 rounded-2xl bg-primary-foreground p-8">
          <span>Комус</span>
          <div class="">
            <span>Загружено {komusProducts()?.length}</span>
          </div>

          <Button onClick={() => db.products.bulkDelete(komusProducts()?.map((p) => p.id) ?? [])}>
            Очистить
          </Button>
        </div>

        <div class="flex flex-col gap-y-3 rounded-2xl bg-primary-foreground p-8">
          <span>Самсон</span>
          <div class="">
            <span>Загружено {samsonProduct()?.length}</span>
          </div>
          <Button onClick={() => db.products.bulkDelete(samsonProduct()?.map((p) => p.id) ?? [])}>
            Очистить
          </Button>
        </div>
      </div>
    </div>
  )
}
