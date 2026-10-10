import type { SkillCategory, SkillSubcategory } from '@/shared/types'

export const findSubcategory = (
  subcategoryId: string,
  categories: SkillCategory[],
): { subcategory: SkillSubcategory; category: SkillCategory } | undefined => {
  for (const cat of categories) {
    const sub = cat.subcategories.find((item) => item.id === subcategoryId)
    if (sub) {
      return { subcategory: sub, category: cat }
    }
  }
}
