import { describe, expect, test } from 'vitest'

import { catalogFiltersReducer, resetFilters, setFilters } from './catalog-filters-slice'
import type { CatalogFiltersState } from './catalog-filters-slice'
import { DEFAULT_FILTERS } from './filters'
import type { CatalogFilters } from './filters'

const CUSTOM_FILTERS: CatalogFilters = {
  mode: 'learn',
  subcategoryIds: ['english', 'cooking'],
  gender: 'female',
  cityIds: ['moscow'],
}

describe('[catalogFiltersSlice]', () => {
  test('начальное состояние - фильтры по умолчанию', () => {
    const state = catalogFiltersReducer(undefined, { type: 'unknown' })
    expect(state).toEqual({ filters: DEFAULT_FILTERS })
  })

  describe('setFilters', () => {
    test('заменяет фильтры целиком', () => {
      const previous: CatalogFiltersState = {
        filters: {
          mode: 'teach',
          subcategoryIds: ['german'],
          gender: 'male',
          cityIds: ['kazan', 'perm'],
        },
      }

      const state = catalogFiltersReducer(previous, setFilters(CUSTOM_FILTERS))
      expect(state.filters).toEqual(CUSTOM_FILTERS)
    })

    test('с пустыми списками не сохраняет прежние значения', () => {
      const previous: CatalogFiltersState = { filters: CUSTOM_FILTERS }
      const state = catalogFiltersReducer(previous, setFilters(DEFAULT_FILTERS))
      expect(state.filters).toEqual(DEFAULT_FILTERS)
    })
  })

  describe('resetFilters', () => {
    test('возвращает DEFAULT_FILTERS', () => {
      const previous: CatalogFiltersState = { filters: CUSTOM_FILTERS }
      const state = catalogFiltersReducer(previous, resetFilters())
      expect(state.filters).toEqual(DEFAULT_FILTERS)
    })

    test('не меняет DEFAULT_FILTERS', () => {
      const snapshot = structuredClone(DEFAULT_FILTERS)
      catalogFiltersReducer({ filters: CUSTOM_FILTERS }, resetFilters())
      expect(DEFAULT_FILTERS).toEqual(snapshot)
    })
  })
})
