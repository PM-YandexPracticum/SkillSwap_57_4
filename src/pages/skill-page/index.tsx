import { useCallback, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

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
  selectUsersStatus,
  toUserCardData,
  UserCard,
} from '@/entities/user'
import { ErrorState } from '@/widgets/error-state'
import { SkillOffer } from '@/widgets/skill-offer'
import { Button } from '@/shared/ui/button'
import { Loader } from '@/shared/ui/loader'
import { findSubcategory } from '@/shared/lib/skills'

import styles from './skill-page.module.css'

export default function SkillPage() {
  const [likedIds, setLikedIds] = useState<string[]>([])

  const dispatch = useAppDispatch()

  const { id } = useParams<{ id: string }>()

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
    </div>
  )
}
