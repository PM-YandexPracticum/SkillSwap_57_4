import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import { DEFAULT_FILTERS, type CatalogFilters } from './filters'

export type CatalogFiltersState = {
  filters: CatalogFilters
}

const initialState: CatalogFiltersState = {
  filters: DEFAULT_FILTERS,
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
  },
})

export const { setFilters, resetFilters } = catalogFiltersSlice.actions
export const catalogFiltersReducer = catalogFiltersSlice.reducer
