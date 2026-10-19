import { useCallback, useEffect, useMemo } from 'react'
import { generatePath, useNavigate } from 'react-router-dom'
import clsx from 'clsx'

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

import { ROUTES } from '@/shared/lib/constants'
import { selectFavoriteIds, useToggleFavorite } from '@/features/favorites'
import { Loader } from '@/shared/ui/loader'
import { Button } from '@/shared/ui/button'
import type { FavoritesListProps } from './types'

import styles from './favorites-list.module.css'

export const FavoritesList = ({ className }: FavoritesListProps) => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const toggleFavorite = useToggleFavorite()

  const users = useAppSelector(selectUsers)
  const categories = useAppSelector(selectSkillCategories)
  const cities = useAppSelector(selectCities)
  const favoriteIds = useAppSelector(selectFavoriteIds)

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

  const cards = useMemo(() => {
    const ids = new Set(favoriteIds)

    return users
      .filter((user) => ids.has(user.id))
      .map((user) => toUserCardData(user, categories, cities))
  }, [users, favoriteIds, categories, cities])

  if (isLoading) {
    return (
      <div className={clsx(styles.state, className)}>
        <Loader size="l" />
      </div>
    )
  }

  const renderCard = (card: UserCardData) => (
    <UserCard
      key={card.id}
      data={{ ...card, likesCount: card.likesCount + 1 }}
      titleAs="h2"
      isLiked
      onLikeToggle={() => toggleFavorite(card.id)}
      onDetailsClick={() => navigate(generatePath(ROUTES.SKILL, { id: card.skillId }))}
    />
  )

  if (isFailed) {
    return (
      <div className={clsx(styles.state, className)} role="alert">
        <p className={styles.text}>Не удалось загрузить избранное</p>
        <Button onClick={loadData}>Повторить</Button>
      </div>
    )
  }

  return <div className={clsx(styles.grid, className)}>{cards.map(renderCard)}</div>
}
