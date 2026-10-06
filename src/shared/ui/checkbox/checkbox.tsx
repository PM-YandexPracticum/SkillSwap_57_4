import { useEffect, useRef } from 'react';
import { clsx } from 'clsx';

import {
  CheckboxDoneIcon,
  CheckboxEmptyIcon,
  CheckboxRemoveIcon
} from '../../assets/icons';

import styles from './checkbox.module.css';
import type { CheckboxProps } from './types';

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
  });

  const Icon = {
    unchecked: CheckboxEmptyIcon,
    checked: CheckboxDoneIcon,
    indeterminate: CheckboxRemoveIcon
  }[state];

  return (
    <span className={clsx(styles.checkbox, className)}>
      <input
        {...inputProps}
        ref={inputRef}
        type="checkbox"
        checked={state === 'checked'}
        className={styles.input}
      />

      <span className={styles.icon} aria-hidden="true">
        <Icon />
      </span>
    </span>
  );
};