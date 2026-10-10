import { createAsyncThunk } from '@reduxjs/toolkit'
import type { AppDispatch, RootState } from '.'

export const createTypedAsyncThunk = createAsyncThunk.withTypes<{
  state: RootState
  dispatch: AppDispatch
}>()
