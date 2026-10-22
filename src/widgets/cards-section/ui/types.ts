import type { ReactNode } from 'react'

export interface CardsSectionProps {
  title: string
  action?: ReactNode
  carousel?: boolean
  children: ReactNode
  className?: string
}
