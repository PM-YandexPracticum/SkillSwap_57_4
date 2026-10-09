import { createSelector } from '@reduxjs/toolkit'
import type { RootState } from '@/store'

export const selectUsers = (state: RootState) => state.users.items
export const selectUsersStatus = (state: RootState) => state.users.status
export const selectUsersError = (state: RootState) => state.users.error

export const selectUserById = (state: RootState, id: string) =>
  state.users.items.find((user) => user.id === id)
export const selectUserBySkillId = (state: RootState, skillId: string) =>
  state.users.items.find((user) => user.teachSkill.id === skillId)

export const selectPopularUsers = createSelector([selectUsers], (users) =>
  [...users].sort((a, b) => b.likesCount - a.likesCount),
)
export const selectNewestUsers = createSelector([selectUsers], (users) =>
  [...users].sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt)),
)
