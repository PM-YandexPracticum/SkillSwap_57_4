import { createSelector } from '@reduxjs/toolkit'
import type { RootState } from '@/store'
import { selectUser } from '@/entities/session'

const NO_FAVORITES: string[] = []

const selectFavoritesByUser = (state: RootState) => state.favorites.byUser

export const selectFavoriteIds = createSelector(
  [selectUser, selectFavoritesByUser],
  (user, byUser) => (user ? (byUser[user.id] ?? NO_FAVORITES) : NO_FAVORITES),
)

export const selectLocalLikes = createSelector([selectFavoritesByUser], (byUser) => {
  const likes: Record<string, number> = {}

  Object.values(byUser).forEach((ids) => {
    ids.forEach((id) => {
      likes[id] = (likes[id] ?? 0) + 1
    })
  })

  return likes
})
