import clsx from 'clsx'
import { forwardRef } from 'react'
import { ChevronDownIcon, ChevronUpIcon } from '@/shared/assets/icons'
import type { ExpandButtonProps } from './types'
import styles from './expand-button.module.css'

export const ExpandButton = forwardRef<HTMLButtonElement, ExpandButtonProps>(function ExpandButton(
  { label, opened = false, onToggle, type = 'button', className, ...buttonProps },
  ref,
) {
  const Chevron = opened ? ChevronUpIcon : ChevronDownIcon

  return (
    <button
      {...buttonProps}
      ref={ref}
      type={type}
      className={clsx(styles.button, className)}
      aria-expanded={opened}
      onClick={onToggle}
    >
      {label}
      <Chevron className={styles.icon} aria-hidden="true" />
    </button>
  )
})
