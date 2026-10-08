export type CheckboxItemState = 'unchecked' | 'checked'

export interface CheckboxItemProps {
  label: string
  state: CheckboxItemState
  onChange: () => void
  className?: string
}
