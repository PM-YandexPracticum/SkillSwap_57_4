import { useId, useRef, useState } from 'react'
import { UserInfo } from '@/entities/user'
import { useDismiss } from '@/shared/hooks/useDismiss'
import { LogoutIcon } from '@/shared/assets/icons'
import { UserMenuProps } from './types'

import styles from './user-menu.module.css'

export const UserMenu = ({ name, avatarUrl, onProfileClick, onLogout }: UserMenuProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const wrapperRef = useRef<HTMLDivElement>(null)
  const menuId = useId()

  const close = () => setIsOpen(false)

  const handleProfileClick = () => {
    close()
    onProfileClick()
  }

  const handleLogout = () => {
    close()
    onLogout()
  }

  useDismiss({ ref: wrapperRef, onDismiss: close, isActive: isOpen })

  return (
    <div className={styles.container} ref={wrapperRef}>
      <button
        className={styles.trigger}
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
        aria-controls={menuId}
      >
        <UserInfo
          name={name}
          avatarUrl={avatarUrl}
          avatarPosition="right"
          avatarSize="s"
          nameAs="span"
        />
      </button>

      {isOpen && (
        // элемент в целом выглядит как отдельный компонент - дропдаун
        // но используется он только здесь и для показа уведомлений
        <ul className={styles.menu} id={menuId}>
          <li>
            <button className={styles.item} type="button" onClick={handleProfileClick}>
              <h4>Личный кабинет</h4>
            </button>
          </li>
          <li>
            <button className={styles.item} type="button" onClick={handleLogout}>
              <h4>Выйти из аккаунта</h4>
              <LogoutIcon className={styles.icon} aria-hidden="true" />
            </button>
          </li>
        </ul>
      )}
    </div>
  )
}
