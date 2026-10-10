import { AppDispatch, RootState } from '@/store'
import { createAsyncThunk } from '@reduxjs/toolkit'

export const createTypedAsyncThunk = createAsyncThunk.withTypes<{
  state: RootState
  dispatch: AppDispatch
}>()
