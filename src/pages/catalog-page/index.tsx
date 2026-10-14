import { useCallback } from 'react'

import { loadCities, selectCitiesStatus } from '@/entities/city'
import { loadSkillCategories, selectSkillCategoriesStatus } from '@/entities/skill'
import { loadUsers, selectUsersStatus } from '@/entities/user'
import { useAppDispatch, useAppSelector } from '@/store/hooks'

import { Button } from '@/shared/ui/button'
import { Loader } from '@/shared/ui/loader'

import styles from './catalog-page.module.css'

export default function CatalogPage() {
  const dispatch = useAppDispatch()

  const usersStatus = useAppSelector(selectUsersStatus)
  const categoriesStatus = useAppSelector(selectSkillCategoriesStatus)
  const citiesStatus = useAppSelector(selectCitiesStatus)

  const loadData = useCallback(() => {
    dispatch(loadUsers())
    dispatch(loadSkillCategories())
    dispatch(loadCities())
  }, [dispatch])

  const statuses = [usersStatus, categoriesStatus, citiesStatus]
  const isFailed = statuses.includes('failed')
  const isLoading = !isFailed && statuses.some((status) => status !== 'succeeded')

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
            <p className={styles.errorText}>Не удалось загрузить предложения</p>
            <Button onClick={loadData}>Повторить</Button>
          </div>
        </div>
      )}
    </>
  )
}
