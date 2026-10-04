import clsx from 'clsx';
import { ButtonProps } from './types';
import styles from './button.module.css';

export const Button = ({
  children,
  className,
  variant = 'primary',
  leftIcon,
  rightIcon,
  fullWidth = false,
  type = 'button',
  ...props
}: ButtonProps) => {
  return (
    <button
      type={type}
      className={clsx(
        styles.button,
        styles[variant],
        fullWidth && styles.fullWidth,
        className
      )}
      {...props}
    >
      {leftIcon && <span aria-hidden="true" className={styles.icon}>{leftIcon}</span>}
      <span className={styles.content}>{children}</span>
      {rightIcon && <span aria-hidden="true" className={styles.icon}>{rightIcon}</span>}
    </button>
  );
};
