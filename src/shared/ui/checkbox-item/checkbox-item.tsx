import clsx from 'clsx'
import { Checkbox } from '@/shared/ui/checkbox'
import type { CheckboxItemProps } from './types'

import styles from './checkbox-item.module.css'

export const CheckboxItem = ({ label, state, name, onChange, className }: CheckboxItemProps) => (
  <label className={clsx(styles.item, className)}>
    <Checkbox state={state} name={name} onChange={onChange} />
    <span>{label}</span>
  </label>
)
