import type { RootState } from '@/store'
import { selectUser } from '@/entities/session'

const EMPTY_ARRAY: string[] = []

export const selectFavoriteIds = (state: RootState): string[] => {
  const user = selectUser(state)

  if (!user) {
    return EMPTY_ARRAY
  }

  return state.favorites.byUser[user.id] || EMPTY_ARRAY
}
