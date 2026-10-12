import { forwardRef, useId } from 'react'
import { clsx } from 'clsx'
import { InputProps } from './types'
import styles from './input.module.css'

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, hint, error, endAdornment, className, id, ...props }, ref) => {
    const uniqueId = useId()
    const inputId = id || `input-${uniqueId}`
    const descriptionId = `desc-${uniqueId}`

    const hasDescription = Boolean(hint || error)

    return (
      <div className={clsx(styles.container, className)}>
        <label htmlFor={inputId} className={styles.label}>
          {label}
        </label>

        <div className={clsx(styles.inputWrapper, error && styles.inputWrapperError)}>
          <input
            ref={ref}
            id={inputId}
            className={styles.input}
            aria-invalid={Boolean(error)}
            aria-describedby={hasDescription ? descriptionId : undefined}
            {...props}
          />
          {endAdornment && <div className={styles.adornment}>{endAdornment}</div>}
        </div>

        {hasDescription && (
          <p id={descriptionId} className={clsx(styles.bottomText, error && styles.errorText)}>
            {error || hint}
          </p>
        )}
      </div>
    )
  },
)

Input.displayName = 'Input'
