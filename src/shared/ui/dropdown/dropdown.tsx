import clsx from 'clsx'
import { forwardRef } from 'react'
import type { DropdownProps } from './types'
import styles from './dropdown.module.css'

export const Dropdown = forwardRef<HTMLDivElement, DropdownProps>(function Dropdown(
  { className, children, ...props },
  ref,
) {
  return (
    <div {...props} ref={ref} className={clsx(styles.dropdown, className)}>
      {children}
    </div>
  )
})
