import type { CheckboxProps } from '@/shared/ui/checkbox'

export interface CategoryItemProps extends CheckboxProps {
  label: string
  opened?: boolean
  onToggle: () => void
}
