export type CategoryItemState = 'unchecked' | 'checked' | 'indeterminate'

export interface CategoryItemProps {
  label: string
  state: CategoryItemState
  opened: boolean
  onChange: () => void
  onToggle: () => void
  className?: string
}
