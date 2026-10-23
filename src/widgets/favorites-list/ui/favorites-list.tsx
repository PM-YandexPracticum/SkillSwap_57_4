import { useCallback, useEffect, useMemo } from 'react'
import { generatePath, useNavigate } from 'react-router-dom'
import clsx from 'clsx'

import { useDebounce } from '@/shared/hooks/useDebounce'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import {
  loadUsers,
  selectUsers,
  selectUsersStatus,
  toUserCardData,
  UserCard,
  type UserCardData,
} from '@/entities/user'
import {
  loadSkillCategories,
  selectSkillCategories,
  selectSkillCategoriesStatus,
} from '@/entities/skill'
import { loadCities, selectCities, selectCitiesStatus } from '@/entities/city'
import { selectUser } from '@/entities/session'
import { selectProposedSkillIds } from '@/entities/request'

import { selectFavoriteIds, selectLocalLikes, useToggleFavorite } from '@/features/favorites'
import { filterUsers } from '@/features/catalog-filters'
import { selectSearch } from '@/features/catalog-search'

import { ROUTES } from '@/shared/lib/constants'
import { Loader } from '@/shared/ui/loader'
import { Button } from '@/shared/ui/button'
import type { FavoritesListProps } from './types'

import styles from './favorites-list.module.css'

const SEARCH_DELAY = 200

export const FavoritesList = ({ filters, className }: FavoritesListProps) => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const toggleFavorite = useToggleFavorite()

  const users = useAppSelector(selectUsers)
  const categories = useAppSelector(selectSkillCategories)
  const cities = useAppSelector(selectCities)
  const favoriteIds = useAppSelector(selectFavoriteIds)
  const localLikes = useAppSelector(selectLocalLikes)
  const authUser = useAppSelector(selectUser)
  const proposedSkillIds = useAppSelector((state) => selectProposedSkillIds(state, authUser?.id))

  const typedSearch = useAppSelector(selectSearch)
  const search = useDebounce(typedSearch, SEARCH_DELAY)

  const usersStatus = useAppSelector(selectUsersStatus)
  const categoriesStatus = useAppSelector(selectSkillCategoriesStatus)
  const citiesStatus = useAppSelector(selectCitiesStatus)
  const statuses = [usersStatus, categoriesStatus, citiesStatus]

  const loadData = useCallback(() => {
    dispatch(loadUsers())
    dispatch(loadSkillCategories())
    dispatch(loadCities())
  }, [dispatch])

  useEffect(() => {
    loadData()
  }, [loadData])

  const isFailed = statuses.includes('failed')
  const isLoading = !isFailed && statuses.some((status) => status !== 'succeeded')

  // пустота считается по пересечению с загруженными пользователями, а не по сырым id
  // id пользователя, которого уже нет в базе, не должен давать пустую сетку
  const favoriteUsers = useMemo(() => {
    const ids = new Set(favoriteIds)

    return users.filter((user) => ids.has(user.id))
  }, [users, favoriteIds])

  const cards = useMemo(() => {
    const visibleUsers = filters ? filterUsers(favoriteUsers, filters, search) : favoriteUsers

    return visibleUsers.map((user) => toUserCardData(user, categories, cities))
  }, [favoriteUsers, filters, search, categories, cities])

  if (isLoading) {
    return (
      <div className={clsx(styles.state, className)}>
        <Loader size="l" />
      </div>
    )
  }

  if (isFailed) {
    return (
      <div className={clsx(styles.state, className)} role="alert">
        <p className={styles.text}>Не удалось загрузить избранное</p>
        <Button onClick={loadData}>Повторить</Button>
      </div>
    )
  }

  if (favoriteUsers.length < 1) {
    return (
      <div className={clsx(styles.state, className)}>
        <p className={clsx(styles.text, styles.muted)}>Здесь пока пусто</p>
        <Button onClick={() => navigate(ROUTES.HOME)}>Вернуться в каталог</Button>
      </div>
    )
  }

  if (cards.length < 1) {
    return (
      <p className={clsx(styles.state, styles.text, styles.muted, className)}>Ничего не найдено</p>
    )
  }

  const renderCard = (card: UserCardData) => (
    <UserCard
      data={{ ...card, likesCount: card.likesCount + (localLikes[card.id] ?? 0) }}
      titleAs="h2"
      isLiked
      isExchangeProposed={proposedSkillIds.includes(card.skillId)}
      onLikeToggle={() => toggleFavorite(card.id)}
      onDetailsClick={() => navigate(generatePath(ROUTES.SKILL, { id: card.skillId }))}
    />
  )

  return (
    <ul className={clsx(styles.grid, className)}>
      {cards.map((card) => (
        <li key={card.id} className={styles.item}>
          {renderCard(card)}
        </li>
      ))}
    </ul>
  )
}
