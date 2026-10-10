import clsx from 'clsx'
import { forwardRef, useRef, type ChangeEvent } from 'react'
import { mergeRefs } from 'react-merge-refs'
import { IconButton } from '@/shared/ui/icon-button'
import { CrossIcon, SearchIcon } from '@/shared/assets/icons'
import type { SearchInputProps } from './types'
import styles from './search-input.module.css'

export const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(function SearchInput(
  { value, onChange, placeholder = 'Искать навык', name = 'search', className, ...inputProps },
  ref,
) {
  const inputRef = useRef<HTMLInputElement>(null)

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    onChange(event.target.value)
  }

  const handleClear = () => {
    onChange('')
    inputRef.current?.focus()
  }

  return (
    <div className={clsx(styles.wrapper, className)} role="search">
      <SearchIcon className={styles.icon} aria-hidden="true" />
      <input
        {...inputProps}
        ref={mergeRefs([inputRef, ref])}
        type="search"
        name={name}
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        aria-label={placeholder}
        className={styles.input}
      />
      {value && (
        <IconButton icon={<CrossIcon />} aria-label="Очистить поиск" onClick={handleClear} />
      )}
    </div>
  )
})
