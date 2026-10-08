import type { ComponentPropsWithoutRef } from 'react'

export type RadioState = 'unchecked' | 'checked'

export interface RadioProps extends Omit<
  ComponentPropsWithoutRef<'input'>,
  'type' | 'checked' | 'defaultChecked' | 'children'
> {
  state: RadioState
}
