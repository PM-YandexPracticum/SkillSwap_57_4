import type { ComponentPropsWithoutRef } from 'react';

export type CheckboxState = 'unchecked' | 'checked' | 'indeterminate';

export type CheckboxProps = Omit<
  ComponentPropsWithoutRef<'input'>,
  'type' | 'checked' | 'defaultChecked' | 'children'
> & {
  state: CheckboxState;
};