import { createSelector } from '@reduxjs/toolkit'
import type { RootState } from '@/store'

const NO_SKILL_IDS: string[] = []

const selectItems = (state: RootState) => state.requests.items
const selectUserId = (_state: RootState, userId: string | undefined) => userId

/** `id` навыков, которым пользователь уже предложил обмен; у гостя — всегда один и тот же `[]` */
export const selectProposedSkillIds = createSelector(
  [selectItems, selectUserId],
  (items, userId) =>
    userId
      ? items.filter((request) => request.fromUserId === userId).map((request) => request.skillId)
      : NO_SKILL_IDS,
)
