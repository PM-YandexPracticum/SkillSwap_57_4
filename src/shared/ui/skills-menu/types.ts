import type { SkillCategory, SkillCategoryId } from '@/shared/types'
import type { ComponentType, SVGProps } from 'react'

export interface SkillsMenuProps {
  categories: SkillCategory[]
  onSelect: (subcategoryId: string) => void
  id?: string
  className?: string
}

export type SkillCategoryIcons = Record<SkillCategoryId, ComponentType<SVGProps<SVGSVGElement>>>
