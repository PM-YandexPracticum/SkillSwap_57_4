import type { UserCardData } from '../../model/types'

export interface UserCardProps {
  data: UserCardData
  variant?: 'catalog' | 'author'
  titleAs?: 'h2' | 'h3'
  isLiked?: boolean
  onLikeToggle?: () => void
  onDetailsClick?: () => void
  /** Обмен уже предложен: вместо "Подробнее" — "Обмен предложен", клик тоже открывает навык */
  isExchangeProposed?: boolean
  className?: string
}
