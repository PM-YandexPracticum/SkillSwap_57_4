import { CatalogFilters } from '@/features/catalog-filters'
import type { City, SkillCategory } from '@/shared/types'

export interface FiltersSidebarProps {
  value: CatalogFilters
  onChange: (filters: CatalogFilters) => void
  categories: SkillCategory[]
  cities: City[]
  className?: string
}
