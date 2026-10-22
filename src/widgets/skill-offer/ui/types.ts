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
  /** Обмен уже предложен: вместо "Предложить обмен" — "Обмен предложен", клик ничего не делает */
  isExchangeProposed?: boolean
  /** `false` на своём навыке: кнопки обмена нет */
  canProposeExchange?: boolean
  className?: string
}
