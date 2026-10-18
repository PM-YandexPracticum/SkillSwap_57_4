import type { RootState } from '@/store'

export const selectCatalogFilters = (state: RootState) => state.catalogFilters.filters
export const selectOpenedCategoryIds = (state: RootState) => state.catalogFilters.openedCategoryIds
export const selectShowAllCategories = (state: RootState) => state.catalogFilters.showAllCategories
export const selectShowAllCities = (state: RootState) => state.catalogFilters.showAllCities
