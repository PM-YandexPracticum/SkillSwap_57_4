import type { ComponentPropsWithoutRef } from 'react'

export interface ExpandButtonProps extends Omit<
  ComponentPropsWithoutRef<'button'>,
  'children' | 'onClick'
> {
  label: string
  opened?: boolean
  onToggle: () => void
}
