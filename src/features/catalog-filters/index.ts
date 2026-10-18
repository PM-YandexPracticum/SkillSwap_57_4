export { SkillsFilter } from './ui/skills-filter/skills-filter'
export type { SkillsFilterProps } from './ui/skills-filter/types'

export { CitiesFilter } from './ui/cities-filter/cities-filter'
export type { CitiesFilterProps } from './ui/cities-filter/types'

export {
  DEFAULT_FILTERS,
  FILTER_MODE_OPTIONS,
  FILTER_GENDER_OPTIONS,
  countActiveFilters,
} from './model/filters'
export type { CatalogFilters, FilterMode, FilterGender } from './model/filters'
export { filterUsers } from './model/filter-users'

export { catalogFiltersReducer, setFilters, resetFilters } from './model/catalog-filters-slice'
