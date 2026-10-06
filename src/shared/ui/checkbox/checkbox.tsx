
import { useEffect, useRef } from 'react';
import { clsx } from 'clsx';

import {
  CheckboxDoneIcon,
  CheckboxEmptyIcon,
  CheckboxRemoveIcon
} from '@/shared/assets/icons';

import styles from './checkbox.module.css';
import type { CheckboxProps } from './types';

const ICONS = {
  unchecked: CheckboxEmptyIcon,
  checked: CheckboxDoneIcon,
  indeterminate: CheckboxRemoveIcon
};

export const Checkbox = ({
  state,
  className,
  ...inputProps
}: CheckboxProps) => {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.indeterminate = state === 'indeterminate';
    }
  }, [state]);

  const Icon = ICONS[state];

  return (
    <span className={clsx(styles.checkbox, className)}>
      <input
        {...inputProps}
        ref={inputRef}
        type="checkbox"
        checked={state === 'checked'}
        className={styles.input}
      />

      <Icon
        className={clsx(
          styles.icon,
          state !== 'unchecked' && styles.active
        )}
        aria-hidden="true"
      />
    </span>
  );
};