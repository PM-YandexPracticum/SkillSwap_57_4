import { createSelector } from '@reduxjs/toolkit'
import type { RootState } from '@/store'
import { selectUser } from '@/entities/session'

const NO_FAVORITES: string[] = []

const selectFavoritesByUser = (state: RootState) => state.favorites.byUser

export const selectFavoriteIds = createSelector(
  [selectUser, selectFavoritesByUser],
  (user, byUser) => (user ? (byUser[user.id] ?? NO_FAVORITES) : NO_FAVORITES),
)
