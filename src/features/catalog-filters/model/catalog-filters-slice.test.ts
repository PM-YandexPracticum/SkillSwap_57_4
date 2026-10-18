import { describe, expect, test } from 'vitest'

import { catalogFiltersReducer, resetFilters, setFilters } from './catalog-filters-slice'
import { DEFAULT_FILTERS } from './filters'
import type { CatalogFilters } from './filters'

const CUSTOM_FILTERS: CatalogFilters = {
  mode: 'learn',
  subcategoryIds: ['english', 'cooking'],
  gender: 'female',
  cityIds: ['moscow'],
}

const OTHER_FILTERS: CatalogFilters = {
  mode: 'teach',
  subcategoryIds: ['german'],
  gender: 'male',
  cityIds: ['kazan', 'perm'],
}

const withFilters = (filters: CatalogFilters) =>
  catalogFiltersReducer(undefined, setFilters(filters))

describe('[catalogFiltersSlice]', () => {
  test('начальное состояние - фильтры по умолчанию', () => {
    const state = catalogFiltersReducer(undefined, { type: 'unknown' })
    expect(state.filters).toEqual(DEFAULT_FILTERS)
  })

  describe('setFilters', () => {
    test('заменяет фильтры целиком', () => {
      const state = catalogFiltersReducer(withFilters(OTHER_FILTERS), setFilters(CUSTOM_FILTERS))
      expect(state.filters).toEqual(CUSTOM_FILTERS)
    })

    test('фильтры по умолчанию снимают весь выбор', () => {
      const state = catalogFiltersReducer(withFilters(CUSTOM_FILTERS), setFilters(DEFAULT_FILTERS))
      expect(state.filters).toEqual(DEFAULT_FILTERS)
    })
  })

  describe('resetFilters', () => {
    test('возвращает DEFAULT_FILTERS', () => {
      const state = catalogFiltersReducer(withFilters(CUSTOM_FILTERS), resetFilters())
      expect(state.filters).toEqual(DEFAULT_FILTERS)
    })

    test('не меняет DEFAULT_FILTERS', () => {
      const snapshot = structuredClone(DEFAULT_FILTERS)
      catalogFiltersReducer({ filters: CUSTOM_FILTERS }, resetFilters())
      expect(DEFAULT_FILTERS).toEqual(snapshot)
    })
  })
})
