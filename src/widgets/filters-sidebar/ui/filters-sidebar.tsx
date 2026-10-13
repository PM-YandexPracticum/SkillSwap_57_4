import clsx from 'clsx'
import {
  CitiesFilter,
  countActiveFilters,
  DEFAULT_FILTERS,
  FILTER_GENDER_OPTIONS,
  FILTER_MODE_OPTIONS,
  SkillsFilter,
} from '@/features/catalog-filters'
import { CrossIcon } from '@/shared/assets/icons'
import { FilterSection } from '@/shared/ui/filter-section'
import { RadioGroup } from '@/shared/ui/radio-group'

import type { FiltersSidebarProps } from './types'

import styles from './filters-sidebar.module.css'

export const FiltersSidebar = ({
  value,
  onChange,
  categories,
  cities,
  className,
}: FiltersSidebarProps) => {
  const activeCount = countActiveFilters(value)
  const title = activeCount ? `Фильтры (${activeCount})` : 'Фильтры'

  return (
    <aside className={clsx(styles.sidebar, className)} aria-label="Фильтры">
      <div className={styles.header}>
        <h2>{title}</h2>
        {activeCount > 0 && (
          <button type="button" className={styles.reset} onClick={() => onChange(DEFAULT_FILTERS)}>
            Сбросить
            <CrossIcon aria-hidden="true" />
          </button>
        )}
      </div>

      <FilterSection title="Тип навыка" hideTitle>
        <RadioGroup
          name="mode"
          value={value.mode}
          options={FILTER_MODE_OPTIONS}
          onChange={(mode) => onChange({ ...value, mode })}
        />
      </FilterSection>

      <FilterSection title="Навыки">
        <SkillsFilter
          categories={categories}
          selectedIds={value.subcategoryIds}
          onChange={(subcategoryIds) => onChange({ ...value, subcategoryIds })}
        />
      </FilterSection>

      <FilterSection title="Пол автора">
        <RadioGroup
          name="gender"
          value={value.gender}
          options={FILTER_GENDER_OPTIONS}
          onChange={(gender) => onChange({ ...value, gender })}
        />
      </FilterSection>

      <FilterSection title="Город">
        <CitiesFilter
          cities={cities}
          selectedIds={value.cityIds}
          onChange={(cityIds) => onChange({ ...value, cityIds })}
        />
      </FilterSection>
    </aside>
  )
}
