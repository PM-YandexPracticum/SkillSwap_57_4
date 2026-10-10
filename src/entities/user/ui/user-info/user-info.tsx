import clsx from 'clsx'
import { Avatar } from '@/shared/ui/avatar'

import { UserInfoProps } from './types'

export const UserInfo = ({
  name,
  avatarUrl,
  subtitle,
  avatarSize = 'm',
  avatarPosition = 'left',
  nameAs = 'h3',
  className,
}: UserInfoProps) => {
  const NameTag = nameAs
  const Wrapper = NameTag === 'span' ? 'span' : 'div'

  return (
    <Wrapper className={clsx(avatarPosition === 'right' && 'root', className)}>
      <Avatar src={avatarUrl} size={avatarSize} alt={`${name} - фотография профиля`} />
      <Wrapper className={clsx()}>
        <NameTag className={clsx()}>{name}</NameTag>
        {subtitle && <span className={clsx()}>{subtitle}</span>}
      </Wrapper>
    </Wrapper>
  )
}
