import clsx from 'clsx'
import { Checkbox } from '../checkbox/checkbox'
import type { CheckboxItemProps } from './types'

import styles from './checkbox-item.module.css'

export const CheckboxItem = ({ label, state, onChange, className }: CheckboxItemProps) => (
  <label className={clsx(styles.item, className)}>
    <Checkbox state={state} onChange={onChange} />
    <span>{label}</span>
  </label>
)
