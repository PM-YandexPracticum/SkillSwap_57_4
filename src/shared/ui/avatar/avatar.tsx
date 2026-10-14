import { useState } from 'react'
import clsx from 'clsx'
import { UserCircleIcon } from '@/shared/assets/icons'
import type { AvatarProps } from './types'
import styles from './avatar.module.css'

export const Avatar = ({ src, alt, size = 'm', className }: AvatarProps) => {
  const [failedSrc, setFailedSrc] = useState<string | null>(null)

  
  const showImage = Boolean(src) && src !== failedSrc

  return (
    <span className={clsx(styles.avatar, styles[size], className)}>
      {showImage ? (
        <img
          src={src ?? undefined}
          alt={alt}
          className={styles.image}
          onError={() => setFailedSrc(src ?? null)}
        />
      ) : (
        <UserCircleIcon
          className={styles.image}
          role={alt ? 'img' : undefined}
          aria-label={alt || undefined}
          aria-hidden={!alt ? 'true' : undefined}
        />
      )}
    </span>
  )
}
