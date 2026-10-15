import { AuthUser } from '@/shared/types'
import { RootState } from '@/store'
import { ThunkAction, UnknownAction } from '@reduxjs/toolkit'
import { setSessionUser } from './session-slice'
import { clearAuthUser, saveAuthUser } from './auth-utils'

type SessionThunk = ThunkAction<void, RootState, unknown, UnknownAction>

export const login =
  (user: Omit<AuthUser, 'token'>): SessionThunk =>
  (dispatch) => {
    dispatch(setSessionUser(saveAuthUser(user)))
  }

export const logout = (): SessionThunk => (dispatch) => {
  clearAuthUser()
  dispatch(setSessionUser(null))
}
