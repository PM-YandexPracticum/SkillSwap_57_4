import type { ReactNode } from 'react'

export type SkillDetailsVariant = 'page' | 'preview'

export interface SkillDetailsProps {
  title: string
  description: string
  categoryName: string
  subcategoryName: string
  images: string[]
  variant?: SkillDetailsVariant
  titleAs?: 'h1' | 'h3'
  actions?: ReactNode
  className?: string
}
