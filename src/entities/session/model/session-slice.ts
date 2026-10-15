import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import { getAuthUser } from './auth-utils'
import type { AuthUser } from '@/shared/types'

export type SessionState = {
  user: AuthUser | null
}

const sessionSlice = createSlice({
  name: 'session',
  initialState: (): SessionState => ({ user: getAuthUser() }),
  reducers: {
    setSessionUser: (state, action: PayloadAction<AuthUser | null>) => {
      state.user = action.payload
    },
  },
})

export const { setSessionUser } = sessionSlice.actions
export const sessionReducer = sessionSlice.reducer
