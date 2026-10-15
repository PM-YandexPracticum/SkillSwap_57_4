import type { User } from '@/shared/types'
import type { CatalogFilters } from './filters'

/**
 * Режим 'learn' ("Хочу научиться") ищет в teachSkill.subcategoryId,
 * потому что пользователь хочет найти того, кто МОЖЕТ научить его
 * выбранной подкатегории. "Могу научить" - те, кто хочет научиться (learnSkills).
 */
function matchesSkills(user: User, { mode, subcategoryIds }: CatalogFilters): boolean {
  if (subcategoryIds.length === 0) return true

  const canTeach = subcategoryIds.includes(user.teachSkill.subcategoryId)
  const wantsToLearn = user.learnSkills.some((id) => subcategoryIds.includes(id))

  if (mode === 'learn') return canTeach
  if (mode === 'teach') return wantsToLearn
  return canTeach || wantsToLearn
}

export function filterUsers(users: User[], filters: CatalogFilters, search = ''): User[] {
  const normalizedSearch = search.trim().toLowerCase()

  return users.filter(
    (user) =>
      (filters.gender === 'any' || user.gender === filters.gender) &&
      (filters.cityIds.length === 0 || filters.cityIds.includes(user.cityId)) &&
      matchesSkills(user, filters) &&
      user.teachSkill.title.toLowerCase().includes(normalizedSearch),
  )
}
