export interface SkillOfferProps {
  title: string
  description: string
  categoryName: string
  subcategoryName: string
  images: string[]
  likesCount: number
  isLiked?: boolean
  onLikeToggle?: () => void
  onProposeExchange?: () => void
  className?: string
}
