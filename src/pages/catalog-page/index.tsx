import { useCallback, useEffect, useMemo, useState } from 'react'
import { generatePath, useNavigate } from 'react-router-dom'

import { loadCities, selectCities, selectCitiesStatus } from '@/entities/city'
import {
  loadSkillCategories,
  selectSkillCategories,
  selectSkillCategoriesStatus,
} from '@/entities/skill'
import {
  loadUsers,
  selectNewestUsers,
  selectPopularUsers,
  selectUsers,
  selectUsersStatus,
  toUserCardData,
  UserCard,
} from '@/entities/user'
import type { User, UserCardData } from '@/entities/user'
import { useAppDispatch, useAppSelector } from '@/store/hooks'

import { DEFAULT_FILTERS } from '@/features/catalog-filters'
import type { CatalogFilters } from '@/features/catalog-filters'

import { Button } from '@/shared/ui/button'
import { Loader } from '@/shared/ui/loader'
import { FiltersSidebar } from '@/widgets/filters-sidebar'
import { CardsSection } from '@/widgets/cards-section'
import { ChevronRightIcon } from '@/shared/assets/icons'
import { ROUTES } from '@/shared/lib/constants'

import styles from './catalog-page.module.css'

const POPULAR_LIMIT = 3
const NEWEST_LIMIT = 3
const RECOMMENDED_LIMIT = 6

const ViewAllButton = () => (
  <Button variant="tertiary" rightIcon={<ChevronRightIcon />}>
    Смотреть все
  </Button>
)

export default function CatalogPage() {
  const [filters, setFilters] = useState<CatalogFilters>(DEFAULT_FILTERS)
  const [likedIds, setLikedIds] = useState<string[]>([])

  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const popularUsers = useAppSelector(selectPopularUsers)
  const newestUsers = useAppSelector(selectNewestUsers)
  const users = useAppSelector(selectUsers)
  const categories = useAppSelector(selectSkillCategories)
  const cities = useAppSelector(selectCities)

  const usersStatus = useAppSelector(selectUsersStatus)
  const categoriesStatus = useAppSelector(selectSkillCategoriesStatus)
  const citiesStatus = useAppSelector(selectCitiesStatus)

  const loadData = useCallback(() => {
    dispatch(loadUsers())
    dispatch(loadSkillCategories())
    dispatch(loadCities())
  }, [dispatch])

  useEffect(() => {
    loadData()
  }, [loadData])

  const statuses = [usersStatus, categoriesStatus, citiesStatus]
  const isFailed = statuses.includes('failed')
  const isLoading = !isFailed && statuses.some((status) => status !== 'succeeded')

  const toCards = useCallback(
    (list: User[], limit: number) =>
      list.slice(0, limit).map((user) => toUserCardData(user, categories, cities)),
    [categories, cities],
  )

  const popularCards = useMemo(() => toCards(popularUsers, POPULAR_LIMIT), [toCards, popularUsers])
  const newestCards = useMemo(() => toCards(newestUsers, NEWEST_LIMIT), [toCards, newestUsers])
  const recommendedCards = useMemo(() => toCards(users, RECOMMENDED_LIMIT), [toCards, users])

  const toggleLike = (userId: string) => {
    setLikedIds((ids) =>
      ids.includes(userId) ? ids.filter((id) => id !== userId) : [...ids, userId],
    )
  }

  const renderCard = (card: UserCardData) => {
    const isLiked = likedIds.includes(card.id)

    return (
      <UserCard
        key={card.id}
        data={{ ...card, likesCount: card.likesCount + (isLiked ? 1 : 0) }}
        isLiked={isLiked}
        onLikeToggle={() => toggleLike(card.id)}
        onDetailsClick={() => navigate(generatePath(ROUTES.SKILL, { id: card.skillId }))}
      />
    )
  }

  return (
    <>
      <h1 className="visually-hidden">Каталог навыков</h1>

      {isLoading && (
        <div className={styles.state}>
          <Loader size="l" />
        </div>
      )}

      {isFailed && (
        <div className={styles.state}>
          <div className={styles.error} role="alert">
            <p className={styles.text}>Не удалось загрузить предложения</p>
            <Button onClick={loadData}>Повторить</Button>
          </div>
        </div>
      )}

      {!isLoading && !isFailed && (
        <div className={styles.layout}>
          <FiltersSidebar
            value={filters}
            onChange={setFilters}
            categories={categories}
            cities={cities}
          />

          <div className={styles.sections}>
            <CardsSection title="Популярное" action={<ViewAllButton />}>
              {popularCards.map(renderCard)}
            </CardsSection>

            <CardsSection title="Новое" action={<ViewAllButton />}>
              {newestCards.map(renderCard)}
            </CardsSection>

            <CardsSection title="Рекомендуем" action={<ViewAllButton />}>
              {recommendedCards.map(renderCard)}
            </CardsSection>
          </div>
        </div>
      )}
    </>
  )
}
