import type { UnknownAction } from '@reduxjs/toolkit'
import { describe, expect, test } from 'vitest'

import {
  catalogFiltersReducer,
  resetFilters,
  selectSubcategory,
  setFilters,
  toggleCategoryOpened,
  toggleShowAllCategories,
  toggleShowAllCities,
} from './catalog-filters-slice'
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

const INITIAL_STATE = catalogFiltersReducer(undefined, { type: 'unknown' })

const applyActions = (...actions: UnknownAction[]) =>
  actions.reduce(catalogFiltersReducer, INITIAL_STATE)

const withOpenedSidebar = () =>
  applyActions(
    setFilters(CUSTOM_FILTERS),
    toggleCategoryOpened('creativity'),
    toggleShowAllCategories(),
    toggleShowAllCities(),
  )

describe('[catalogFiltersSlice]', () => {
  test('начальное состояние - фильтры по умолчанию, в сайдбаре всё свёрнуто', () => {
    expect(INITIAL_STATE).toEqual({
      filters: DEFAULT_FILTERS,
      openedCategoryIds: [],
      showAllCategories: false,
      showAllCities: false,
    })
  })

  describe('setFilters', () => {
    test('заменяет фильтры целиком', () => {
      const state = applyActions(setFilters(OTHER_FILTERS), setFilters(CUSTOM_FILTERS))
      expect(state.filters).toEqual(CUSTOM_FILTERS)
    })

    test('фильтры по умолчанию снимают весь выбор, раскрытое остаётся', () => {
      const opened = withOpenedSidebar()
      const state = catalogFiltersReducer(opened, setFilters(DEFAULT_FILTERS))

      expect(state).toEqual({ ...opened, filters: DEFAULT_FILTERS })
    })
  })

  describe('resetFilters', () => {
    test('возвращает DEFAULT_FILTERS и не сворачивает раскрытое', () => {
      const opened = withOpenedSidebar()
      const state = catalogFiltersReducer(opened, resetFilters())

      expect(state).toEqual({ ...opened, filters: DEFAULT_FILTERS })
    })
  })

  describe('toggleCategoryOpened', () => {
    test('раскрывает свёрнутую категорию', () => {
      const state = applyActions(toggleCategoryOpened('creativity'))
      expect(state.openedCategoryIds).toEqual(['creativity'])
    })

    test('сворачивает раскрытую, остальные раскрытые не трогает', () => {
      const state = applyActions(
        toggleCategoryOpened('creativity'),
        toggleCategoryOpened('languages'),
        toggleCategoryOpened('creativity'),
      )
      expect(state.openedCategoryIds).toEqual(['languages'])
    })

    test('фильтры не меняет', () => {
      const state = applyActions(setFilters(CUSTOM_FILTERS), toggleCategoryOpened('creativity'))
      expect(state.filters).toEqual(CUSTOM_FILTERS)
    })
  })

  test('toggleShowAllCategories раскрывает и сворачивает все категории', () => {
    const opened = applyActions(toggleShowAllCategories())
    const closed = catalogFiltersReducer(opened, toggleShowAllCategories())

    expect(opened.showAllCategories).toBe(true)
    expect(closed.showAllCategories).toBe(false)
    expect(opened.showAllCities).toBe(false)
  })

  test('toggleShowAllCities раскрывает и сворачивает все города', () => {
    const opened = applyActions(toggleShowAllCities())
    const closed = catalogFiltersReducer(opened, toggleShowAllCities())

    expect(opened.showAllCities).toBe(true)
    expect(closed.showAllCities).toBe(false)
    expect(opened.showAllCategories).toBe(false)
  })

  describe('selectSubcategory', () => {
    const ENGLISH = { categoryId: 'languages', subcategoryId: 'english' } as const
    const PHOTOGRAPHY = { categoryId: 'creativity', subcategoryId: 'photography' } as const

    test('выбрана только эта подкатегория, остальные фильтры сброшены', () => {
      const state = applyActions(setFilters(CUSTOM_FILTERS), selectSubcategory(ENGLISH))
      expect(state.filters).toEqual({ ...DEFAULT_FILTERS, subcategoryIds: ['english'] })
    })

    test('раскрыта только её категория, остальные свёрнуты', () => {
      const opened = withOpenedSidebar()
      const state = catalogFiltersReducer(opened, selectSubcategory(ENGLISH))

      expect(state.openedCategoryIds).toEqual(['languages'])
      expect(state.showAllCategories).toBe(true)
      expect(state.showAllCities).toBe(true)
    })

    test('следующий выбор из другой категории сворачивает прошлую', () => {
      const state = applyActions(selectSubcategory(ENGLISH), selectSubcategory(PHOTOGRAPHY))

      expect(state.filters.subcategoryIds).toEqual(['photography'])
      expect(state.openedCategoryIds).toEqual(['creativity'])
    })
  })
})
