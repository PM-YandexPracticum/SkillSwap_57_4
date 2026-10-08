import { ChangeEvent, useRef } from 'react';
import clsx from 'clsx';
import { IconButton } from '@/shared/ui/icon-button';
import SearchIcon from '@/shared/assets/icons/search.svg?react';
import CrossIcon from '@/shared/assets/icons/cross.svg?react';
import { SearchInputProps } from './types';
import styles from './search-input.module.css';

export const SearchInput = ({
  value,
  onChange,
  placeholder = 'Искать навык',
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

  return (
    <div className={clsx(styles.wrapper, className)} role="search">
      <SearchIcon className={styles.icon} aria-hidden="true" />
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
          icon={<CrossIcon />}
          aria-label="Очистить поиск"
          onClick={handleClear}
        />
      )}
    </div>
  );
};