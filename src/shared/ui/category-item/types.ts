import { ChangeEvent } from 'react'
import type { CheckboxState } from '@/shared/ui/checkbox'

export interface CategoryItemProps {
  label: string
  state: CheckboxState
  opened: boolean
  onChange: (e: ChangeEvent<HTMLInputElement>) => void
  onToggle: () => void
  className?: string
}
