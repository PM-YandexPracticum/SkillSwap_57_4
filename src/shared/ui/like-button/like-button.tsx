import clsx from 'clsx'
import { forwardRef } from 'react'
import { IconButton } from '@/shared/ui/icon-button'
import { LikeIcon, LikeFilledIcon } from '@/shared/assets/icons'
import type { LikeButtonProps } from './types'
import styles from './like-button.module.css'

export const LikeButton = forwardRef<HTMLButtonElement, LikeButtonProps>(function LikeButton(
  { isLiked = false, count = 0, className, ...buttonProps },
  ref,
) {
  const Icon = isLiked ? LikeFilledIcon : LikeIcon

  return (
    <div className={clsx(styles.wrapper, className)}>
      <span className={styles.count}>{count}</span>
      <IconButton
        {...buttonProps}
        ref={ref}
        icon={<Icon />}
        aria-label="Нравится"
        aria-pressed={isLiked}
        className={clsx(isLiked && styles.liked)}
      />
    </div>
  )
})
