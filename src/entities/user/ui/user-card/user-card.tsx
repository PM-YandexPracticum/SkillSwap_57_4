import clsx from 'clsx'
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
            className={styles['like-button']}
            isLiked={isLiked}
            likesCount={data.likesCount}
            onClick={onLikeToggle}
          />
        )}
      </div>

      {isAuthor && data.about && <p className={styles.about}>{data.about}</p>}

      <dl className={styles['skills-list']}>
        <div className={styles['skill-group']}>
          <dt className={styles['skill-title']}>Может научить:</dt>
          <dd className={styles['teach-tag']}>
            <Tag category={data.teachTag.category} label={data.teachTag.label} />
          </dd>
        </div>

        {data.learnTags.length > 0 && (
          <div className={styles['skill-group']}>
            <dt className={styles['skill-title']}>Хочет научиться:</dt>
            <dd
              className={clsx(styles.tags, styles['learn-tags'], isCatalog && styles['one-line'])}
            >
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

      {isCatalog && (
        <Button fullWidth onClick={onDetailsClick}>
          Подробнее
        </Button>
      )}
    </article>
  )
}
