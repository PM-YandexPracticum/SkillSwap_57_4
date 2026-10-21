import type { RootState } from '@/store'
import { selectUser } from '@/entities/session'

export const selectFavoriteIds = (state: RootState): string[] => {
  const user = selectUser(state)

  if (!user) {
    return []
  }

  return state.favorites.byUser[user.id] || []
}
