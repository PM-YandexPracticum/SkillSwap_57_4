import clsx from 'clsx'
import {
  BookIcon,
  BriefcaseIcon,
  GlobalIcon,
  HomeIcon,
  LifestyleIcon,
  PaletteIcon,
} from '@/shared/assets/icons'
import type { SkillCategoryId } from '@/shared/types'
import type { SkillCategoryIcons, SkillsMenuColumnProps, SkillsMenuProps } from './types'

import styles from './skills-menu.module.css'

const CATEGORY_ICONS: SkillCategoryIcons = {
  business: BriefcaseIcon,
  creativity: PaletteIcon,
  languages: GlobalIcon,
  education: BookIcon,
  health: LifestyleIcon,
  home: HomeIcon,
}

const COLUMNS: SkillCategoryId[][] = [
  ['business', 'languages', 'home'],
  ['creativity', 'education', 'health'],
]

const SkillsMenuColumn = ({ categories, onSelect }: SkillsMenuColumnProps) => (
  <div className={styles.column}>
    {categories.map((category) => {
      const Icon = CATEGORY_ICONS[category.id]

      return (
        <div key={category.id} className={styles.category}>
          <span className={clsx(styles.icon, styles[category.id])}>
            <Icon aria-hidden="true" />
          </span>

          <div className={styles.content}>
            <h2 className={styles.title}>{category.name}</h2>

            <ul className={styles.list}>
              {category.subcategories.map((subcategory) => (
                <li key={subcategory.id}>
                  <button
                    className={styles.item}
                    type="button"
                    onClick={() => onSelect(subcategory.id)}
                  >
                    {subcategory.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )
    })}
  </div>
)

export const SkillsMenu = ({ categories, onSelect, id, className }: SkillsMenuProps) => {
  return (
    <div id={id} className={clsx(styles.menu, className)}>
      {COLUMNS.map((columnIds) => (
        <SkillsMenuColumn
          key={columnIds[0]}
          categories={categories.filter((category) => columnIds.includes(category.id))}
          onSelect={onSelect}
        />
      ))}
    </div>
  )
}
