import { SelectOption } from '../select/types'

export interface MultiSelectProps {
  label: string
  options: SelectOption[]
  value: string[]
  onChange: (value: string[]) => void
  placeholder?: string
  error?: string
  className?: string
}
