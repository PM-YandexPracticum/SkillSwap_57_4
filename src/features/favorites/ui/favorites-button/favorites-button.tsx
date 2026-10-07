import { LikeFilledIcon, LikeIcon } from '@/shared/assets/icons'
import { IconButton } from '@/shared/ui/icon-button'
import type { FavoritesButtonProps } from './types'
import styles from './favorites-button.module.css'

export const FavoritesButton = ({ isActive = false, onClick }: FavoritesButtonProps) => {
  const Icon = isActive ? LikeFilledIcon : LikeIcon

  return (
    <IconButton
      icon={<Icon />}
      aria-label="Избранное"
      aria-current={isActive ? 'page' : undefined}
      className={isActive ? styles.active : undefined}
      onClick={onClick}
    />
  )
}
