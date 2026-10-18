import { RootState } from '@/store'

export const selectCatalogFilters = (state: RootState) => state.catalogFilters.filters
