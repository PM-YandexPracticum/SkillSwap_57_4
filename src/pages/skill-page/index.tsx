import { useCallback, useEffect, useMemo, useState } from 'react'
import { generatePath, useLocation, useNavigate, useParams } from 'react-router-dom'

import { useAppDispatch, useAppSelector } from '@/store/hooks'

import { loadCities, selectCities, selectCitiesStatus } from '@/entities/city'
import {
  loadSkillCategories,
  selectSkillCategories,
  selectSkillCategoriesStatus,
} from '@/entities/skill'
import {
  excludeUser,
  getSimilarUsers,
  loadUsers,
  selectUserBySkillId,
  selectUsers,
  selectUsersStatus,
  toUserCardData,
  UserCard,
  type UserCardData,
} from '@/entities/user'
import { selectUser } from '@/entities/session'
import { addRequest, selectProposedSkillIds } from '@/entities/request'
import { addNotification } from '@/entities/notification'
import { selectFavoriteIds, useToggleFavorite } from '@/features/favorites'
import { ErrorState } from '@/widgets/error-state'
import { SkillOffer } from '@/widgets/skill-offer'
import { CardsSection } from '@/widgets/cards-section'
import { Button } from '@/shared/ui/button'
import { Loader } from '@/shared/ui/loader'
import { Modal } from '@/shared/ui/modal'
import { NotificationIcon } from '@/shared/assets/icons'
import { findSubcategory } from '@/shared/lib/skills'
import { ROUTES } from '@/shared/lib/constants'

import styles from './skill-page.module.css'

const SIMILAR_LIMIT = 4

export default function SkillPage() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const toggleLike = useToggleFavorite()
  const [isProposalSent, setIsProposalSent] = useState(false)

  const { id = '' } = useParams<{ id: string }>()

  const authUser = useAppSelector(selectUser)
  const proposedSkillIds = useAppSelector((state) => selectProposedSkillIds(state, authUser?.id))

  const users = useAppSelector(selectUsers)
  const author = useAppSelector((state) => selectUserBySkillId(state, id))
  const categories = useAppSelector(selectSkillCategories)
  const cities = useAppSelector(selectCities)
  const favoriteIds = useAppSelector(selectFavoriteIds)

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

    const similar = excludeUser(getSimilarUsers(users, author), authUser?.id)

    return similar.slice(0, SIMILAR_LIMIT).map((user) => toUserCardData(user, categories, cities))
  }, [author, users, categories, cities, authUser?.id])

  const statuses = [usersStatus, categoriesStatus, citiesStatus]
  const isFailed = statuses.includes('failed')
  const isLoading = !isFailed && statuses.some((status) => status !== 'succeeded')

  if (isLoading) {
    return (
      <div className={styles.state}>
        <Loader size="l" />
      </div>
    )
  }

  if (isFailed) {
    return (
      <div className={styles.error} role="alert">
        <p className={styles.text}>Не удалось загрузить навык</p>
        <Button onClick={loadData}>Повторить</Button>
      </div>
    )
  }

  if (!author) {
    return <ErrorState code={404} />
  }

  const { teachSkill: skill } = author
  const authorCard = toUserCardData(author, categories, cities)
  const found = findSubcategory(skill.subcategoryId, categories)
  const isAuthorLiked = favoriteIds.includes(author.id)

  const handleProposeExchange = () => {
    if (!authUser) {
      navigate(ROUTES.LOGIN, { state: { from: location } })
      return
    }

    dispatch(addRequest({ skillId: skill.id, fromUserId: authUser.id, toUserId: author.id }))
    dispatch(
      addNotification({
        userId: authUser.id,
        kind: 'sent',
        title: `Вы предложили обмен ${author.name}`,
      }),
    )
    setIsProposalSent(true)
  }

  const closeProposalModal = () => setIsProposalSent(false)

  const renderSimilarCard = (card: UserCardData) => {
    const isLiked = favoriteIds.includes(card.id)

    return (
      <UserCard
        key={card.id}
        data={{ ...card, likesCount: card.likesCount + (isLiked ? 1 : 0) }}
        titleAs="h3"
        isLiked={isLiked}
        isExchangeProposed={proposedSkillIds.includes(card.skillId)}
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
          key={skill.id}
          title={skill.title}
          description={skill.description}
          categoryName={found?.category.name ?? ''}
          subcategoryName={found?.subcategory.name ?? ''}
          images={skill.images}
          likesCount={author.likesCount + (isAuthorLiked ? 1 : 0)}
          isLiked={isAuthorLiked}
          onLikeToggle={() => toggleLike(author.id)}
          isExchangeProposed={proposedSkillIds.includes(skill.id)}
          canProposeExchange={author.id !== authUser?.id}
          onProposeExchange={handleProposeExchange}
        />
      </div>

      {similarCards.length > 0 && (
        <CardsSection title="Похожие предложения">
          {similarCards.map(renderSimilarCard)}
        </CardsSection>
      )}

      <Modal
        isOpen={isProposalSent}
        onClose={closeProposalModal}
        title="Вы предложили обмен"
        icon={<NotificationIcon />}
        className={styles.modal}
      >
        <p className={styles.modalText}>Теперь дождитесь подтверждения. Вам придёт уведомление</p>
        <Button className={styles.modalButton} fullWidth onClick={closeProposalModal}>
          Готово
        </Button>
      </Modal>
    </div>
  )
}
