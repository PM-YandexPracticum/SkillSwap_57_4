import { generateId } from '@/shared/lib/helpers'
import type { User } from '@/shared/types'
import type { RegistrationDraft } from './draft'
import type { SkillFormValues } from './skill-schema'

// Заглушки /db/images/placeholder-N.jpg. Если будут новые - число увеличить
const PLACEHOLDER_COUNT = 7

export const buildRegisteredUser = (
  draft: RegistrationDraft,
  skill: SkillFormValues,
  now: Date = new Date(),
): User => {
  const { email, name, birthDate, gender, cityId } = draft

  if (!email || !name || !birthDate || !gender || !cityId) {
    throw new Error('Черновик регистрации заполнен не полностью')
  }

  // Поскольку сервера нет, фото не сохранить, вместо них - заглушки
  const imageCount = Math.min(skill.images.length, PLACEHOLDER_COUNT)
  const images = Array.from(
    { length: imageCount },
    (_, index) => `/db/images/placeholder-${index + 1}.jpg`,
  )

  return {
    id: generateId(),
    name,
    email,
    avatarUrl: draft.avatarUrl ?? null,
    createdAt: now.toISOString(),
    birthDate,
    gender,
    cityId,
    about: '',
    likesCount: 0,
    favorites: [],
    teachSkill: {
      id: generateId(),
      title: skill.title,
      description: skill.description,
      categoryId: skill.categoryId,
      subcategoryId: skill.subcategoryId,
      images,
    },
    learnSkills: draft.learnSkills ?? [],
  }
}
