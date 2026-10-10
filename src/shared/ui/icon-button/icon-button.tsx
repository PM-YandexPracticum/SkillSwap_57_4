import { forwardRef } from 'react'
import { clsx } from 'clsx'
import type { IconButtonProps } from './types'
import styles from './icon-button.module.css'

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(function IconButton(
  { icon, className, type = 'button', ...props },
  ref,
) {
  return (
    <button {...props} ref={ref} type={type} className={clsx(styles.button, className)}>
      <span className={styles.icon} aria-hidden="true">
        {icon}
      </span>
    </button>
  )
})
