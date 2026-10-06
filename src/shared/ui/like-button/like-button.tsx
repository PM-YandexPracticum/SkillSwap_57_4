import clsx from 'clsx'
import { IconButton } from '@/shared/ui/icon-button'
import { LikeIcon, LikeFilledIcon } from '@/shared/assets/icons'
import { LikeButtonProps } from './types'
import styles from './like-button.module.css'

export const LikeButton = ({ isLiked, count, onClick, className }: LikeButtonProps) => {
  const Icon = isLiked ? LikeFilledIcon : LikeIcon

  return (
    <div className={clsx(styles.wrapper, className)}>
      <span className={styles.count}>{count}</span>
      <IconButton
        icon={<Icon />}
        aria-label="Нравится"
        aria-pressed={isLiked}
        onClick={onClick}
        className={clsx(isLiked && styles.liked)}
      />
    </div>
  )
}
