// Импортируй свои slice'ы здесь по мере их создания:
import { combineReducers, configureStore } from '@reduxjs/toolkit'
import { usersReducer } from '@/entities/user'

const rootReducer = combineReducers({
  users: usersReducer,
})

export type RootState = ReturnType<typeof rootReducer>

export const setupStore = (preloadedState?: Partial<RootState>) =>
  configureStore({ reducer: rootReducer, preloadedState })

export const store = setupStore()

export type AppStore = ReturnType<typeof setupStore>
export type AppDispatch = AppStore['dispatch']
