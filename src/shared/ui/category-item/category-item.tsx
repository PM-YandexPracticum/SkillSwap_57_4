import clsx from 'clsx'
import { Checkbox } from '@/shared/ui/checkbox'
import { ChevronDownIcon, ChevronUpIcon } from '@/shared/assets/icons'

import type { CategoryItemProps } from './types'

import styles from './category-item.module.css'

export const CategoryItem = ({
  label,
  state,
  opened,
  onChange,
  onToggle,
  className,
}: CategoryItemProps) => {
  const ChevronIcon = opened ? ChevronUpIcon : ChevronDownIcon

  return (
    <div className={clsx(styles.item, className)}>
      <Checkbox state={state} onChange={onChange} aria-label={label} />

      <button type="button" className={styles.toggle} aria-expanded={opened} onClick={onToggle}>
        <span>{label}</span>
        <ChevronIcon className={clsx(styles.chevron, opened && styles.opened)} aria-hidden="true" />
      </button>
    </div>
  )
}
