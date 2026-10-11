import { useEffect, useId, useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'

import { ROUTES, STUB_ROUTES } from '@/shared/lib/constants'
import { ChevronDownIcon, ChevronUpIcon } from '@/shared/assets/icons'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { loadSkillCategories, selectSkillCategories } from '@/entities/skill'

import { Logo } from '@/shared/ui/logo'
import { Button } from '@/shared/ui/button'
import { SearchInput } from '@/shared/ui/search-input'

import { NotificationButton } from '@/features/notifications'
import { ThemeToggleButton } from '@/features/theme-toggle'

import { SkillsMenu } from '@/widgets/header/ui/skills-menu'
import { UserMenu } from '@/widgets/header/ui/user-menu'
import { FavoritesButton } from '@/widgets/header/ui/favorites-button'

import { HeaderProps } from './types'

export const Header = ({ user, onLogout }: HeaderProps) => {
  const [isSkillsMenuOpen, setisSkillsMenuOpen] = useState(false)
  const [searchValue, setSearchValue] = useState('')

  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const categories = useAppSelector(selectSkillCategories)

  const skillsMenuId = useId()

  useEffect(() => {
    dispatch(loadSkillCategories())
  }, [dispatch])

  const toggleSkillsMenu = () => setisSkillsMenuOpen((prev) => !prev)
  const closeSkillsMenu = () => setisSkillsMenuOpen(false)

  const SkillsArrowIcon = isSkillsMenuOpen ? ChevronUpIcon : ChevronDownIcon

  return (
    <header>
      <div>
        <div style={{ display: 'flex' }}>
          {/* логотип - 1 */}
          <Logo />

          {/* две кнопки навигации - 2 */}
          <nav>
            <ul style={{ display: 'flex' }}>
              <li>
                <NavLink to={STUB_ROUTES.ABOUT}>О проекте</NavLink>
              </li>
              <li>
                <button type="button" onClick={toggleSkillsMenu}>
                  Все навыки
                  <SkillsArrowIcon />
                </button>

                {isSkillsMenuOpen && (
                  <SkillsMenu
                    id={skillsMenuId}
                    categories={categories}
                    onSelect={closeSkillsMenu}
                  />
                )}
              </li>
            </ul>
          </nav>

          {/* строка поиска - 3 */}
          <SearchInput value={searchValue} onChange={setSearchValue} />

          {user ? (
            // блок с ионками и меню юзера - 4
            <div style={{ display: 'flex' }}>
              <ThemeToggleButton />
              <NotificationButton />
              <NavLink to={ROUTES.FAVORITES}>
                <FavoritesButton />
              </NavLink>
              <UserMenu
                name={user.name}
                avatarUrl={user.avatarUrl}
                onProfileClick={() => navigate(ROUTES.PROFILE)}
                onLogout={onLogout}
              />
            </div>
          ) : (
            <>
              {/* тоггл темы - 4 */}
              <ThemeToggleButton />

              {/* блок с кнопками входа и регистр - 5 */}
              <div style={{ display: 'flex' }}>
                <NavLink to={ROUTES.LOGIN}>
                  <Button variant="secondary">Войти</Button>
                </NavLink>
                <NavLink to={ROUTES.REGISTER}>
                  <Button variant="primary">Зарегистрироваться</Button>
                </NavLink>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
