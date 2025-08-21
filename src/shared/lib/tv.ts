import { extendTailwindMerge } from 'tailwind-merge'
import { createTV } from 'tailwind-variants'

export type { ClassValue } from 'tailwind-variants'
export const cn = extendTailwindMerge({})

export const tv = createTV({
  twMerge: true,
  twMergeConfig: {},
})
