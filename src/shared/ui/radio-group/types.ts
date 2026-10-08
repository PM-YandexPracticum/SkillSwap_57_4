import type { ComponentPropsWithoutRef } from 'react'

export interface RadioGroupOption<T extends string> {
  value: T
  label: string
}

export interface RadioGroupProps<T extends string> extends Omit<
  ComponentPropsWithoutRef<'div'>,
  'onChange' | 'children'
> {
  name: string
  value: T
  onChange: (value: T) => void
  options: readonly RadioGroupOption<T>[]
}
