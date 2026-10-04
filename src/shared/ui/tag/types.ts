import { SkillCategoryId } from '../../types'

export type TagCategory = SkillCategoryId | 'more'

export type TagProps = {
  category: TagCategory
  label: string
}
