import { useCallback, useEffect, useState } from 'react'

import { loadCities, selectCities, selectCitiesStatus } from '@/entities/city'
import {
  loadSkillCategories,
  selectSkillCategories,
  selectSkillCategoriesStatus,
} from '@/entities/skill'
import { loadUsers, selectUsersStatus } from '@/entities/user'
import { useAppDispatch, useAppSelector } from '@/store/hooks'

import { DEFAULT_FILTERS } from '@/features/catalog-filters'
import type { CatalogFilters } from '@/features/catalog-filters'

import { Button } from '@/shared/ui/button'
import { Loader } from '@/shared/ui/loader'

import styles from './catalog-page.module.css'
import { FiltersSidebar } from '@/widgets/filters-sidebar'

export default function CatalogPage() {
  const [filters, setFilters] = useState<CatalogFilters>(DEFAULT_FILTERS)

  const dispatch = useAppDispatch()

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

          <div className={styles.sections}></div>
        </div>
      )}
    </>
  )
}
