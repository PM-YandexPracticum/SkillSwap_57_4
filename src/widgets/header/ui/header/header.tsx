import { type KeyboardEvent, useEffect, useId, useRef, useState } from 'react'
import { NavLink, useMatch, useNavigate } from 'react-router-dom'
import clsx from 'clsx'

import { ROUTES, STUB_ROUTES } from '@/shared/lib/constants'
import { ChevronDownIcon, ChevronUpIcon } from '@/shared/assets/icons'
import { loadSkillCategories, selectSkillCategories } from '@/entities/skill'

import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { useDismiss } from '@/shared/hooks/useDismiss'

import { Logo } from '@/shared/ui/logo'
import { Button } from '@/shared/ui/button'
import { SearchInput } from '@/shared/ui/search-input'
import { NotificationButton } from '@/features/notifications'
import { ThemeToggleButton } from '@/features/theme-toggle'
import { SkillsMenu } from '../skills-menu'
import { FavoritesButton } from '../favorites-button'
import { UserMenu } from '../user-menu'

import type { HeaderProps } from './types'

import styles from './header.module.css'

export const Header = ({ user = null, onLogout }: HeaderProps) => {
  const [isSkillsMenuOpen, setIsSkillsMenuOpen] = useState(false)
  const [searchValue, setSearchValue] = useState('')

  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const categories = useAppSelector(selectSkillCategories)

  const skillsRef = useRef<HTMLLIElement>(null)
  const skillsTriggerRef = useRef<HTMLButtonElement>(null)
  const skillsMenuId = useId()

  useEffect(() => {
    dispatch(loadSkillCategories())
  }, [dispatch])

  const toggleSkillsMenu = () => setIsSkillsMenuOpen((prev) => !prev)
  const closeSkillsMenu = () => setIsSkillsMenuOpen(false)

  useDismiss({ ref: skillsRef, isActive: isSkillsMenuOpen, onDismiss: closeSkillsMenu })

  const handleSkillsKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'Escape' && isSkillsMenuOpen) skillsTriggerRef.current?.focus()
  }

  const handleFavoritesClick = () => navigate(ROUTES.FAVORITES)
  const handleProfileClick = () => navigate(ROUTES.PROFILE)
  const handleLoginClick = () => navigate(ROUTES.LOGIN)
  const handleRegisterClick = () => navigate(ROUTES.REGISTER)

  const isFavoritesActive = Boolean(useMatch(ROUTES.FAVORITES))
  const SkillsArrowIcon = isSkillsMenuOpen ? ChevronUpIcon : ChevronDownIcon

  return (
    <header className={styles.header}>
      <Logo />

      <nav aria-label="Основное меню">
        <ul className={styles.list}>
          <li>
            <NavLink to={STUB_ROUTES.ABOUT} className={styles.link}>
              О проекте
            </NavLink>
          </li>
          <li ref={skillsRef} onKeyDown={handleSkillsKeyDown}>
            <button
              type="button"
              className={clsx(styles.link, styles.skillsButton)}
              ref={skillsTriggerRef}
              aria-expanded={isSkillsMenuOpen}
              aria-controls={skillsMenuId}
              onClick={toggleSkillsMenu}
            >
              Все навыки
              <SkillsArrowIcon aria-hidden="true" />
            </button>

            {isSkillsMenuOpen && (
              <SkillsMenu
                id={skillsMenuId}
                className={styles.skillsMenu}
                categories={categories}
                onSelect={closeSkillsMenu}
              />
            )}
          </li>
        </ul>
      </nav>

      <SearchInput value={searchValue} onChange={setSearchValue} />

      {user ? (
        <div className={styles.actions}>
          <div className={styles.icons}>
            <ThemeToggleButton />
            <NotificationButton />
            <FavoritesButton isActive={isFavoritesActive} onClick={handleFavoritesClick} />
          </div>
          <UserMenu
            name={user.name}
            avatarUrl={user.avatarUrl}
            onProfileClick={handleProfileClick}
            onLogout={onLogout}
          />
        </div>
      ) : (
        <div className={clsx(styles.actions, styles.actionsGuest)}>
          <ThemeToggleButton />
          <div className={styles.buttons}>
            <Button variant="secondary" onClick={handleLoginClick}>
              Войти
            </Button>
            <Button onClick={handleRegisterClick}>Зарегистрироваться</Button>
          </div>
        </div>
      )}
    </header>
  )
}
