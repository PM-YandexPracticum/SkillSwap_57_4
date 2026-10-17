import {
  forwardRef,
  useState,
  useRef,
  useId,
  useImperativeHandle,
  type ChangeEvent,
  type KeyboardEvent,
  type MouseEvent,
} from 'react'
import { clsx } from 'clsx'
import type { SelectHandle, SelectProps } from './types'
import { IconButton } from '@/shared/ui/icon-button'
import { ChevronDownIcon, CrossIcon } from '@/shared/assets/icons'
import { useDismiss } from '@/shared/hooks/useDismiss'
import styles from './select.module.css'

export const Select = forwardRef<SelectHandle, SelectProps>(function Select(
  {
    label,
    options,
    value,
    onChange,
    placeholder = 'Выберите...',
    error,
    searchable = false,
    className,
  },
  ref,
) {
  const [isOpen, setIsOpen] = useState(false)
  const [query, setQuery] = useState<string | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const uniqueId = useId()
  const fieldId = `field-${uniqueId}`
  const labelId = `label-${uniqueId}`
  const valueId = `value-${uniqueId}`
  const listboxId = `listbox-${uniqueId}`
  const errorId = `error-${uniqueId}`

  const selectedOption = options.find((opt) => opt.value === value)
  const searchText = query ?? selectedOption?.label ?? ''
  const filteredOptions = query
    ? options.filter((opt) => opt.label.toLowerCase().includes(query.toLowerCase()))
    : options

  const controlClassName = clsx(
    styles.control,
    isOpen && styles.controlOpen,
    error && styles.controlError,
  )
  const iconClassName = clsx(styles.icon, isOpen && styles.iconOpen)
  const focusField = () => (searchable ? inputRef : buttonRef).current?.focus()

  useImperativeHandle(ref, () => ({ focus: focusField }))

  const closeDropdown = () => {
    setIsOpen(false)
    setQuery(null)
  }

  useDismiss({
    ref: containerRef,
    onDismiss: closeDropdown,
    isActive: isOpen,
    returnFocusRef: searchable ? inputRef : buttonRef,
  })

  const handleToggle = () => setIsOpen((open) => !open)

  const handleBoxClick = (e: MouseEvent<HTMLDivElement>) => {
    inputRef.current?.focus()
    if (isOpen && e.target !== inputRef.current) closeDropdown()
    else setIsOpen(true)
  }

  const handleSelect = (optionValue: string) => {
    onChange(optionValue)
    closeDropdown()
    focusField()
  }

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value)
    setIsOpen(true)
  }

  const handleClearSearch = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation()
    onChange('')
    setQuery(null)
    inputRef.current?.focus()
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== 'Enter') return
    e.preventDefault()
    if (isOpen && filteredOptions.length > 0) handleSelect(filteredOptions[0].value)
    else setIsOpen(true)
  }

  return (
    <div ref={containerRef} className={clsx(styles.container, className)}>
      <label id={labelId} htmlFor={fieldId}>
        {label}
      </label>

      <div className={styles.anchor}>
        {searchable ? (
          <div className={controlClassName} onClick={handleBoxClick}>
            <input
              ref={inputRef}
              id={fieldId}
              type="text"
              role="combobox"
              autoComplete="off"
              aria-autocomplete="list"
              aria-expanded={isOpen}
              aria-controls={listboxId}
              aria-describedby={error ? errorId : undefined}
              className={styles.input}
              value={searchText}
              onChange={handleSearchChange}
              onKeyDown={handleKeyDown}
              placeholder={placeholder}
            />
            {query ? (
              <IconButton
                icon={<CrossIcon />}
                aria-label="Очистить поле"
                onClick={handleClearSearch}
              />
            ) : (
              <ChevronDownIcon className={iconClassName} aria-hidden="true" />
            )}
          </div>
        ) : (
          <button
            ref={buttonRef}
            id={fieldId}
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
              className={clsx(styles.value, !selectedOption && styles.placeholder)}
            >
              {selectedOption?.label ?? placeholder}
            </span>
            <ChevronDownIcon className={iconClassName} aria-hidden="true" />
          </button>
        )}

        {isOpen && (
          <ul id={listboxId} className={clsx(styles.dropdown, error && styles.dropdownError)}>
            {filteredOptions.map((opt) => (
              <li key={opt.value}>
                <button
                  type="button"
                  aria-current={opt.value === value ? 'true' : undefined}
                  className={clsx(styles.option, opt.value === value && styles.optionSelected)}
                  onClick={() => handleSelect(opt.value)}
                >
                  {opt.label}
                </button>
              </li>
            ))}
            {filteredOptions.length === 0 && <li className={styles.empty}>Ничего не найдено</li>}
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
