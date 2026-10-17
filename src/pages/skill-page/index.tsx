import { useCallback, useEffect } from 'react'
import { useParams } from 'react-router-dom'

import { useAppDispatch, useAppSelector } from '@/store/hooks'

import { loadCities, selectCitiesStatus } from '@/entities/city'
import { loadSkillCategories, selectSkillCategoriesStatus } from '@/entities/skill'
import { loadUsers, selectUserBySkillId, selectUsersStatus } from '@/entities/user'
import { ErrorState } from '@/widgets/error-state'
import { Button } from '@/shared/ui/button'
import { Loader } from '@/shared/ui/loader'

import styles from './skill-page.module.css'

export default function SkillPage() {
  const dispatch = useAppDispatch()

  const { id } = useParams<{ id: string }>()

  const author = useAppSelector((state) => selectUserBySkillId(state, id ?? ''))

  const usersStatus = useAppSelector(selectUsersStatus)
  const categoriesStatus = useAppSelector(selectSkillCategoriesStatus)
  const citiesStatus = useAppSelector(selectCitiesStatus)

  const statuses = [usersStatus, categoriesStatus, citiesStatus]
  const isFailed = statuses.includes('failed')
  const isLoading = !isFailed && statuses.some((status) => status !== 'succeeded')

  const loadData = useCallback(() => {
    dispatch(loadUsers())
    dispatch(loadSkillCategories())
    dispatch(loadCities())
  }, [dispatch])

  useEffect(() => {
    loadData()
  }, [loadData])

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

  if (!author) {
    return <ErrorState code={404} />
  }

  return <h1>{author.teachSkill.title}</h1>
}
