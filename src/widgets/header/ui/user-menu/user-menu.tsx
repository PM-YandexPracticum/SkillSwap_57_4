import { useId, useRef, useState } from 'react'
import { UserInfo } from '@/entities/user'
import { useDismiss } from '@/shared/hooks/useDismiss'
import { LogoutIcon } from '@/shared/assets/icons'
import { UserMenuProps } from './types'

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
    <div ref={wrapperRef} style={{ backgroundColor: 'red' }}>
      <button
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
        <ul id={menuId}>
          <li>
            <button type="button" onClick={handleProfileClick}>
              Личный кабинет
            </button>
          </li>
          <li>
            <button type="button" onClick={handleLogout}>
              Выйти из аккаунта
            </button>
            <LogoutIcon aria-hidden="true" />
          </li>
        </ul>
      )}
    </div>
  )
}
