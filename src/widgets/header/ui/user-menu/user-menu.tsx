import { useId, useRef, useState } from 'react'
import { UserInfo } from '@/entities/user'
import { useDismiss } from '@/shared/hooks/useDismiss'
import { LogoutIcon } from '@/shared/assets/icons'
import { Dropdown } from '@/shared/ui/dropdown'
import type { UserMenuProps } from './types'
import styles from './user-menu.module.css'

export const UserMenu = ({ name, avatarUrl, onProfileClick, onLogout }: UserMenuProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const wrapperRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const menuId = useId()

  const close = () => setIsOpen(false)
  const handleToggle = () => setIsOpen((open) => !open)

  const handleProfileClick = () => {
    close()
    onProfileClick()
  }

  const handleLogout = () => {
    close()
    onLogout()
  }

  useDismiss({ ref: wrapperRef, onDismiss: close, isActive: isOpen, returnFocusRef: triggerRef })

  return (
    <div className={styles.container} ref={wrapperRef}>
      <button
        ref={triggerRef}
        className={styles.trigger}
        type="button"
        onClick={handleToggle}
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
        <Dropdown className={styles.menu} id={menuId}>
          <ul className={styles.list}>
            <li>
              <button className={styles.item} type="button" onClick={handleProfileClick}>
                Личный кабинет
              </button>
            </li>
            <li>
              <button className={styles.item} type="button" onClick={handleLogout}>
                Выйти из аккаунта
                <LogoutIcon className={styles.icon} aria-hidden="true" />
              </button>
            </li>
          </ul>
        </Dropdown>
      )}
    </div>
  )
}
