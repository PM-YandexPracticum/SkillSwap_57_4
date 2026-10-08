import { useState, useRef, useId } from 'react'
import { clsx } from 'clsx'
import { MultiSelectProps } from './types'
import { Checkbox } from '@/shared/ui/checkbox'
import ChevronDownIcon from '@/shared/assets/icons/chevron-down.svg?react'
import { useDismiss } from '@/shared/hooks/useDismiss'
import styles from './multi-select.module.css'

export const MultiSelect = ({
  label,
  options,
  value,
  onChange,
  placeholder = 'Выберите...',
  error,
  className,
}: MultiSelectProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const controlRef = useRef<HTMLButtonElement>(null)

  const uniqueId = useId()
  const labelId = `label-${uniqueId}`
  const valueId = `value-${uniqueId}`
  const listboxId = `listbox-${uniqueId}`
  const errorId = `error-${uniqueId}`

  const closeDropdown = () => {
    setIsOpen(false)
    controlRef.current?.focus()
  }

  useDismiss({
    ref: containerRef,
    onDismiss: closeDropdown,
    isActive: isOpen,
  });

  const handleToggle = () => setIsOpen((prev) => !prev)

  const handleSelect = (optionValue: string) => {
    if (value.includes(optionValue)) {
      onChange(value.filter((v) => v !== optionValue))
    } else {
      onChange([...value, optionValue])
    }
  }

  const selectedLabels = options.filter((opt) => value.includes(opt.value)).map((opt) => opt.label)

  const displayValue =
    selectedLabels.length > 0
      ? !isOpen && selectedLabels.length > 1
        ? `Выбрано: ${selectedLabels.length}`
        : selectedLabels.join(', ')
      : placeholder

  return (
    <div ref={containerRef} className={clsx(styles.container, className)}>
      <span id={labelId} className={styles.label}>
        {label}
      </span>

      <button
        ref={controlRef}
        type="button"
        aria-expanded={isOpen}
        aria-controls={listboxId}
        aria-labelledby={`${labelId} ${valueId}`}
        aria-describedby={error ? errorId : undefined}
        className={clsx(styles.control, error && styles.controlError)}
        onClick={handleToggle}
      >
        <span
          id={valueId}
          className={clsx(styles.valueText, value.length === 0 && styles.placeholder)}
        >
          {displayValue}
        </span>
        <ChevronDownIcon
          className={clsx(styles.icon, isOpen && styles.iconOpen)}
          aria-hidden="true"
        />
      </button>

      {isOpen && (
        <div id={listboxId} role="listbox" aria-multiselectable="true" className={styles.dropdown}>
          {options.map((opt) => (
            <div
              key={opt.value}
              role="option"
              aria-selected={value.includes(opt.value)}
              className={styles.option}
            >
              <label className={styles.checkboxWrapper}>
                {}
                <Checkbox
                  state={value.includes(opt.value) ? 'checked' : 'unchecked'}
                  onChange={() => handleSelect(opt.value)}
                />
                <span>{opt.label}</span>
              </label>
            </div>
          ))}
        </div>
      )}

      {error && (
        <span id={errorId} className={styles.errorText}>
          {error}
        </span>
      )}
    </div>
  )
}
