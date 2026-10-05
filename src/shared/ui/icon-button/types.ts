import type { ComponentPropsWithoutRef, ReactNode } from 'react'

type NativeButtonProps = Omit<ComponentPropsWithoutRef<'button'>, 'children'>

export interface IconButtonProps extends NativeButtonProps {
  icon: ReactNode
  'aria-label': string
}
