import type { ReactNode } from 'react'

export interface CardsSectionProps {
  title: string
  action?: ReactNode
  children: ReactNode
  className?: string
}
