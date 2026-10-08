import { useState, useRef, ChangeEvent, KeyboardEvent, useId, useEffect } from 'react'
import { clsx } from 'clsx'
import { SelectProps } from './types'
import { IconButton } from '@/shared/ui/icon-button'
import ChevronDownIcon from '@/shared/assets/icons/chevron-down.svg?react'
import CrossIcon from '@/shared/assets/icons/cross.svg?react'
import { useDismiss } from '@/shared/hooks/useDismiss'
import styles from './select.module.css'

export const Select = ({
  label,
  options,
  value,
  onChange,
  placeholder = 'Выберите...',
  error,
  searchable = false,
  className,
}: SelectProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const [searchValue, setSearchValue] = useState('')
  const containerRef = useRef<HTMLDivElement>(null)
  const controlRef = useRef<HTMLButtonElement | HTMLInputElement>(null)

  const uniqueId = useId()
  const labelId = `label-${uniqueId}`
  const valueId = `value-${uniqueId}`
  const listboxId = `listbox-${uniqueId}`
  const errorId = `error-${uniqueId}`

  const selectedOption = options.find((opt) => opt.value === value)

  useEffect(() => {
    if (!isOpen) {
      setSearchValue(selectedOption ? selectedOption.label : '')
    }
  }, [isOpen, selectedOption])

  const closeDropdown = () => {
    setIsOpen(false)
    controlRef.current?.focus()
  }

 useDismiss({
    ref: containerRef,
    onDismiss: closeDropdown,
    isActive: isOpen,
  });

  const handleToggle = () => {
    if (!isOpen) setIsOpen(true)
    else closeDropdown()
  }

  const handleSelect = (optionValue: string) => {
    onChange(optionValue)
    closeDropdown()
  }

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value)
    if (!isOpen) setIsOpen(true)
  }

  const handleClearSearch = (e: React.MouseEvent) => {
    e.stopPropagation()
    onChange('')
    setSearchValue('')
    controlRef.current?.focus()
  }

  const filteredOptions = searchable
    ? options.filter((opt) => opt.label.toLowerCase().includes(searchValue.toLowerCase()))
    : options

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      if (isOpen && filteredOptions.length > 0) {
        handleSelect(filteredOptions[0].value)
      } else {
        setIsOpen(true)
      }
    }
  }

  return (
    <div ref={containerRef} className={clsx(styles.container, className)}>
      <span id={labelId} className={styles.label}>
        {label}
      </span>

      {searchable ? (
        <div
          className={clsx(styles.control, error && styles.controlError)}
          onClick={() => setIsOpen(true)}
        >
          <input
            ref={controlRef as React.RefObject<HTMLInputElement>}
            type="text"
            role="combobox"
            aria-autocomplete="list"
            aria-expanded={isOpen}
            aria-controls={listboxId}
            aria-describedby={error ? errorId : undefined}
            className={styles.input}
            value={searchValue}
            onChange={handleSearchChange}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
          />
          {searchValue ? (
            <IconButton
              icon={<CrossIcon />}
              aria-label="Очистить поле"
              onClick={handleClearSearch}
            />
          ) : (
            <ChevronDownIcon
              className={clsx(styles.icon, isOpen && styles.iconOpen)}
              aria-hidden="true"
            />
          )}
        </div>
      ) : (
        <button
          ref={controlRef as React.RefObject<HTMLButtonElement>}
          type="button"
          aria-expanded={isOpen}
          aria-controls={listboxId}
          aria-labelledby={`${labelId} ${valueId}`}
          aria-describedby={error ? errorId : undefined}
          className={clsx(styles.control, error && styles.controlError)}
          onClick={handleToggle}
        >
          <span id={valueId} className={clsx(!selectedOption && styles.placeholder)}>
            {selectedOption ? selectedOption.label : placeholder}
          </span>
          <ChevronDownIcon
            className={clsx(styles.icon, isOpen && styles.iconOpen)}
            aria-hidden="true"
          />
        </button>
      )}

      {isOpen && (
        <div id={listboxId} role="listbox" className={styles.dropdown}>
          {filteredOptions.length > 0 ? (
            filteredOptions.map((opt) => (
              <button
                key={opt.value}
                type="button"
                role="option"
                aria-current={opt.value === value ? 'true' : undefined}
                aria-selected={opt.value === value}
                className={clsx(styles.option, opt.value === value && styles.optionSelected)}
                onClick={() => handleSelect(opt.value)}
              >
                {opt.label}
              </button>
            ))
          ) : (
            <div className={styles.empty}>Ничего не найдено</div>
          )}
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
