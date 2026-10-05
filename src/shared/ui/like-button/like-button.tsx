import clsx from 'clsx';
import { IconButton } from '../icon-button';
import { LikeIcon, LikeFilledIcon } from '../../assets/icons';
import { LikeButtonProps } from './types';
import styles from './like-button.module.css';

export const LikeButton = ({
  isLiked = false,
  count,
  onClick,
  className,
}: LikeButtonProps) => {
  const ariaLabel = isLiked ? 'Удалить из избранного' : 'Добавить в избранное';
  const Icon = isLiked ? LikeFilledIcon : LikeIcon;

  return (
    <div className={clsx(styles.wrapper, className)}>
      {count !== undefined && <span className={styles.count}>{count}</span>}
      <IconButton
        icon={<Icon aria-hidden="true" />}
        aria-label={ariaLabel}
        aria-pressed={isLiked}
        onClick={onClick}
        className={clsx(isLiked && styles.liked)}
      />
    </div>
  );
};
