import { forwardRef, useState, useRef, useId } from 'react'
import { clsx } from 'clsx'
import { mergeRefs } from 'react-merge-refs'
import type { MultiSelectProps } from './types'
import { CheckboxItem } from '@/shared/ui/checkbox-item'
import { ChevronDownIcon } from '@/shared/assets/icons'
import { useDismiss } from '@/shared/hooks/useDismiss'
import styles from './multi-select.module.css'

export const MultiSelect = forwardRef<HTMLButtonElement, MultiSelectProps>(function MultiSelect(
  { label, options, value, onChange, placeholder = 'Выберите...', error, className },
  ref,
) {
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)

  const uniqueId = useId()
  const fieldId = `field-${uniqueId}`
  const labelId = `label-${uniqueId}`
  const valueId = `value-${uniqueId}`
  const listboxId = `listbox-${uniqueId}`
  const errorId = `error-${uniqueId}`

  const selectedLabels = options.filter((opt) => value.includes(opt.value)).map((opt) => opt.label)
  const selectedText = isOpen ? selectedLabels.join(', ') : `Выбрано: ${selectedLabels.length}`

  const controlClassName = clsx(
    styles.control,
    isOpen && styles.controlOpen,
    error && styles.controlError,
  )
  const iconClassName = clsx(styles.icon, isOpen && styles.iconOpen)

  const closeDropdown = () => setIsOpen(false)

  useDismiss({
    ref: containerRef,
    onDismiss: closeDropdown,
    isActive: isOpen,
    returnFocusRef: buttonRef,
  })

  const handleToggle = () => setIsOpen((open) => !open)

  const handleSelect = (optionValue: string) => {
    if (value.includes(optionValue)) {
      onChange(value.filter((v) => v !== optionValue))
    } else {
      onChange([...value, optionValue])
    }
  }

  return (
    <div ref={containerRef} className={clsx(styles.container, className)}>
      <label id={labelId} htmlFor={fieldId}>
        {label}
      </label>

      <div className={styles.anchor}>
        <button
          id={fieldId}
          ref={mergeRefs([buttonRef, ref])}
          type="button"
          aria-expanded={isOpen}
          aria-controls={listboxId}
          aria-labelledby={`${labelId} ${valueId}`}
          aria-describedby={error ? errorId : undefined}
          className={controlClassName}
          onClick={handleToggle}
        >
          <span
            id={valueId}
            className={clsx(styles.value, selectedLabels.length === 0 && styles.placeholder)}
          >
            {selectedLabels.length > 0 ? selectedText : placeholder}
          </span>
          <ChevronDownIcon className={iconClassName} aria-hidden="true" />
        </button>

        {isOpen && (
          <ul id={listboxId} className={clsx(styles.dropdown, error && styles.dropdownError)}>
            {options.map((opt) => (
              <li key={opt.value}>
                <CheckboxItem
                  className={styles.option}
                  name={fieldId}
                  label={opt.label}
                  state={value.includes(opt.value) ? 'checked' : 'unchecked'}
                  onChange={() => handleSelect(opt.value)}
                />
              </li>
            ))}
            {options.length === 0 && <li className={styles.empty}>Нет вариантов</li>}
          </ul>
        )}
      </div>

      {error && (
        <span id={errorId} className={styles.errorText}>
          {error}
        </span>
      )}
    </div>
  )
})
