import { useEffect, useId, useRef, useState } from 'react'
import { NavLink, useMatch, useNavigate } from 'react-router-dom'
import clsx from 'clsx'

import { ROUTES, STUB_ROUTES } from '@/shared/lib/constants'
import { findSubcategory } from '@/shared/lib/skills'
import { ChevronDownIcon, ChevronUpIcon } from '@/shared/assets/icons'
import { loadSkillCategories, selectSkillCategories } from '@/entities/skill'
import { selectUser } from '@/entities/session'
import { selectHasUnread } from '@/entities/notification'
import { selectSearch, setSearch } from '@/features/catalog-search'
import { selectSubcategory } from '@/features/catalog-filters'

import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { useDismiss } from '@/shared/hooks/useDismiss'

import { Logo } from '@/shared/ui/logo'
import { Button } from '@/shared/ui/button'
import { SearchInput } from '@/shared/ui/search-input'
import { NotificationButton, NotificationsPanel } from '@/features/notifications'
import { ThemeToggleButton } from '@/features/theme-toggle'
import { SkillsMenu } from '../skills-menu'
import { FavoritesButton } from '../favorites-button'
import { UserMenu } from '../user-menu'

import type { HeaderProps } from './types'

import styles from './header.module.css'

export const Header = ({ user, onLogout }: HeaderProps) => {
  const [isSkillsMenuOpen, setIsSkillsMenuOpen] = useState(false)
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false)

  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const categories = useAppSelector(selectSkillCategories)
  const sessionUser = useAppSelector(selectUser)
  const hasUnread = useAppSelector((state) => selectHasUnread(state, sessionUser?.id))

  const search = useAppSelector(selectSearch)
  const isHome = Boolean(useMatch(ROUTES.HOME))
  const isFavoritesActive = Boolean(useMatch(ROUTES.FAVORITES))

  const skillsRef = useRef<HTMLLIElement>(null)
  const skillsTriggerRef = useRef<HTMLButtonElement>(null)
  const skillsMenuId = useId()

  const notificationsRef = useRef<HTMLDivElement>(null)
  const notificationsTriggerRef = useRef<HTMLButtonElement>(null)
  const notificationsPanelId = useId()

  useEffect(() => {
    dispatch(loadSkillCategories())
  }, [dispatch])

  const toggleSkillsMenu = () => setIsSkillsMenuOpen((prev) => !prev)
  const closeSkillsMenu = () => setIsSkillsMenuOpen(false)

  useDismiss({
    ref: skillsRef,
    isActive: isSkillsMenuOpen,
    onDismiss: closeSkillsMenu,
    returnFocusRef: skillsTriggerRef,
  })

  const toggleNotifications = () => setIsNotificationsOpen((prev) => !prev)
  const closeNotifications = () => setIsNotificationsOpen(false)

  useDismiss({
    ref: notificationsRef,
    isActive: isNotificationsOpen,
    onDismiss: closeNotifications,
    returnFocusRef: notificationsTriggerRef,
  })

  const handleSearchChange = (value: string) => {
    dispatch(setSearch(value))
    if (value && !isHome && !isFavoritesActive) navigate(ROUTES.HOME)
  }

  const handleSkillSelect = (subcategoryId: string) => {
    const found = findSubcategory(subcategoryId, categories)
    if (found) dispatch(selectSubcategory({ categoryId: found.category.id, subcategoryId }))
    dispatch(setSearch(''))
    closeSkillsMenu()
    skillsTriggerRef.current?.focus()
    navigate(ROUTES.HOME)
  }

  const handleFavoritesClick = () => navigate(ROUTES.FAVORITES)
  const handleProfileClick = () => navigate(ROUTES.PROFILE)
  const handleNotificationNavigate = () => {
    closeNotifications()
    navigate(ROUTES.PROFILE)
  }
  const handleLoginClick = () => navigate(ROUTES.LOGIN)
  const handleRegisterClick = () => navigate(ROUTES.REGISTER)

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
          <li ref={skillsRef}>
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
                onSelect={handleSkillSelect}
              />
            )}
          </li>
        </ul>
      </nav>

      <SearchInput value={search} onChange={handleSearchChange} />

      {user ? (
        <div className={styles.actions}>
          <div className={styles.icons}>
            <ThemeToggleButton />
            <div ref={notificationsRef} className={styles.notifications}>
              <NotificationButton
                ref={notificationsTriggerRef}
                hasUnread={hasUnread}
                aria-expanded={isNotificationsOpen}
                aria-controls={notificationsPanelId}
                onClick={toggleNotifications}
              />

              {isNotificationsOpen && (
                <NotificationsPanel
                  id={notificationsPanelId}
                  className={styles.notificationsPanel}
                  onNavigate={handleNotificationNavigate}
                />
              )}
            </div>
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
