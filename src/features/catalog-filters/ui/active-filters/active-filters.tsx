import clsx from 'clsx'

import { useAppDispatch, useAppSelector } from '@/store/hooks'

import { selectSkillCategories } from '@/entities/skill'
import { selectCities } from '@/entities/city'
import { selectCatalogFilters } from '../../model/selectors'
import { getFilterChips, type FilterChip } from '../../model/filter-chips'
import { setFilters } from '../../model/catalog-filters-slice'
import { Button } from '@/shared/ui/button'
import { CrossIcon } from '@/shared/assets/icons'
import type { ActiveFiltersProps } from './types'

import styles from './active-filters.module.css'

export const ActiveFilters = ({ className }: ActiveFiltersProps) => {
  const dispatch = useAppDispatch()

  const filters = useAppSelector(selectCatalogFilters)
  const categories = useAppSelector(selectSkillCategories)
  const cities = useAppSelector(selectCities)

  const chips = getFilterChips(filters, categories, cities)
  const disableFilter = (chip: FilterChip) => dispatch(setFilters(chip.filtersWithout))

  if (chips.length < 1) return null

  return (
    <ul className={clsx(styles.list, className)}>
      {chips.map((chip) => (
        <li key={chip.key}>
          <Button
            variant="tertiary"
            rightIcon={<CrossIcon />}
            aria-label={`Убрать фильтр: ${chip.label}`}
            onClick={() => disableFilter(chip)}
          >
            {chip.label}
          </Button>
        </li>
      ))}
    </ul>
  )
}
