import { getAge, formatAge } from '@/shared/lib/helpers'
import { findSubcategory, SkillCategory } from '@/shared/lib/skills'
import { User, UserCardData, CardTag } from '../model/types'

export interface City {
  id: string
  name: string
}

export const toUserCardData = (
  user: User,
  categories: SkillCategory[],
  cities: City[],
  currentDate: Date,
): UserCardData => {
  const cityName = cities.find((c) => c.id === user.cityId)?.name

  const age = user.birthDate ? getAge(user.birthDate, currentDate) : null
  const ageStr = age !== null ? formatAge(age) : null

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

  return {
    id: user.id,
    skillId: user.teachSkill.id,
    name: user.name,
    avatarUrl: user.avatarUrl,
    subtitle,
    about: user.about,
    likesCount: user.likesCount,
    teachTag: {
      id: user.teachSkill.id,
      label: user.teachSkill.title,
      category: user.teachSkill.categoryId,
    },
    learnTags,
  }
}
