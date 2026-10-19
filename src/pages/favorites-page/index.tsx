import { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '@/store/hooks'

import { selectCities } from '@/entities/city'
import { selectSkillCategories } from '@/entities/skill'
import { DEFAULT_FILTERS, type CatalogFilters } from '@/features/catalog-filters'
import { setSearch } from '@/features/catalog-search'
import { FavoritesList } from '@/widgets/favorites-list'
import { FiltersSidebar } from '@/widgets/filters-sidebar'

import styles from './favorites-page.module.css'

export default function FavoritesPage() {
  const [filters, setFilters] = useState<CatalogFilters>(DEFAULT_FILTERS)
  const dispatch = useAppDispatch()

  const categories = useAppSelector(selectSkillCategories)
  const cities = useAppSelector(selectCities)

  useEffect(() => {
    dispatch(setSearch(''))
  }, [dispatch])

  return (
    <div className={styles.layout}>
      <FiltersSidebar
        value={filters}
        onChange={setFilters}
        categories={categories}
        cities={cities}
      />

      <div className={styles.content}>
        <h1 className={styles.header}>Избранное</h1>
        <FavoritesList filters={filters} />
      </div>
    </div>
  )
}
