import { forwardRef } from 'react'
import { clsx } from 'clsx'
import type { ButtonProps } from './types'
import styles from './button.module.css'

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    variant = 'primary',
    leftIcon,
    rightIcon,
    fullWidth = false,
    className,
    type = 'button',
    children,
    ...props
  },
  ref,
) {
  return (
    <button
      {...props}
      ref={ref}
      type={type}
      className={clsx(styles.button, styles[variant], fullWidth && styles.fullWidth, className)}
    >
      {leftIcon && (
        <span aria-hidden="true" className={styles.icon}>
          {leftIcon}
        </span>
      )}
      <span>{children}</span>
      {rightIcon && (
        <span aria-hidden="true" className={styles.icon}>
          {rightIcon}
        </span>
      )}
    </button>
  )
})
