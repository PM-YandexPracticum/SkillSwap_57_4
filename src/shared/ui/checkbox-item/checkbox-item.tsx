import clsx from 'clsx'
import { forwardRef } from 'react'
import { Checkbox } from '@/shared/ui/checkbox'
import type { CheckboxItemProps } from './types'
import styles from './checkbox-item.module.css'

export const CheckboxItem = forwardRef<HTMLInputElement, CheckboxItemProps>(function CheckboxItem(
  { label, className, ...checkboxProps },
  ref,
) {
  return (
    <label className={clsx(styles.item, className)}>
      <Checkbox {...checkboxProps} ref={ref} />
      <span>{label}</span>
    </label>
  )
})
