import type { ReactNode } from 'react'

export interface SkillDetailsProps {
  title: string
  description: string
  categoryName: string
  subcategoryName: string
  images: string[]
  titleAs?: 'h1' | 'h2' | 'h3'
  actions?: ReactNode
  className?: string
}
