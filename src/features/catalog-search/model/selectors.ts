import type { RootState } from '@/store'

export const selectSearch = (state: RootState) => state.catalogSearch.search
