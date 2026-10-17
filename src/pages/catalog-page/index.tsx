import { useCallback, useEffect, useMemo, useState } from 'react'
import { generatePath, useNavigate } from 'react-router-dom'
import { useInView } from 'react-intersection-observer'

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
  type User,
  type UserCardData,
} from '@/entities/user'
import { useAppDispatch, useAppSelector } from '@/store/hooks'

import { DEFAULT_FILTERS } from '@/features/catalog-filters'
import type { CatalogFilters } from '@/features/catalog-filters'

import { Button } from '@/shared/ui/button'
import { Loader } from '@/shared/ui/loader'
import { FiltersSidebar } from '@/widgets/filters-sidebar'
import { CardsSection } from '@/widgets/cards-section'
import { ChevronDownIcon, ChevronRightIcon } from '@/shared/assets/icons'
import { ROUTES } from '@/shared/lib/constants'
import { shuffle } from '@/shared/lib/helpers'

import styles from './catalog-page.module.css'

const POPULAR_LIMIT = 3
const NEWEST_LIMIT = 3
const RECOMMENDED_STEP = 6
const EXPANDED_LIMIT = 9
const LOAD_MORE_DELAY = 500

type ExpandableSection = 'popular' | 'newest'

interface ViewAllButtonProps {
  isExpanded: boolean
  onClick: () => void
}

const ViewAllButton = ({ isExpanded, onClick }: ViewAllButtonProps) => (
  <Button
    variant="tertiary"
    rightIcon={isExpanded ? <ChevronDownIcon /> : <ChevronRightIcon />}
    aria-expanded={isExpanded}
    onClick={onClick}
  >
    Смотреть все
  </Button>
)

export default function CatalogPage() {
  const [filters, setFilters] = useState<CatalogFilters>(DEFAULT_FILTERS)
  const [likedIds, setLikedIds] = useState<string[]>([])
  const [expandedSections, setExpandedSections] = useState<Record<ExpandableSection, boolean>>({
    popular: false,
    newest: false,
  })
  const [recommendedCount, setRecommendedCount] = useState(RECOMMENDED_STEP)

  const { ref: sentinelRef, inView } = useInView({ rootMargin: '0px 0px 100px 0px' })

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

  const shuffledUsers = useMemo(() => shuffle(users), [users])
  const hasMoreRecommended = recommendedCount < shuffledUsers.length
  const isLoadingMore = inView && hasMoreRecommended

  const loadData = useCallback(() => {
    dispatch(loadUsers())
    dispatch(loadSkillCategories())
    dispatch(loadCities())
  }, [dispatch])

  useEffect(() => {
    loadData()
  }, [loadData])

  useEffect(() => {
    if (!isLoadingMore) return

    const timer = setTimeout(() => {
      setRecommendedCount((count) => count + RECOMMENDED_STEP)
    }, LOAD_MORE_DELAY)

    return () => clearTimeout(timer)
  }, [isLoadingMore, recommendedCount])

  const statuses = [usersStatus, categoriesStatus, citiesStatus]
  const isFailed = statuses.includes('failed')
  const isLoading = !isFailed && statuses.some((status) => status !== 'succeeded')

  const toCards = useCallback(
    (list: User[], limit: number) =>
      list.slice(0, limit).map((user) => toUserCardData(user, categories, cities)),
    [categories, cities],
  )

  const popularLimit = expandedSections.popular ? EXPANDED_LIMIT : POPULAR_LIMIT
  const newestLimit = expandedSections.newest ? EXPANDED_LIMIT : NEWEST_LIMIT

  const popularCards = useMemo(
    () => toCards(popularUsers, popularLimit),
    [toCards, popularUsers, popularLimit],
  )
  const newestCards = useMemo(
    () => toCards(newestUsers, newestLimit),
    [toCards, newestUsers, newestLimit],
  )
  const recommendedCards = useMemo(
    () => toCards(shuffledUsers, recommendedCount),
    [toCards, shuffledUsers, recommendedCount],
  )

  const handleToggleSection = (section: ExpandableSection) => {
    setExpandedSections((sections) => ({
      ...sections,
      [section]: !sections[section],
    }))
  }

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

  const renderViewAllButton = (section: ExpandableSection) => (
    <ViewAllButton
      isExpanded={expandedSections[section]}
      onClick={() => handleToggleSection(section)}
    />
  )

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
            <CardsSection title="Популярное" action={renderViewAllButton('popular')}>
              {popularCards.map(renderCard)}
            </CardsSection>

            <CardsSection title="Новое" action={renderViewAllButton('newest')}>
              {newestCards.map(renderCard)}
            </CardsSection>

            <CardsSection title="Рекомендуем">{recommendedCards.map(renderCard)}</CardsSection>

            {hasMoreRecommended && (
              <div ref={sentinelRef} className={styles.sentinel}>
                {isLoadingMore && <Loader size="m" />}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}
