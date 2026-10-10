import clsx from 'clsx'
import { Avatar } from '@/shared/ui/avatar'

import { UserInfoProps } from './types'

import styles from './user-info.module.css'

export const UserInfo = ({
  name,
  avatarUrl,
  subtitle,
  avatarSize = 'm',
  avatarPosition = 'left',
  nameAs: NameTag = 'h3',
  className,
}: UserInfoProps) => {
  const Wrapper = NameTag === 'span' ? 'span' : 'div'
  const isH2 = NameTag === 'h2'
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
        <NameTag className={clsx(styles.name, isH2 && styles.nameH2)}>{name}</NameTag>
        {subtitle && <span className={styles.subtitle}>{subtitle}</span>}
      </Wrapper>
    </Wrapper>
  )
}
