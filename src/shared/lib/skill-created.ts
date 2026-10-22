import { SESSION_STORAGE_KEYS } from '@/shared/lib/constants'

export const markSkillCreated = (): void => {
  try {
    sessionStorage.setItem(SESSION_STORAGE_KEYS.SKILL_CREATED, 'true')
  } catch {
    // Хранилище недоступно: окно просто не покажется
  }
}

export const isSkillCreated = (): boolean => {
  try {
    return sessionStorage.getItem(SESSION_STORAGE_KEYS.SKILL_CREATED) === 'true'
  } catch {
    return false
  }
}

export const clearSkillCreated = (): void => {
  try {
    sessionStorage.removeItem(SESSION_STORAGE_KEYS.SKILL_CREATED)
  } catch {
    // Хранилище недоступно: отметки там и нет
  }
}
