import { describe, expect, test } from 'vitest'

import type { RootState } from '@/store'

import { catalogFiltersReducer, setFilters } from './catalog-filters-slice'
import type { CatalogFilters } from './filters'
import { selectCatalogFilters } from './selectors'

const FILTERS: CatalogFilters = {
  mode: 'teach',
  subcategoryIds: ['photography'],
  gender: 'any',
  cityIds: ['sochi'],
}

describe('[selectCatalogFilters]', () => {
  test('возвращает фильтры из состояния', () => {
    const state = { catalogFilters: { filters: FILTERS } } as RootState
    expect(selectCatalogFilters(state)).toBe(FILTERS)
  })

  test('отражает фильтры после setFilters', () => {
    const catalogFilters = catalogFiltersReducer(undefined, setFilters(FILTERS))
    const state = { catalogFilters } as RootState
    expect(selectCatalogFilters(state)).toEqual(FILTERS)
  })
})
