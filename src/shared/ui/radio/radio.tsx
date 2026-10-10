import { forwardRef } from 'react'
import { clsx } from 'clsx'
import { RadiobuttonActiveIcon, RadiobuttonEmptyIcon } from '@/shared/assets/icons'
import type { RadioProps } from './types'
import styles from './radio.module.css'

const ICONS = {
  unchecked: RadiobuttonEmptyIcon,
  checked: RadiobuttonActiveIcon,
}

export const Radio = forwardRef<HTMLInputElement, RadioProps>(function Radio(
  { state = 'unchecked', className, ...inputProps },
  ref,
) {
  const isChecked = state === 'checked'
  const Icon = ICONS[state]

  return (
    <span className={clsx(styles.radio, className)}>
      <input {...inputProps} ref={ref} type="radio" checked={isChecked} className={styles.input} />
      <Icon className={clsx(styles.icon, isChecked && styles.active)} aria-hidden="true" />
    </span>
  )
})
