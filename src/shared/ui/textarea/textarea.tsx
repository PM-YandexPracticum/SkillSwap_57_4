import { forwardRef, useEffect, useId, useRef, useState, type ChangeEvent } from 'react'
import { clsx } from 'clsx'
import { mergeRefs } from 'react-merge-refs'
import type { TextareaProps } from './types'
import styles from './textarea.module.css'

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    { label, hint, error, endAdornment, className, id, maxLength, value, onChange, ...props },
    ref,
  ) => {
    const uniqueId = useId()
    const textareaId = id || `textarea-${uniqueId}`
    const descriptionId = `desc-${uniqueId}`

    const textareaRef = useRef<HTMLTextAreaElement>(null)
    const [charCount, setCharCount] = useState(0)

    useEffect(() => {
      setCharCount(textareaRef.current?.value.length ?? 0)
    }, [value])

    const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
      setCharCount(e.target.value.length)
      onChange?.(e)
    }

    const hasDescription = Boolean(hint || error)

    return (
      <div className={clsx(styles.container, className)}>
        <label htmlFor={textareaId}>{label}</label>

        <div className={clsx(styles.inputWrapper, error && styles.inputWrapperError)}>
          <textarea
            {...props}
            ref={mergeRefs([textareaRef, ref])}
            id={textareaId}
            className={styles.textarea}
            value={value}
            aria-invalid={Boolean(error)}
            aria-describedby={hasDescription ? descriptionId : undefined}
            maxLength={maxLength}
            onChange={handleChange}
          />
          {endAdornment}
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
