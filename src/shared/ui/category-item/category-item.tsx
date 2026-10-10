import clsx from 'clsx'
import { forwardRef } from 'react'
import { Checkbox } from '@/shared/ui/checkbox'
import { ChevronDownIcon, ChevronUpIcon } from '@/shared/assets/icons'
import type { CategoryItemProps } from './types'
import styles from './category-item.module.css'

export const CategoryItem = forwardRef<HTMLInputElement, CategoryItemProps>(function CategoryItem(
  { label, opened = false, onToggle, className, ...checkboxProps },
  ref,
) {
  const ChevronIcon = opened ? ChevronUpIcon : ChevronDownIcon

  return (
    <div className={clsx(styles.item, className)}>
      <Checkbox {...checkboxProps} ref={ref} aria-label={label} />

      <button type="button" className={styles.toggle} aria-expanded={opened} onClick={onToggle}>
        <span>{label}</span>
        <ChevronIcon className={clsx(styles.chevron, opened && styles.opened)} aria-hidden="true" />
      </button>
    </div>
  )
})
