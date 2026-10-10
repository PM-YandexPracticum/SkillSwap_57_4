import { createSlice } from '@reduxjs/toolkit'
import { fetchSkillCategories } from '@/api/skills'

import type { LoadingStatus, SkillCategory } from '@/shared/types'
import { createTypedAsyncThunk } from '@/store/helpers'

export type SkillCategoriesState = {
  items: SkillCategory[]
  status: LoadingStatus
  error: string | null
}

const initialState: SkillCategoriesState = {
  items: [],
  status: 'idle',
  error: null,
}

export const loadSkillCategories = createTypedAsyncThunk(
  'skillCategories/load',
  () => fetchSkillCategories(),
  {
    condition: (_, { getState }) => {
      const { status } = getState().skillCategories
      return status === 'idle' || status === 'failed'
    },
  },
)

const skillCategoriesSlice = createSlice({
  name: 'skillCategories',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loadSkillCategories.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(loadSkillCategories.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.items = action.payload
      })
      .addCase(loadSkillCategories.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message ?? 'Не удалось загрузить категории навыков'
      })
  },
})

export const skillCategoriesReducer = skillCategoriesSlice.reducer
