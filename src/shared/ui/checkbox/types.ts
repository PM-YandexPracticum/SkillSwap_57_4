import type { ComponentPropsWithoutRef } from 'react'

export type CheckboxState = 'unchecked' | 'checked' | 'indeterminate'

export interface CheckboxProps extends Omit<
  ComponentPropsWithoutRef<'input'>,
  'type' | 'checked' | 'defaultChecked' | 'children'
> {
  state: CheckboxState
}
