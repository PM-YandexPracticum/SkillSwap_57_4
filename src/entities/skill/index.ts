export type * from './model/types'
export { loadSkillCategories, skillCategoriesReducer } from './model/skill-categories-slice'
export {
  selectSkillCategories,
  selectSkillCategoriesStatus,
  selectSkillCategoriesError,
} from './model/selectors'

export { SkillDetails } from './ui/skill-details/skill-details'
export type { SkillDetailsProps } from './ui/skill-details/types'
