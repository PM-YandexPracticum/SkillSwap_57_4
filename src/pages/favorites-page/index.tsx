import { useAppDispatch, useAppSelector } from '@/store/hooks'

import { selectCities } from '@/entities/city'
import { selectSkillCategories } from '@/entities/skill'
import { selectCatalogFilters, setFilters, type CatalogFilters } from '@/features/catalog-filters'
import { FavoritesList } from '@/widgets/favorites-list'
import { FiltersSidebar } from '@/widgets/filters-sidebar'

import styles from './favorites-page.module.css'

export default function FavoritesPage() {
  const dispatch = useAppDispatch()

  const filters = useAppSelector(selectCatalogFilters)
  const categories = useAppSelector(selectSkillCategories)
  const cities = useAppSelector(selectCities)

  const handleFiltersChange = (value: CatalogFilters) => {
    dispatch(setFilters(value))
  }

  return (
    <div className={styles.layout}>
      <FiltersSidebar
        value={filters}
        onChange={handleFiltersChange}
        categories={categories}
        cities={cities}
      />

      <div className={styles.content}>
        <h1 className={styles.header}>Избранное</h1>
        <FavoritesList applyFilters />
      </div>
    </div>
  )
}
