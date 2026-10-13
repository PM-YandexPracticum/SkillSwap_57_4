import { Gender, SkillType } from '@/shared/types'
import { RadioGroupOption } from '@/shared/ui/radio-group'

export type FilterMode = SkillType | 'all'
export type FilterGender = Gender | 'any'

export interface CatalogFilters {
  mode: FilterMode
  subcategoryIds: string[]
  gender: FilterGender
  cityIds: string[]
}

export const DEFAULT_FILTERS: CatalogFilters = {
  mode: 'all',
  subcategoryIds: [],
  gender: 'any',
  cityIds: [],
}

export const FILTER_MODE_OPTIONS: RadioGroupOption<FilterMode>[] = [
  { value: 'all', label: 'Всё' },
  { value: 'learn', label: 'Хочу научиться' },
  { value: 'teach', label: 'Могу научить' },
]

export const FILTER_GENDER_OPTIONS: RadioGroupOption<FilterGender>[] = [
  { value: 'any', label: 'Не имеет значения' },
  { value: 'male', label: 'Мужской' },
  { value: 'female', label: 'Женский' },
]

/**
 * Считает количество активных фильтров:
 *
 * режим и пол - добавляет `1`, если выбрано что-то отличное от дефолтных значений;
 * города и подкатегории добавляет по кол-ву выбранных опций
 */
export function countActiveFilters(filters: CatalogFilters): number {
  return (
    +(filters.mode !== 'all') +
    +(filters.gender !== 'any') +
    filters.subcategoryIds.length +
    filters.cityIds.length
  )
}
