import {
  DEFAULT_FILTERS,
  FILTER_GENDER_OPTIONS,
  FILTER_MODE_OPTIONS,
  type CatalogFilters,
} from './filters'
import type { City, SkillCategory } from '@/shared/types'
import { findSubcategory } from '@/shared/lib/skills'

export type FilterChip = {
  key: string
  label: string
  filtersWithout: CatalogFilters
}

const getOptionLabel = <T extends string>(
  options: readonly { value: T; label: string }[],
  value: T,
): string | undefined => options.find((option) => option.value === value)?.label

/**
 * Собирает плашки выбранных фильтров в порядке: режим - пол - подкатегории - города.
 * Режим и пол попадают в список, только если отличаются от значений по умолчанию.
 * Подкатегории и города, которых нет в заданных наборах, пропускаются.
 *
 * @param filters текущие выбранные фильтры каталога
 * @param categories набор категорий навыков с подкатегориями
 * @param cities набор городов
 * @returns плашки для показа фильтров
 */
export function getFilterChips(
  filters: CatalogFilters,
  categories: SkillCategory[],
  cities: City[],
): FilterChip[] {
  const chips: FilterChip[] = []

  if (filters.mode !== DEFAULT_FILTERS.mode) {
    const label = getOptionLabel(FILTER_MODE_OPTIONS, filters.mode)

    if (label) {
      chips.push({
        key: 'mode',
        label,
        filtersWithout: { ...filters, mode: DEFAULT_FILTERS.mode },
      })
    }
  }

  if (filters.gender !== DEFAULT_FILTERS.gender) {
    const label = getOptionLabel(FILTER_GENDER_OPTIONS, filters.gender)

    if (label) {
      chips.push({
        key: 'gender',
        label,
        filtersWithout: { ...filters, gender: DEFAULT_FILTERS.gender },
      })
    }
  }

  for (const id of filters.subcategoryIds) {
    const found = findSubcategory(id, categories)

    if (found) {
      chips.push({
        key: `subcategory:${id}`,
        label: found.subcategory.name,
        filtersWithout: {
          ...filters,
          subcategoryIds: filters.subcategoryIds.filter((item) => item !== id),
        },
      })
    }
  }

  for (const id of filters.cityIds) {
    const found = cities.find((city) => city.id === id)

    if (found) {
      chips.push({
        key: `city:${id}`,
        label: found.name,
        filtersWithout: {
          ...filters,
          cityIds: filters.cityIds.filter((item) => item !== id),
        },
      })
    }
  }

  return chips
}
