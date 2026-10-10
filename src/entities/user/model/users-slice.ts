import { createSlice } from '@reduxjs/toolkit'
import { fetchUsers } from '@/api/users'

import type { LoadingStatus, User } from '@/shared/types'
import { createTypedAsyncThunk } from '@/shared/lib/create-typed-async-thunk'

export type UsersState = {
  items: User[]
  status: LoadingStatus
  error: string | null
}

const initialState: UsersState = {
  items: [],
  status: 'idle',
  error: null,
}

export const loadUsers = createTypedAsyncThunk('users/load', () => fetchUsers(), {
  condition: (_, { getState }) => {
    const { status } = getState().users
    return status === 'idle' || status === 'failed'
  },
})

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loadUsers.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(loadUsers.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.items = action.payload
      })
      .addCase(loadUsers.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message ?? 'Не удалось загрузить пользователей'
      })
  },
})

export const usersReducer = usersSlice.reducer
