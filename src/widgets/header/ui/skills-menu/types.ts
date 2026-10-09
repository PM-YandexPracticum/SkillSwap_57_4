import type { SkillCategory, SkillCategoryId } from '@/shared/types'
import type { ComponentType, SVGProps } from 'react'

export interface SkillsMenuProps {
  categories: SkillCategory[]
  onSelect: (subcategoryId: string) => void
  id?: string
  className?: string
}

export interface SkillsMenuColumnProps {
  categories: SkillCategory[]
  onSelect: SkillsMenuProps['onSelect']
}

export type SkillCategoryIcons = Record<SkillCategoryId, ComponentType<SVGProps<SVGSVGElement>>>
