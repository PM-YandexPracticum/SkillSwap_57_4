// @ts-nocheck
import type { RootState } from '@/store'

export const selectSkillCategories = (state: RootState) => state.skillCategories.items
export const selectSkillCategoriesStatus = (state: RootState) => state.skillCategories.status
export const selectSkillCategoriesError = (state: RootState) => state.skillCategories.error
