import { clsx } from 'clsx'
import type { IconButtonProps } from './types'
import styles from './icon-button.module.css'

export const IconButton = ({
  icon,
  className,
  type = 'button',
  'aria-label': ariaLabel,
  ...props
}: IconButtonProps) => {
  return (
    <button
      type={type}
      className={clsx(styles.button, className)}
      aria-label={ariaLabel}
      {...props}
    >
      <span className={styles.icon} aria-hidden="true">
        {icon}
      </span>
    </button>
  )
}
