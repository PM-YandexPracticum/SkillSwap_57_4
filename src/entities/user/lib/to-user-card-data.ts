import { getAge, formatAge } from '@/shared/lib/helpers'
import { findSubcategory } from '@/shared/lib/skills'
import type { City, SkillCategory, User } from '@/shared/types'
import type { UserCardData, CardTag } from '../model/types'

export const toUserCardData = (
  user: User,
  categories: SkillCategory[],
  cities: City[],
  currentDate: Date = new Date(),
): UserCardData => {
  const cityName = cities.find((city) => city.id === user.cityId)?.name

  const age = getAge(user.birthDate, currentDate)
  const ageStr = age !== null ? formatAge(age) : undefined

  const subtitle = [cityName, ageStr].filter(Boolean).join(', ')

  const learnTags = user.learnSkills.reduce<CardTag[]>((acc, id) => {
    const found = findSubcategory(id, categories)
    if (found) {
      acc.push({
        id: found.subcategory.id,
        label: found.subcategory.name,
        category: found.category.id,
      })
    }
    return acc
  }, [])

  const { teachSkill } = user

  return {
    id: user.id,
    skillId: teachSkill.id,
    name: user.name,
    avatarUrl: user.avatarUrl,
    subtitle,
    about: user.about,
    likesCount: user.likesCount,
    teachTag: {
      id: teachSkill.id,
      label: teachSkill.title,
      category: teachSkill.categoryId,
    },
    learnTags,
  }
}
