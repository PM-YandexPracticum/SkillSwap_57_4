import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

export type CatalogSearchState = {
  search: string
}

const initialState: CatalogSearchState = {
  search: '',
}

const catalogSearchSlice = createSlice({
  name: 'catalogSearch',
  initialState,
  reducers: {
    setSearch: (state, action: PayloadAction<string>) => {
      state.search = action.payload
    },
  },
})

export const { setSearch } = catalogSearchSlice.actions
export const catalogSearchReducer = catalogSearchSlice.reducer
