import type { ReactNode } from 'react'

export interface SidebarItemProps {
  icon: ReactNode
  children: ReactNode
  className?: string
  isActive?: boolean
}
