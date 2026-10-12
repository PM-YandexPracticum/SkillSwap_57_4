export interface SkillOfferProps {
  title: string
  description: string
  category: string
  author: {
    name: string
    avatarUrl?: string | null
  }
  isLiked?: boolean
  onLikeToggle?: () => void
  onShareClick?: () => void
  onMoreClick?: () => void
  onRequestClick?: () => void
  className?: string
}
