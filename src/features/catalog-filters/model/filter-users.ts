import type { User } from '@/shared/types'
import type { CatalogFilters } from './filters'

/**
 * Фильтрует пользователей по заданным фильтрам и строке поиска.
 *
 * Режим 'learn' ("Хочу научиться") ищет в teachSkill.subcategoryId,
 * потому что пользователь хочет найти того, кто МОЖЕТ научить его
 * выбранной подкатегории. То есть мы ищем навык, который другой
 * пользователь предлагает (teachSkill), а не тот, который он хочет
 * изучить (learnSkills).
 */
export function filterUsers(
  users: User[],
  filters: CatalogFilters,
  search = '',
): User[] {
  const normalizedSearch = search.trim().toLowerCase()

  return users.filter((user) => {

    if (filters.gender !== 'any' && user.gender !== filters.gender) {
      return false
    }

    if (filters.cityIds.length > 0 && !filters.cityIds.includes(user.cityId)) {
      return false
    }

    if (filters.subcategoryIds.length > 0) {
      const matchesLearn =
        filters.mode === 'learn' || filters.mode === 'all'
          ? filters.subcategoryIds.includes(user.teachSkill.subcategoryId)
          : false

      const matchesTeach =
        filters.mode === 'teach' || filters.mode === 'all'
          ? filters.subcategoryIds.some((id) => user.learnSkills.includes(id))
          : false

      if (!matchesLearn && !matchesTeach) {
        return false
      }
    }

    if (normalizedSearch) {
      const title = user.teachSkill.title.trim().toLowerCase()
      if (!title.includes(normalizedSearch)) {
        return false
      }
    }

    return true
  })
}