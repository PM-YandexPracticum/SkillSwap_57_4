import type { RootState } from '@/store'

export const selectCities = (state: RootState) => state.cities.items
export const selectCitiesStatus = (state: RootState) => state.cities.status
export const selectCitiesError = (state: RootState) => state.cities.error
