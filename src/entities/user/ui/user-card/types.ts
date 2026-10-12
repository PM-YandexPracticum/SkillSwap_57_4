import type { UserCardData } from '../../model/types'

export interface UserCardProps {
  data: UserCardData
  variant?: 'catalog' | 'author'
  titleAs?: 'h2' | 'h3'
  isLiked?: boolean
  onLikeToggle?: () => void
  onDetailsClick?: () => void
  className?: string
}
