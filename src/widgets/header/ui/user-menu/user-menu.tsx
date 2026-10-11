import { useId, useRef, useState, type KeyboardEvent } from 'react'
import { UserInfo } from '@/entities/user'
import { useDismiss } from '@/shared/hooks/useDismiss'
import { LogoutIcon } from '@/shared/assets/icons'
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

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Escape' && isOpen) triggerRef.current?.focus()
  }

  useDismiss({ ref: wrapperRef, onDismiss: close, isActive: isOpen })

  return (
    <div className={styles.container} ref={wrapperRef} onKeyDown={handleKeyDown}>
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
        <ul className={styles.menu} id={menuId}>
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
      )}
    </div>
  )
}
