import type { CheckboxProps, CheckboxState } from '@/shared/ui/checkbox'

export interface CheckboxItemProps extends Omit<CheckboxProps, 'state'> {
  label: string
  state?: Exclude<CheckboxState, 'indeterminate'>
}
