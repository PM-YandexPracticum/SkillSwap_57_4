import { clsx } from 'clsx'
import { SkillDetails } from '@/entities/skill'
import { Button } from '@/shared/ui/button'
import { IconButton } from '@/shared/ui/icon-button'
import { LikeButton } from '@/shared/ui/like-button'
import { ClockIcon, ShareIcon, MoreSquareIcon } from '@/shared/assets/icons'
import styles from './skill-offer.module.css'
import type { SkillOfferProps } from './types'

export const SkillOffer = ({
  title,
  description,
  categoryName,
  subcategoryName,
  images,
  likesCount,
  isLiked = false,
  onLikeToggle,
  onProposeExchange,
  isExchangeProposed = false,
  canProposeExchange = true,
  className,
}: SkillOfferProps) => {
  // Повторного предложения нет: кнопка остаётся активной, но клик ничего не делает
  const exchangeButton = isExchangeProposed ? (
    <Button className={styles.proposed} variant="secondary" leftIcon={<ClockIcon />} fullWidth>
      Обмен предложен
    </Button>
  ) : (
    <Button fullWidth onClick={onProposeExchange}>
      Предложить обмен
    </Button>
  )

  return (
    <article className={clsx(styles.skillOffer, className)}>
      <div className={styles.controls}>
        <LikeButton count={likesCount} isLiked={isLiked} onClick={onLikeToggle} />
        <IconButton icon={<ShareIcon />} aria-label="Поделиться" />
        <IconButton icon={<MoreSquareIcon />} aria-label="Ещё" />
      </div>

      <SkillDetails
        className={styles.details}
        title={title}
        categoryName={categoryName}
        subcategoryName={subcategoryName}
        description={description}
        images={images}
        actions={canProposeExchange && exchangeButton}
      />
    </article>
  )
}
