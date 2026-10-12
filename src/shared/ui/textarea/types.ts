import { ComponentPropsWithoutRef } from 'react'

export interface TextareaProps extends ComponentPropsWithoutRef<'textarea'> {
  label: string
  hint?: string
  error?: string
}
