export interface Subcategory {
  id: string
  name: string
  [key: string]: unknown
}

export interface SkillCategory {
  id: string
  subcategories: Subcategory[]
  [key: string]: unknown
}

export const findSubcategory = (
  subcategoryId: string,
  categories: SkillCategory[],
): { subcategory: Subcategory; category: SkillCategory } | undefined => {
  for (const cat of categories) {
    const sub = cat.subcategories.find((s) => s.id === subcategoryId)
    if (sub) {
      return { subcategory: sub, category: cat }
    }
  }
}
