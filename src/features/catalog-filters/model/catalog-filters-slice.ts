import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { SkillCategoryId } from '@/shared/types'
import { DEFAULT_FILTERS, type CatalogFilters } from './filters'

export type CatalogFiltersState = {
  filters: CatalogFilters
  openedCategoryIds: SkillCategoryId[]
  showAllCategories: boolean
  showAllCities: boolean
}

const initialState: CatalogFiltersState = {
  filters: DEFAULT_FILTERS,
  openedCategoryIds: [],
  showAllCategories: false,
  showAllCities: false,
}

const catalogFiltersSlice = createSlice({
  name: 'catalogFilters',
  initialState,
  reducers: {
    setFilters: (state, action: PayloadAction<CatalogFilters>) => {
      state.filters = action.payload
    },
    resetFilters: (state) => {
      state.filters = DEFAULT_FILTERS
    },
    toggleCategoryOpened: (state, action: PayloadAction<SkillCategoryId>) => {
      const id = action.payload
      state.openedCategoryIds = state.openedCategoryIds.includes(id)
        ? state.openedCategoryIds.filter((item) => item !== id)
        : [...state.openedCategoryIds, id]
    },
    toggleShowAllCategories: (state) => {
      state.showAllCategories = !state.showAllCategories
    },
    toggleShowAllCities: (state) => {
      state.showAllCities = !state.showAllCities
    },
    selectSubcategory: (
      state,
      action: PayloadAction<{ categoryId: SkillCategoryId; subcategoryId: string }>,
    ) => {
      const { categoryId, subcategoryId } = action.payload
      state.filters = { ...DEFAULT_FILTERS, subcategoryIds: [subcategoryId] }
      state.openedCategoryIds = [categoryId]
    },
  },
})

export const {
  setFilters,
  resetFilters,
  toggleCategoryOpened,
  toggleShowAllCategories,
  toggleShowAllCities,
  selectSubcategory,
} = catalogFiltersSlice.actions
export const catalogFiltersReducer = catalogFiltersSlice.reducer
