import { combineReducers, configureStore } from '@reduxjs/toolkit'
// Импортируй свои slice'ы здесь по мере их создания:
// import skillsReducer from '@/entities/skill/model/skillsSlice'
// import authReducer from '@/features/auth/model/authSlice'

const rootReducer = combineReducers({
  // skills: skillsReducer,
  // auth: authReducer,
})

export type RootState = ReturnType<typeof rootReducer>

export const setupStore = (preloadedState?: Partial<RootState>) =>
  configureStore({ reducer: rootReducer, preloadedState })

export const store = setupStore()

export type AppStore = ReturnType<typeof setupStore>
export type AppDispatch = AppStore['dispatch']
