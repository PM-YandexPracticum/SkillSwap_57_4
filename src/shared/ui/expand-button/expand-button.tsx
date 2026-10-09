import type { ExpandButtonProps } from './types'
import { ChevronDownIcon, ChevronUpIcon } from '@/shared/assets/icons'
import styles from './expand-button.module.css'

export const ExpandButton = ({ label, opened, onToggle }: ExpandButtonProps) => {
  const Chevron = opened ? ChevronUpIcon : ChevronDownIcon

  return (
    <button type="button" className={styles.button} aria-expanded={opened} onClick={onToggle}>
      {label}
      <Chevron className={styles.icon} aria-hidden="true" />
    </button>
  )
}
