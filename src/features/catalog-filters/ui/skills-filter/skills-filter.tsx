import { useState } from 'react';
import { CategoryItem } from '@/shared/ui/category-item';
import { CheckboxItem } from '@/shared/ui/checkbox-item';
import { ExpandButton } from '@/shared/ui/expand-button';
import type { CheckboxState } from '@/shared/ui/checkbox';
import type { SkillsFilterProps } from './types';
import styles from './skills-filter.module.css';

export const SkillsFilter = ({
  categories,
  selectedIds,
  onChange,
  visibleCount = 6,
}: SkillsFilterProps) => {
  const [openedIds, setOpenedIds] = useState<string[]>([]);
  const [showAll, setShowAll] = useState(false);

  const selectedSet = new Set(selectedIds);

  const toggleCategory = (categoryId: string) => {
    setOpenedIds((previous) =>
      previous.includes(categoryId)
        ? previous.filter((id) => id !== categoryId)
        : [...previous, categoryId],
    );
  };

  const toggleSubcategory = (id: string, checked: boolean) => {
    const next = new Set(selectedIds);

    if (checked) {
      next.add(id);
    } else {
      next.delete(id);
    }

    onChange([...next]);
  };

  const toggleCategorySelection = (
    ids: string[],
    checked: boolean,
  ) => {
    const next = new Set(selectedIds);

    ids.forEach((id) => {
      if (checked) {
        next.add(id);
      } else {
        next.delete(id);
      }
    });

    onChange([...next]);
  };

  const getCategoryState = (ids: string[]): CheckboxState => {
    if (ids.length === 0) {
      return 'unchecked';
    }

    const selectedCount = ids.filter((id) =>
      selectedSet.has(id),
    ).length;

    if (selectedCount === 0) {
      return 'unchecked';
    }

    if (selectedCount === ids.length) {
      return 'checked';
    }

    return 'indeterminate';
  };

  const displayedCategories = showAll
    ? categories
    : categories.slice(0, Math.max(0, visibleCount));

  return (
    <div className={styles.filter}>
      {displayedCategories.map((category) => {
        const subcategoryIds = category.subcategories.map(
          (subcategory) => subcategory.id,
        );

        const opened = openedIds.includes(category.id);
        const state = getCategoryState(subcategoryIds);

        return (
          <div key={category.id} className={styles.category}>
            <CategoryItem
              name="categories"
              label={category.name}
              state={state}
              opened={opened}
              onToggle={() => toggleCategory(category.id)}
              onChange={(event) =>
                toggleCategorySelection(
                  subcategoryIds,
                  event.currentTarget.checked,
                )
              }
            />

            {opened && (
              <div className={styles.subcategories}>
                {category.subcategories.map((subcategory) => (
                  <CheckboxItem
                    key={subcategory.id}
                    name="subcategories"
                    label={subcategory.name}
                    state={
                      selectedSet.has(subcategory.id)
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
                ))}
              </div>
            )}
          </div>
        );
      })}

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
