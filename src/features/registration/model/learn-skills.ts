import type { SkillCategory } from '@/entities/skill'

export const getSubcategoryOptions = (categories: SkillCategory[], categoryIds: string[]) =>
  categories
    .filter((category) => categoryIds.length === 0 || categoryIds.includes(category.id))
    .flatMap((category) =>
      category.subcategories.map((subcategory) => ({
        value: subcategory.id,
        label: subcategory.name,
      })),
    )

export const addCategoriesOfSkills = (
  categories: SkillCategory[],
  categoryIds: string[],
  skillIds: string[],
) => {
  const result = new Set(categoryIds)

  categories.forEach((category) => {
    if (category.subcategories.some((subcategory) => skillIds.includes(subcategory.id))) {
      result.add(category.id)
    }
  })

  return [...result]
}

export const keepSkillsOfCategories = (
  categories: SkillCategory[],
  categoryIds: string[],
  skillIds: string[],
) => {
  const allowedSkillIds = new Set(
    categories
      .filter((category) => categoryIds.includes(category.id))
      .flatMap((category) => category.subcategories.map((subcategory) => subcategory.id)),
  )

  return skillIds.filter((skillId) => allowedSkillIds.has(skillId))
}
