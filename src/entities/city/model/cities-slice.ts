import { createSlice } from '@reduxjs/toolkit'
import { fetchCities } from '@/api/cities'

import type { LoadingStatus, City } from '@/shared/types'
import { createTypedAsyncThunk } from '@/shared/lib/create-typed-async-thunk'

export type CitiesState = {
  items: City[]
  status: LoadingStatus
  error: string | null
}

const initialState: CitiesState = {
  items: [],
  status: 'idle',
  error: null,
}

export const loadCities = createTypedAsyncThunk('cities/load', () => fetchCities(), {
  condition: (_, { getState }) => {
    const { status } = getState().cities
    return status === 'idle' || status === 'failed'
  },
})

const citiesSlice = createSlice({
  name: 'cities',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loadCities.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(loadCities.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.items = action.payload
      })
      .addCase(loadCities.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message ?? 'Не удалось загрузить города'
      })
  },
})

export const citiesReducer = citiesSlice.reducer
