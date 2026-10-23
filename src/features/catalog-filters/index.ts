export { SkillsFilter } from './ui/skills-filter/skills-filter'
export type { SkillsFilterProps } from './ui/skills-filter/types'

export { CitiesFilter } from './ui/cities-filter/cities-filter'
export type { CitiesFilterProps } from './ui/cities-filter/types'

export { ActiveFilters } from './ui/active-filters/active-filters'
export type { ActiveFiltersProps } from './ui/active-filters/types'

export {
  DEFAULT_FILTERS,
  FILTER_MODE_OPTIONS,
  FILTER_GENDER_OPTIONS,
  countActiveFilters,
  isCatalogFiltered,
} from './model/filters'
export type { CatalogFilters, FilterMode, FilterGender } from './model/filters'
export { filterUsers } from './model/filter-users'

export { catalogFiltersReducer, setFilters, selectSubcategory } from './model/catalog-filters-slice'
export { selectCatalogFilters } from './model/selectors'

export { getFilterChips, type FilterChip } from './model/filter-chips'
