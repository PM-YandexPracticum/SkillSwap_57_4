import { SESSION_STORAGE_KEYS } from '@/shared/lib/constants'

export const loadShownToastIds = (): Set<string> => {
  try {
    const raw = sessionStorage.getItem(SESSION_STORAGE_KEYS.SHOWN_TOASTS)
    const parsed: unknown = raw ? JSON.parse(raw) : []
    const isStringArray =
      Array.isArray(parsed) && parsed.every((id): id is string => typeof id === 'string')
    return new Set(isStringArray ? parsed : [])
  } catch {
    return new Set()
  }
}

export const saveShownToastIds = (ids: Set<string>) => {
  try {
    sessionStorage.setItem(SESSION_STORAGE_KEYS.SHOWN_TOASTS, JSON.stringify([...ids]))
  } catch {
    // Хранилище недоступно: после перезагрузки всплывашки покажутся ещё раз
  }
}
