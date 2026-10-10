import type { ComponentPropsWithoutRef } from 'react'

export interface SearchInputProps extends Omit<
  ComponentPropsWithoutRef<'input'>,
  'value' | 'onChange' | 'type'
> {
  value: string
  onChange: (value: string) => void
}
