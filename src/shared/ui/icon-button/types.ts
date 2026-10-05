import type { ComponentPropsWithoutRef, ReactNode } from 'react'

type NativeButtonProps = Omit<
  ComponentPropsWithoutRef<'button'>,
  'children' | 'aria-label'
>

export interface IconButtonProps extends NativeButtonProps {
  icon: ReactNode
  'aria-label': string
}
