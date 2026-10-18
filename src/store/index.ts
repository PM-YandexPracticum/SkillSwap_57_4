import { combineReducers, configureStore } from '@reduxjs/toolkit'

import { usersReducer } from '@/entities/user'
import { citiesReducer } from '@/entities/city'
import { skillCategoriesReducer } from '@/entities/skill'
import { sessionReducer } from '@/entities/session'
import { favoritesReducer, saveFavorites } from '@/features/favorites'
import { catalogFiltersReducer } from '@/features/catalog-filters'
import { catalogSearchReducer } from '@/features/catalog-search'

const rootReducer = combineReducers({
  users: usersReducer,
  cities: citiesReducer,
  skillCategories: skillCategoriesReducer,
  session: sessionReducer,
  favorites: favoritesReducer,
  catalogFilters: catalogFiltersReducer,
  catalogSearch: catalogSearchReducer,
})

export type RootState = ReturnType<typeof rootReducer>

export const setupStore = (preloadedState?: Partial<RootState>) =>
  configureStore({ reducer: rootReducer, preloadedState })

export const store = setupStore()

function persist<T>(select: (state: RootState) => T, save: (data: T) => void) {
  let currentValue = select(store.getState())

  store.subscribe(() => {
    const previousValue = currentValue
    currentValue = select(store.getState())

    if (previousValue !== currentValue) {
      save(currentValue)
    }
  })
}

persist((state) => state.favorites.byUser, saveFavorites)

export type AppStore = ReturnType<typeof setupStore>
export type AppDispatch = AppStore['dispatch']
