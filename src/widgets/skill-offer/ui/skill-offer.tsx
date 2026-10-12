import clsx from 'clsx'
import { ShareIcon, MoreSquareIcon } from '@/shared/assets/icons'
import { LikeButton } from '@/shared/ui/like-button'
import type { SkillOfferProps } from './types'
import styles from './skill-offer.module.css'

export const SkillOffer = ({
  title,
  description,
  category,
  author,
  isLiked,
  onLikeToggle,
  onShareClick,
  onMoreClick,
  onRequestClick,
  className,
}: SkillOfferProps) => {
  return (
    <div className={clsx(styles.card, className)}>
      <div className={styles.header}>
        <span className={styles.category}>{category}</span>
        <div className={styles.actions}>
          <LikeButton isLiked={isLiked} onClick={onLikeToggle} />
          <button type="button" onClick={onShareClick} className={styles.iconBtn}>
            <ShareIcon />
          </button>
          <button type="button" onClick={onMoreClick} className={styles.iconBtn}>
            <MoreSquareIcon />
          </button>
        </div>
      </div>

      <h2 className={styles.title}>{title}</h2>
      <p className={styles.description}>{description}</p>

      <div className={styles.footer}>
        <div className={styles.authorInfo}>
          {author?.avatarUrl && (
            <img src={author.avatarUrl} alt={author.name} className={styles.avatar} />
          )}
          <span>{author?.name}</span>
        </div>
        <button type="button" onClick={onRequestClick} className={styles.requestBtn}>
          Откликнуться
        </button>
      </div>
    </div>
  )
}
