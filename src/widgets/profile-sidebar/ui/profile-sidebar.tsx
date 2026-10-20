import type { ComponentType, SVGProps } from 'react'
import { NavLink } from 'react-router-dom'
import clsx from 'clsx'

import { IdeaIcon, LikeIcon, MessageTextIcon, RequestIcon, UserIcon } from '@/shared/assets/icons'
import { ROUTES } from '@/shared/lib/constants'
import { SidebarItem } from '@/shared/ui/sidebar-item'
import type { ProfileSidebarProps } from './types'

import styles from './profile-sidebar.module.css'

interface ProfileSidebarItem {
  label: string
  Icon: ComponentType<SVGProps<SVGSVGElement>>
  to: string
}

const ITEMS: ProfileSidebarItem[] = [
  { label: 'Заявки', Icon: RequestIcon, to: ROUTES.PROFILE_REQUESTS },
  { label: 'Мои обмены', Icon: MessageTextIcon, to: ROUTES.PROFILE_EXCHANGES },
  { label: 'Избранное', Icon: LikeIcon, to: ROUTES.FAVORITES },
  { label: 'Мои навыки', Icon: IdeaIcon, to: ROUTES.PROFILE_SKILLS },
  { label: 'Личные данные', Icon: UserIcon, to: ROUTES.PROFILE },
]

export const ProfileSidebar = ({ className }: ProfileSidebarProps) => (
  <nav aria-label="Меню личного кабинета" className={clsx(styles.sidebar, className)}>
    <ul className={styles.list}>
      {ITEMS.map(({ label, Icon, to }) => (
        <li key={to}>
          <NavLink to={to} end className={styles.link}>
            {({ isActive }) => (
              <SidebarItem icon={<Icon />} isActive={isActive}>
                {label}
              </SidebarItem>
            )}
          </NavLink>
        </li>
      ))}
    </ul>
  </nav>
)
