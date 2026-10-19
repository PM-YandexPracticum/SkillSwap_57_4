import clsx from 'clsx'
import { ClockIcon } from '@/shared/assets/icons'
import { Button } from '@/shared/ui/button'
import { LikeButton } from '@/shared/ui/like-button'
import { Tag } from '@/shared/ui/tag'
import { UserInfo } from '../user-info/user-info'
import type { UserCardProps } from './types'
import styles from './user-card.module.css'

const VISIBLE_TAGS_LIMIT = 2

export const UserCard = ({
  data,
  variant = 'catalog',
  titleAs = 'h3',
  isLiked = false,
  onLikeToggle,
  onDetailsClick,
  isExchangeProposed = false,
  className,
}: UserCardProps) => {
  const isCatalog = variant === 'catalog'
  const isAuthor = variant === 'author'

  const visibleLearnTags = isCatalog ? data.learnTags.slice(0, VISIBLE_TAGS_LIMIT) : data.learnTags

  const hiddenCount = data.learnTags.length - visibleLearnTags.length

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
          <LikeButton
            className={styles.like}
            isLiked={isLiked}
            count={data.likesCount}
            onClick={onLikeToggle}
          />
        )}
        {isAuthor && data.about && <p>{data.about}</p>}
      </div>

      <dl className={styles.skills}>
        <div className={styles.block}>
          <dt className={styles.label}>Может научить:</dt>
          <dd className={styles.tags}>
            <Tag category={data.teachTag.category} label={data.teachTag.label} />
          </dd>
        </div>

        {data.learnTags.length > 0 && (
          <div className={styles.block}>
            <dt className={styles.label}>Хочет научиться:</dt>
            <dd className={clsx(styles.tags, styles.learnTags, isCatalog && styles.oneLine)}>
              {visibleLearnTags.map((tag) => (
                <Tag key={tag.id} category={tag.category} label={tag.label} />
              ))}
              {hiddenCount > 0 && (
                <span className={styles.more}>
                  <Tag category="more" label={`+${hiddenCount}`} />
                </span>
              )}
            </dd>
          </div>
        )}
      </dl>

      {isCatalog &&
        (isExchangeProposed ? (
          <Button
            className={styles.details}
            variant="secondary"
            leftIcon={<ClockIcon />}
            fullWidth
            onClick={onDetailsClick}
          >
            Обмен предложен
          </Button>
        ) : (
          <Button className={styles.details} fullWidth onClick={onDetailsClick}>
            Подробнее
          </Button>
        ))}
    </article>
  )
}
