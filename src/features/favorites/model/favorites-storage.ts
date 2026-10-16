import { LOCAL_STORAGE_KEYS } from '@/shared/lib/constants'

export type FavoritesByUser = Record<string, string[]>

const isFavoritesByUser = (value: unknown): value is FavoritesByUser => {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    return false
  }

  return Object.values(value).every(
    (arr) => Array.isArray(arr) && arr.every((item) => typeof item === 'string'),
  )
}

export const loadFavorites = (): FavoritesByUser => {
  try {
    const parsed: unknown = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEYS.FAVORITES) ?? '{}')
    return isFavoritesByUser(parsed) ? parsed : {}
  } catch {
    return {}
  }
}

export const saveFavorites = (byUser: FavoritesByUser): void => {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEYS.FAVORITES, JSON.stringify(byUser))
  } catch {
    // Хранилище переполнено или недоступно: избранное останется до перезагрузки
  }
}
