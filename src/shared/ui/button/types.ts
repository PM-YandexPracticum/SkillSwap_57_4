import type { ComponentPropsWithoutRef, ReactNode } from 'react'

export type ButtonVariant = 'primary' | 'secondary' | 'tertiary'

export interface ButtonProps extends ComponentPropsWithoutRef<'button'> {
  variant?: ButtonVariant
  leftIcon?: ReactNode
  rightIcon?: ReactNode
  fullWidth?: boolean
}
