import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import { loadFavorites, type FavoritesByUser } from './favorites-storage'

export type FavoritesState = {
  byUser: FavoritesByUser
}

const initialState = (): FavoritesState => ({
  byUser: loadFavorites(),
})

const favoritesSlice = createSlice({
  name: 'favorites',
  initialState,
  reducers: {
    toggleFavorite: (state, action: PayloadAction<{ userId: string; targetId: string }>) => {
      const { userId, targetId } = action.payload
      const ids = state.byUser[userId] ?? []

      state.byUser[userId] = ids.includes(targetId)
        ? ids.filter((id) => id !== targetId)
        : [...ids, targetId]
    },
  },
})

export const { toggleFavorite } = favoritesSlice.actions
export const favoritesReducer = favoritesSlice.reducer
