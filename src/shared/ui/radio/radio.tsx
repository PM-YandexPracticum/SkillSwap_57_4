import { clsx } from 'clsx'

import { RadiobuttonActiveIcon, RadiobuttonEmptyIcon } from '@/shared/assets/icons'

import styles from './radio.module.css'
import type { RadioProps } from './types'

const ICONS = {
  unchecked: RadiobuttonEmptyIcon,
  checked: RadiobuttonActiveIcon,
}

export const Radio = ({ state, className, ...inputProps }: RadioProps) => {
  const Icon = ICONS[state]

  return (
    <span className={clsx(styles.radio, className)}>
      <input {...inputProps} type="radio" checked={state === 'checked'} className={styles.input} />
      <Icon
        className={clsx(styles.icon, state === 'checked' && styles.active)}
        aria-hidden="true"
      />
    </span>
  )
}
