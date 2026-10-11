import clsx from 'clsx'
import { Button } from '@/shared/ui/button'
import { LikeButton } from '@/shared/ui/like-button'
import { Tag } from '@/shared/ui/tag'
import { UserInfo } from '../user-info/user-info'
import type { UserCardProps } from './types'
import styles from './user-card.module.css'

export const UserCard = ({
  data,
  variant = 'catalog',
  titleAs = 'h3',
  isLiked,
  onLikeToggle,
  onDetailsClick,
  className,
}: UserCardProps) => {
  const isCatalog = variant === 'catalog'
  const isAuthor = variant === 'author'

  const visibleLearnTags = isCatalog ? data.learnTags.slice(0, 2) : data.learnTags
  const hiddenCount = isCatalog ? Math.max(0, data.learnTags.length - 2) : 0

  return (
    <article className={clsx(styles.card, styles[variant], className)}>
      <div className={styles.header}>
        <UserInfo
          name={data.name}
          avatarUrl={data.avatarUrl}
          subtitle={data.subtitle}
          nameAs={titleAs}
        />
        {isCatalog && (
          <LikeButton isLiked={isLiked} likesCount={data.likesCount} onClick={onLikeToggle} />
        )}
      </div>

      {isAuthor && data.about && <p className={styles.about}>{data.about}</p>}

      <dl className={styles.skillsList}>
        <div className={styles.skillGroup}>
          <dt className={styles.skillTitle}>Может научить:</dt>
          <dd className={styles.teachTag}>
            <Tag category={data.teachTag.category} label={data.teachTag.label} />
          </dd>
        </div>

        {data.learnTags.length > 0 && (
          <div className={styles.skillGroup}>
            <dt className={styles.skillTitle}>Хочет научиться:</dt>
            <div className={styles.learnTags}>
              {visibleLearnTags.map((tag) => (
                <dd key={tag.id}>
                  <Tag category={tag.category} label={tag.label} />
                </dd>
              ))}
              {hiddenCount > 0 && (
                <span>
                  <Tag category="more" label={`+${hiddenCount}`} />
                </span>
              )}
            </div>
          </div>
        )}
      </dl>

      {isCatalog && (
        <Button fullWidth onClick={onDetailsClick}>
          Подробнее
        </Button>
      )}
    </article>
  )
}
