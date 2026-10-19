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
  excludeUser,
  loadUsers,
  selectNewestUsers,
  selectPopularUsers,
  selectUsers,
  selectUsersStatus,
  sortByNewest,
  toUserCardData,
  UserCard,
  type User,
  type UserCardData,
} from '@/entities/user'
import { selectUser } from '@/entities/session'
import { selectProposedSkillIds } from '@/entities/request'
import { useAppDispatch, useAppSelector } from '@/store/hooks'

import {
  ActiveFilters,
  filterUsers,
  isCatalogFiltered,
  selectCatalogFilters,
  setFilters,
  type CatalogFilters,
} from '@/features/catalog-filters'
import { selectFavoriteIds, useToggleFavorite } from '@/features/favorites'
import { selectSearch } from '@/features/catalog-search'

import { Button } from '@/shared/ui/button'
import { Loader } from '@/shared/ui/loader'
import { FiltersSidebar } from '@/widgets/filters-sidebar'
import { CardsSection } from '@/widgets/cards-section'
import { ChevronDownIcon, ChevronRightIcon, SortIcon } from '@/shared/assets/icons'
import { ROUTES } from '@/shared/lib/constants'
import { shuffle } from '@/shared/lib/helpers'
import { useDebounce } from '@/shared/hooks/useDebounce'

import styles from './catalog-page.module.css'

const POPULAR_LIMIT = 3
const NEWEST_LIMIT = 3
const RECOMMENDED_STEP = 6
const EXPANDED_LIMIT = 9
const LOAD_MORE_DELAY = 500
const SEARCH_DELAY = 200

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
  const [isNewestFirst, setIsNewestFirst] = useState<boolean>(true)
  const [expandedSections, setExpandedSections] = useState<Record<ExpandableSection, boolean>>({
    popular: false,
    newest: false,
  })
  const [recommendedCount, setRecommendedCount] = useState(RECOMMENDED_STEP)

  const { ref: sentinelRef, inView } = useInView({ rootMargin: '0px 0px 50px 0px' })

  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const toggleLike = useToggleFavorite()

  const popularUsers = useAppSelector(selectPopularUsers)
  const newestUsers = useAppSelector(selectNewestUsers)
  const users = useAppSelector(selectUsers)
  const categories = useAppSelector(selectSkillCategories)
  const cities = useAppSelector(selectCities)
  const favoriteIds = useAppSelector(selectFavoriteIds)
  const authUser = useAppSelector(selectUser)
  const proposedSkillIds = useAppSelector((state) => selectProposedSkillIds(state, authUser?.id))

  const filters = useAppSelector(selectCatalogFilters)
  const typedSearch = useAppSelector(selectSearch)
  const search = useDebounce(typedSearch, SEARCH_DELAY)

  const usersStatus = useAppSelector(selectUsersStatus)
  const categoriesStatus = useAppSelector(selectSkillCategoriesStatus)
  const citiesStatus = useAppSelector(selectCitiesStatus)

  const otherUsers = useMemo(() => excludeUser(users, authUser?.id), [users, authUser?.id])
  const otherPopularUsers = useMemo(
    () => excludeUser(popularUsers, authUser?.id),
    [popularUsers, authUser?.id],
  )
  const otherNewestUsers = useMemo(
    () => excludeUser(newestUsers, authUser?.id),
    [newestUsers, authUser?.id],
  )

  const shuffledUsers = useMemo(() => shuffle(otherUsers), [otherUsers])
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
    (list: User[]) => list.map((user) => toUserCardData(user, categories, cities)),
    [categories, cities],
  )

  const popularLimit = expandedSections.popular ? EXPANDED_LIMIT : POPULAR_LIMIT
  const newestLimit = expandedSections.newest ? EXPANDED_LIMIT : NEWEST_LIMIT

  const popularCards = useMemo(
    () => toCards(otherPopularUsers.slice(0, popularLimit)),
    [toCards, otherPopularUsers, popularLimit],
  )
  const newestCards = useMemo(
    () => toCards(otherNewestUsers.slice(0, newestLimit)),
    [toCards, otherNewestUsers, newestLimit],
  )
  const recommendedCards = useMemo(
    () => toCards(shuffledUsers.slice(0, recommendedCount)),
    [toCards, shuffledUsers, recommendedCount],
  )

  const isFiltered = isCatalogFiltered(filters, search)
  const resultCards = useMemo(() => {
    const found = sortByNewest(filterUsers(otherUsers, filters, search))
    return toCards(isNewestFirst ? found : found.reverse())
  }, [toCards, otherUsers, filters, search, isNewestFirst])

  const handleFiltersChange = (value: CatalogFilters) => {
    dispatch(setFilters(value))
  }

  const handleToggleSection = (section: ExpandableSection) => {
    setExpandedSections((sections) => ({
      ...sections,
      [section]: !sections[section],
    }))
  }

  const handleSortToggle = () => setIsNewestFirst((value) => !value)

  const renderCard = (card: UserCardData) => {
    const isLiked = favoriteIds.includes(card.id)

    return (
      <UserCard
        key={card.id}
        data={{ ...card, likesCount: card.likesCount + (isLiked ? 1 : 0) }}
        isLiked={isLiked}
        isExchangeProposed={proposedSkillIds.includes(card.skillId)}
        onLikeToggle={() => toggleLike(card.id)}
        onDetailsClick={() => navigate(generatePath(ROUTES.SKILL, { id: card.skillId }))}
      />
    )
  }

  const sortButton = (
    <Button variant="tertiary" leftIcon={<SortIcon />} onClick={handleSortToggle}>
      {isNewestFirst ? 'Сначала новые' : 'Сначала старые'}
    </Button>
  )

  const renderResults = () => (
    <>
      <ActiveFilters className={styles.activeFilters} />
      {resultCards.length > 0 ? (
        <CardsSection title={`Подходящие предложения: ${resultCards.length}`} action={sortButton}>
          {resultCards.map(renderCard)}
        </CardsSection>
      ) : (
        <p className={styles.empty}>Ничего не найдено</p>
      )}
    </>
  )

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
            onChange={handleFiltersChange}
            categories={categories}
            cities={cities}
          />

          <div className={styles.sections}>
            {isFiltered ? (
              renderResults()
            ) : (
              <>
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
              </>
            )}
          </div>
        </div>
      )}
    </>
  )
}