import { ChangeEvent, useRef } from 'react';
import { IconButton } from '@/shared/ui/icon-button';
import SearchIcon from '@/shared/assets/icons/search.svg?react';
import CrossIcon from '@/shared/assets/icons/cross.svg?react';
import { SearchInputProps } from './types';
import styles from './search-input.module.css';

export const SearchInput = ({
  value,
  onChange,
  placeholder = 'Поиск навыка',
  className,
}: SearchInputProps) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    onChange(event.target.value);
  };

  const handleClear = () => {
    onChange('');
    inputRef.current?.focus();
  };

  const containerClassName = className
    ? `${styles.wrapper} ${className}`
    : styles.wrapper;

  return (
    <div className={containerClassName} role="search">
      <SearchIcon className={styles.searchIcon} aria-hidden="true" />
      <input
        ref={inputRef}
        type="search"
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        aria-label={placeholder}
        className={styles.input}
      />
      {value && (
        <IconButton
          icon={<CrossIcon aria-hidden="true" />}
          aria-label="Очистить поиск"
          onClick={handleClear}
          className={styles.clearButton}
        />
      )}
    </div>
  );
};