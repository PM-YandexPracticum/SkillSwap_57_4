import clsx from 'clsx'
import { Avatar } from '@/shared/ui/avatar'
import type { UserInfoProps } from './types'
import styles from './user-info.module.css'

export const UserInfo = ({
  name,
  avatarUrl = null,
  subtitle,
  avatarSize = 'm',
  avatarPosition = 'left',
  nameAs: NameTag = 'h3',
  className,
}: UserInfoProps) => {
  const Wrapper = NameTag === 'span' ? 'span' : 'div'
  const isCompact = avatarSize === 's' && NameTag === 'span'

  return (
    <Wrapper
      className={clsx(
        styles.container,
        isCompact && styles.containerCompact,
        avatarPosition === 'right' && styles.avatarRight,
        className,
      )}
    >
      <Avatar src={avatarUrl} size={avatarSize} alt="" />
      <Wrapper className={styles.text}>
        <NameTag className={styles.name}>{name}</NameTag>
        {subtitle && <span className={styles.subtitle}>{subtitle}</span>}
      </Wrapper>
    </Wrapper>
  )
}
