import { forwardRef, useId, useState, ChangeEvent } from 'react'
import { clsx } from 'clsx'
import { TextareaProps } from './types'
import styles from './textarea.module.css'

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, hint, error, className, id, maxLength, onChange, defaultValue, ...props }, ref) => {
    const uniqueId = useId()
    const textareaId = id || `textarea-${uniqueId}`
    const descriptionId = `desc-${uniqueId}`

    const [charCount, setCharCount] = useState(() => {
      if (typeof defaultValue === 'string') return defaultValue.length
      return 0
    })

    const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
      if (maxLength) {
        setCharCount(e.target.value.length)
      }
      if (onChange) {
        onChange(e)
      }
    }

    const hasDescription = Boolean(hint || error)

    return (
      <div className={clsx(styles.container, className)}>
        <label htmlFor={textareaId} className={styles.label}>
          {label}
        </label>

        <div className={clsx(styles.inputWrapper, error && styles.inputWrapperError)}>
          <textarea
            ref={ref}
            id={textareaId}
            className={styles.textarea}
            aria-invalid={Boolean(error)}
            aria-describedby={hasDescription ? descriptionId : undefined}
            maxLength={maxLength}
            onChange={handleChange}
            defaultValue={defaultValue}
            {...props}
          />
        </div>

        {(hasDescription || maxLength) && (
          <div className={styles.footer}>
            <p id={descriptionId} className={clsx(styles.bottomText, error && styles.errorText)}>
              {error || hint}
            </p>
            {maxLength && (
              <span className={styles.counter}>
                {charCount}/{maxLength}
              </span>
            )}
          </div>
        )}
      </div>
    )
  },
)

Textarea.displayName = 'Textarea'
