import { combineReducers, configureStore } from '@reduxjs/toolkit'

import { usersReducer } from '@/entities/user'
import { citiesReducer } from '@/entities/city'
import { skillCategoriesReducer } from '@/entities/skill'
import { sessionReducer } from '@/entities/session'

const rootReducer = combineReducers({
  users: usersReducer,
  cities: citiesReducer,
  skillCategories: skillCategoriesReducer,
  session: sessionReducer,
})

export type RootState = ReturnType<typeof rootReducer>

export const setupStore = (preloadedState?: Partial<RootState>) =>
  configureStore({ reducer: rootReducer, preloadedState })

export const store = setupStore()

export type AppStore = ReturnType<typeof setupStore>
export type AppDispatch = AppStore['dispatch']
