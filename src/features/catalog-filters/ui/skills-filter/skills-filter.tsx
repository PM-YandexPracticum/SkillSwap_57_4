
import { useState } from 'react';
import { CategoryItem } from '@/shared/ui/category-item';
import { CheckboxItem } from '@/shared/ui/checkbox-item';
import { ExpandButton } from '@/shared/ui/expand-button';
import type { CheckboxState } from '@/shared/ui/checkbox';
import type { SkillCategory, SkillCategoryId } from '@/shared/types';
import type { SkillsFilterProps } from './types';
import styles from './skills-filter.module.css';

const getCategoryState = (
  category: SkillCategory,
  selectedIds: string[],
): CheckboxState => {
  const selectedCount = category.subcategories.filter((subcategory) =>
    selectedIds.includes(subcategory.id),
  ).length;

  if (selectedCount === 0) return 'unchecked';

  return selectedCount === category.subcategories.length
    ? 'checked'
    : 'indeterminate';
};

export const SkillsFilter = ({
  categories,
  selectedIds,
  onChange,
  visibleCount = 6,
}: SkillsFilterProps) => {
  const [openedIds, setOpenedIds] = useState<SkillCategoryId[]>([]);
  const [showAll, setShowAll] = useState(false);

  const visibleCategories = showAll
    ? categories
    : categories.slice(0, visibleCount);

  const toggleOpened = (id: SkillCategoryId) => {
    setOpenedIds((ids) =>
      ids.includes(id)
        ? ids.filter((item) => item !== id)
        : [...ids, id],
    );
  };

  const toggleCategory = (category: SkillCategory, checked: boolean) => {
    const subIds = category.subcategories.map(
      (subcategory) => subcategory.id,
    );

    const withoutCategory = selectedIds.filter(
      (id) => !subIds.includes(id),
    );

    onChange(
      checked
        ? [...withoutCategory, ...subIds]
        : withoutCategory,
    );
  };

  const toggleSubcategory = (id: string, checked: boolean) => {
    onChange(
      checked
        ? [...selectedIds, id]
        : selectedIds.filter((item) => item !== id)
    );
  };

  return (
    <div className={styles.filter}>
      <ul>
        {visibleCategories.map((category) => {
          const opened = openedIds.includes(category.id);
          const state = getCategoryState(category, selectedIds);

          return (
            <li key={category.id} className={styles.category}>
              <CategoryItem
                name="categories"
                label={category.name}
                state={state}
                opened={opened}
                onToggle={() => toggleOpened(category.id)}
                onChange={(event) =>
                  toggleCategory(category, event.currentTarget.checked)
                }
              />

              {opened && (
                <ul className={styles.subcategories}>
                  {category.subcategories.map((subcategory) => (
                    <li key={subcategory.id}>
                      <CheckboxItem
                        name="subcategories"
                        label={subcategory.name}
                        state={
                          selectedIds.includes(subcategory.id)
                            ? 'checked'
                            : 'unchecked'
                        }
                        onChange={(event) =>
                          toggleSubcategory(
                            subcategory.id,
                            event.currentTarget.checked,
                          )
                        }
                      />
                    </li>
                  ))}
                </ul>
              )}
            </li>
          );
        })}
      </ul>

      {categories.length > visibleCount && (
        <ExpandButton
          label="Все категории"
          opened={showAll}
          onToggle={() => setShowAll((previous) => !previous)}
        />
      )}
    </div>
  );
};
