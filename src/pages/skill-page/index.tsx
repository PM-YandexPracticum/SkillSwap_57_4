import { useCallback, useEffect, useMemo, useState } from 'react'
import { generatePath, useNavigate, useParams } from 'react-router-dom'

import { useAppDispatch, useAppSelector } from '@/store/hooks'

import { loadCities, selectCities, selectCitiesStatus } from '@/entities/city'
import {
  loadSkillCategories,
  selectSkillCategories,
  selectSkillCategoriesStatus,
} from '@/entities/skill'
import {
  loadUsers,
  selectUserBySkillId,
  selectUsers,
  selectUsersStatus,
  toUserCardData,
  UserCard,
  type UserCardData,
} from '@/entities/user'
import { ErrorState } from '@/widgets/error-state'
import { SkillOffer } from '@/widgets/skill-offer'
import { CardsSection } from '@/widgets/cards-section'
import { Button } from '@/shared/ui/button'
import { Loader } from '@/shared/ui/loader'
import { findSubcategory } from '@/shared/lib/skills'
import { ROUTES } from '@/shared/lib/constants'

import styles from './skill-page.module.css'

const SIMILAR_LIMIT = 4

export default function SkillPage() {
  const [likedIds, setLikedIds] = useState<string[]>([])

  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const { id } = useParams<{ id: string }>()

  const users = useAppSelector(selectUsers)
  const author = useAppSelector((state) => selectUserBySkillId(state, id ?? ''))
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

  // так как при выборе карточки из списка похожих страница не размонтируется -
  // она остается прокрученной вниз - возвращаем вверх
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [id])

  const similarCards = useMemo(() => {
    if (!author) return []

    return users
      .filter(
        (user) =>
          user.id !== author.id &&
          user.teachSkill.subcategoryId === author.teachSkill.subcategoryId,
      )
      .slice(0, SIMILAR_LIMIT)
      .map((user) => toUserCardData(user, categories, cities))
  }, [author, users, categories, cities])

  if (!author) {
    return <ErrorState code={404} />
  }

  const statuses = [usersStatus, categoriesStatus, citiesStatus]
  const isFailed = statuses.includes('failed')
  const isLoading = !isFailed && statuses.some((status) => status !== 'succeeded')

  const toggleLike = (userId: string) => {
    setLikedIds((ids) =>
      ids.includes(userId) ? ids.filter((item) => item !== userId) : [...ids, userId],
    )
  }

  const { teachSkill: skill } = author
  const authorCard = toUserCardData(author, categories, cities)
  const found = findSubcategory(skill.subcategoryId, categories)
  const isLiked = likedIds.includes(author.id)

  if (isLoading) {
    return (
      <div className={styles.state}>
        <Loader size="l" />
      </div>
    )
  }

  if (isFailed) {
    return (
      <div className={styles.state}>
        <div className={styles.error} role="alert">
          <p className={styles.text}>Не удалось загрузить навык</p>
          <Button onClick={loadData}>Повторить</Button>
        </div>
      </div>
    )
  }

  const renderSimilarCard = (card: UserCardData) => {
    const isLiked = likedIds.includes(card.id)

    return (
      <UserCard
        key={card.id}
        data={{ ...card, likesCount: card.likesCount + (isLiked ? 1 : 0) }}
        titleAs="h3"
        isLiked={isLiked}
        onLikeToggle={() => toggleLike(card.id)}
        onDetailsClick={() => navigate(generatePath(ROUTES.SKILL, { id: card.skillId }))}
      />
    )
  }

  return (
    <div className={styles.page}>
      <div className={styles.top}>
        <UserCard data={authorCard} variant="author" titleAs="h2" />
        <SkillOffer
          title={skill.title}
          description={skill.description}
          categoryName={found?.category.name ?? ''}
          subcategoryName={found?.subcategory.name ?? ''}
          images={skill.images}
          likesCount={author.likesCount + (isLiked ? 1 : 0)}
          isLiked={isLiked}
          onLikeToggle={() => toggleLike(author.id)}
        />
      </div>

      {similarCards.length > 0 && (
        <CardsSection title="Похожие предложения">
          {similarCards.map(renderSimilarCard)}
        </CardsSection>
      )}
    </div>
  )
}
