import { describe, expect, test } from 'vitest'

import type { RootState } from '@/store'

import {
  catalogFiltersReducer,
  setFilters,
  toggleCategoryOpened,
  toggleShowAllCategories,
  toggleShowAllCities,
  type CatalogFiltersState,
} from './catalog-filters-slice'
import type { CatalogFilters } from './filters'
import {
  selectCatalogFilters,
  selectOpenedCategoryIds,
  selectShowAllCategories,
  selectShowAllCities,
} from './selectors'

const FILTERS: CatalogFilters = {
  mode: 'teach',
  subcategoryIds: ['photography'],
  gender: 'any',
  cityIds: ['sochi'],
}

const INITIAL_STATE = catalogFiltersReducer(undefined, { type: 'unknown' })

const toRootState = (catalogFilters: CatalogFiltersState) => ({ catalogFilters }) as RootState

describe('[selectCatalogFilters]', () => {
  test('возвращает фильтры из состояния', () => {
    const state = toRootState(catalogFiltersReducer(INITIAL_STATE, setFilters(FILTERS)))
    expect(selectCatalogFilters(state)).toBe(FILTERS)
  })

  test('отражает фильтры после setFilters', () => {
    const state = toRootState(catalogFiltersReducer(undefined, setFilters(FILTERS)))
    expect(selectCatalogFilters(state)).toEqual(FILTERS)
  })
})

describe('[selectOpenedCategoryIds]', () => {
  test('сначала пустой список', () => {
    expect(selectOpenedCategoryIds(toRootState(INITIAL_STATE))).toEqual([])
  })

  test('возвращает раскрытые категории', () => {
    const opened = catalogFiltersReducer(INITIAL_STATE, toggleCategoryOpened('creativity'))
    const state = toRootState(catalogFiltersReducer(opened, toggleCategoryOpened('languages')))

    expect(selectOpenedCategoryIds(state)).toEqual(['creativity', 'languages'])
  })
})

describe('[selectShowAllCategories]', () => {
  test('сначала false, после toggleShowAllCategories - true', () => {
    const state = toRootState(catalogFiltersReducer(INITIAL_STATE, toggleShowAllCategories()))

    expect(selectShowAllCategories(toRootState(INITIAL_STATE))).toBe(false)
    expect(selectShowAllCategories(state)).toBe(true)
  })
})

describe('[selectShowAllCities]', () => {
  test('сначала false, после toggleShowAllCities - true', () => {
    const state = toRootState(catalogFiltersReducer(INITIAL_STATE, toggleShowAllCities()))

    expect(selectShowAllCities(toRootState(INITIAL_STATE))).toBe(false)
    expect(selectShowAllCities(state)).toBe(true)
  })
})
