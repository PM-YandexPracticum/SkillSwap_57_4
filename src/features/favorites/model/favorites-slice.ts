import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { FavoritesByUser, loadFavorites } from './favorites-storage';

export type FavoritesState = {
  byUser: FavoritesByUser;
};


const initialState = (): FavoritesState => ({
  byUser: loadFavorites(),
});

const favoritesSlice = createSlice({
  name: 'favorites',
  initialState,
  reducers: {
    toggleFavorite: (
      state,
      action: PayloadAction<{ userId: string; targetId: string }>
    ) => {
      const { userId, targetId } = action.payload;

      if (!state.byUser[userId]) {
        state.byUser[userId] = [];
      }

      const userFavorites = state.byUser[userId];
      const index = userFavorites.indexOf(targetId);

      if (index !== -1) {
        
        userFavorites.splice(index, 1);
      } else {
        
        userFavorites.push(targetId);
      }
    },
  },
});

export const { toggleFavorite } = favoritesSlice.actions;
export const favoritesReducer = favoritesSlice.reducer;
