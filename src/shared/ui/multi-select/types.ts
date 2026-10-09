import type { SelectOption } from '@/shared/ui/select'

export interface MultiSelectProps {
  label: string
  options: SelectOption[]
  value: string[]
  onChange: (value: string[]) => void
  placeholder?: string
  error?: string
  className?: string
}
