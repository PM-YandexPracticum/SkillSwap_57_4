import { clsx } from 'clsx'
import { ButtonProps } from './types'
import styles from './button.module.css'

export const Button = ({
  variant = 'primary',
  leftIcon,
  rightIcon,
  fullWidth = false,
  className,
  type = 'button',
  children,
  ...props
}: ButtonProps) => {
  return (
    <button
      type={type}
      className={clsx(styles.button, styles[variant], fullWidth && styles.fullWidth, className)}
      {...props}
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
}
