import { CategoryItem } from '@/shared/ui/category-item'
import { CheckboxItem } from '@/shared/ui/checkbox-item'
import { ExpandButton } from '@/shared/ui/expand-button'
import type { CheckboxState } from '@/shared/ui/checkbox'
import type { SkillCategory, SkillCategoryId } from '@/shared/types'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { selectOpenedCategoryIds, selectShowAllCategories } from '../../model/selectors'
import { toggleCategoryOpened, toggleShowAllCategories } from '../../model/catalog-filters-slice'
import type { SkillsFilterProps } from './types'
import styles from './skills-filter.module.css'

const getCategoryState = (category: SkillCategory, selectedIds: string[]): CheckboxState => {
  const selectedCount = category.subcategories.filter((subcategory) =>
    selectedIds.includes(subcategory.id),
  ).length

  if (selectedCount === 0) return 'unchecked'

  return selectedCount === category.subcategories.length ? 'checked' : 'indeterminate'
}

export const SkillsFilter = ({
  categories,
  selectedIds,
  onChange,
  visibleCount = 6,
}: SkillsFilterProps) => {
  const dispatch = useAppDispatch()
  const openedIds = useAppSelector(selectOpenedCategoryIds)
  const showAll = useAppSelector(selectShowAllCategories)

  const visibleCategories = showAll ? categories : categories.slice(0, visibleCount)

  const toggleOpened = (id: SkillCategoryId) => {
    dispatch(toggleCategoryOpened(id))
  }

  const toggleCategory = (category: SkillCategory, checked: boolean) => {
    const subIds = category.subcategories.map((subcategory) => subcategory.id)

    const withoutCategory = selectedIds.filter((id) => !subIds.includes(id))

    onChange(checked ? [...withoutCategory, ...subIds] : withoutCategory)
  }

  const toggleSubcategory = (id: string, checked: boolean) => {
    onChange(checked ? [...selectedIds, id] : selectedIds.filter((item) => item !== id))
  }

  return (
    <div className={styles.filter}>
      <ul className={styles.list}>
        {visibleCategories.map((category) => {
          const opened = openedIds.includes(category.id)
          const state = getCategoryState(category, selectedIds)

          return (
            <li key={category.id}>
              <CategoryItem
                name="categories"
                label={category.name}
                state={state}
                opened={opened}
                onToggle={() => toggleOpened(category.id)}
                onChange={(e) => toggleCategory(category, e.currentTarget.checked)}
              />

              {opened && (
                <ul className={styles.subcategories}>
                  {category.subcategories.map((subcategory) => (
                    <li key={subcategory.id}>
                      <CheckboxItem
                        name="subcategories"
                        label={subcategory.name}
                        state={selectedIds.includes(subcategory.id) ? 'checked' : 'unchecked'}
                        onChange={(e) => toggleSubcategory(subcategory.id, e.currentTarget.checked)}
                      />
                    </li>
                  ))}
                </ul>
              )}
            </li>
          )
        })}
      </ul>

      {categories.length > visibleCount && (
        <ExpandButton
          label="Все категории"
          opened={showAll}
          onToggle={() => dispatch(toggleShowAllCategories())}
        />
      )}
    </div>
  )
}
