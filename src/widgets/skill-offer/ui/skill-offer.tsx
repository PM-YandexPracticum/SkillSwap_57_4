import { clsx } from 'clsx'
import { SkillDetails } from '@/entities/skill'
import { Button } from '@/shared/ui/button'
import { IconButton } from '@/shared/ui/icon-button'
import { LikeButton } from '@/shared/ui/like-button'
import { ShareIcon, MoreSquareIcon } from '@/shared/assets/icons'
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
  className,
}: SkillOfferProps) => {
  return (
    <article className={clsx(styles.skillOffer, className)}>
      <div className={styles.controls}>
        <LikeButton count={likesCount} isLiked={isLiked} onClick={onLikeToggle} />
        <IconButton icon={<ShareIcon />} aria-label="Поделиться" />
        <IconButton icon={<MoreSquareIcon />} aria-label="Ещё" />
      </div>

      <SkillDetails
        title={title}
        categoryName={categoryName}
        subcategoryName={subcategoryName}
        description={description}
        images={images}
        actions={
          <Button fullWidth onClick={onProposeExchange}>
            Предложить обмен
          </Button>
        }
      />
    </article>
  )
}
