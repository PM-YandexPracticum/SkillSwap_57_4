import type { ExpandButtonProps } from './types';

import {
  ChevronDownIcon,
  ChevronUpIcon
} from '@/shared/assets/icons';

import styles from './expand-button.module.css';

export const ExpandButton = ({
  label,
  opened,
  onToggle
}: ExpandButtonProps) => {
  return (
    <button
      type="button"
      className={styles.button}
      aria-expanded={opened}
      onClick={onToggle}
    >
      <span>{label}</span>

      <span aria-hidden="true" className={styles.icon}>
        {opened ? <ChevronUpIcon /> : <ChevronDownIcon />}
      </span>
    </button>
  );
};