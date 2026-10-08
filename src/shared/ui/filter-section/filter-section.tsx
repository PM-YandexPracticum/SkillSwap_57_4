import clsx from 'clsx';

import type { FilterSectionProps } from './types';
import styles from './filter-section.module.css';

export const FilterSection = ({
  title,
  hideTitle = false,
  children
}: FilterSectionProps) => {
  return (
    <fieldset className={styles.section}>
      <legend
        className={clsx(
          styles.title,
          hideTitle && 'visually-hidden'
        )}
      >
        {title}
      </legend>

      <div className={styles.content}>{children}</div>
    </fieldset>
  );
};