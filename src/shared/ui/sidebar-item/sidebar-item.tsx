import clsx from 'clsx'
import type { SidebarItemProps } from './types'
import styles from './sidebar-item.module.css'

export const SidebarItem = ({ icon, children, className, isActive = false }: SidebarItemProps) => (
  <span className={clsx(styles.item, isActive && styles.active, className)}>
    <span className={styles.icon} aria-hidden="true">
      {icon}
    </span>
    <span className={styles.label}>{children}</span>
  </span>
)
