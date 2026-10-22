import type { ComponentPropsWithoutRef, ReactNode } from 'react'

export interface InputProps extends ComponentPropsWithoutRef<'input'> {
  label: string
  hint?: string
  error?: string
  endAdornment?: ReactNode
  invalid?: boolean
}
