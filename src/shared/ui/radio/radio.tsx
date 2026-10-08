import { clsx } from 'clsx'

import { RadiobuttonActiveIcon, RadiobuttonEmptyIcon } from '@/shared/assets/icons'

import styles from './radio.module.css'
import type { RadioProps } from './types'

const ICONS = {
  unchecked: RadiobuttonEmptyIcon,
  checked: RadiobuttonActiveIcon,
}

export const Radio = ({ state, className, ...inputProps }: RadioProps) => {
  const isChecked = state === 'checked'
  const Icon = ICONS[state]

  return (
    <span className={clsx(styles.radio, className)}>
      <input {...inputProps} type="radio" checked={isChecked} className={styles.input} />
      <Icon className={clsx(styles.icon, isChecked && styles.active)} aria-hidden="true" />
    </span>
  )
}
