import { ChangeEvent } from 'react'
import { CheckboxState } from '@/shared/ui/checkbox'

export interface CheckboxItemProps {
  label: string
  state: Exclude<CheckboxState, 'indeterminate'>
  onChange: (e: ChangeEvent<HTMLInputElement>) => void
  className?: string
}
