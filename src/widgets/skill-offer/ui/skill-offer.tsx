import clsx from 'clsx'
import { Button } from '@/shared/ui/button'
import { LikeButton } from '@/shared/ui/like-button'
import { IconButton } from '@/shared/ui/icon-button'
import { ShareIcon } from '@/shared/assets/icons/share-icon'
import { MoreSquareIcon } from '@/shared/assets/icons/more-square-icon'
import { SkillDetails } from '@/entities/skill'
import type { SkillOfferProps } from './types'
import styles from './skill-offer.module.css'

export const SkillOffer = ({
  title,
  description,
  categoryName,
  subcategoryName,
  images,
  likesCount = 0,
  isLiked = false,
  onLikeToggle,
  onProposeExchange,
  className,
}: SkillOfferProps) => {
  return (
    <article className={clsx(styles.widget, className)}>
      <header className={styles.header}>
        <LikeButton isLiked={isLiked} likesCount={likesCount} onClick={onLikeToggle} />
        <IconButton>
          <ShareIcon />
        </IconButton>
        <IconButton>
          <MoreSquareIcon />
        </IconButton>
      </header>

      <SkillDetails
        title={title}
        description={description}
        categoryName={categoryName}
        subcategoryName={subcategoryName}
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
