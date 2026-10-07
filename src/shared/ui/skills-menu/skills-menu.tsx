import {
  BookIcon,
  BriefcaseIcon,
  GlobalIcon,
  HomeIcon,
  LifestyleIcon,
  PaletteIcon,
} from '@/shared/assets/icons'

import type { SkillCategoryIcons, SkillsMenuProps } from './types'
import clsx from 'clsx'

const CATEGORY_ICONS: SkillCategoryIcons = {
  business: BriefcaseIcon,
  creativity: PaletteIcon,
  languages: GlobalIcon,
  education: BookIcon,
  health: LifestyleIcon,
  home: HomeIcon,
}

export const SkillsMenu = ({ categories, onSelect, id, className }: SkillsMenuProps) => (
  <div id={id} className={clsx(className)}>
    {categories.map((category) => {
      const Icon = CATEGORY_ICONS[category.id]

      return (
        <div key={category.id}>
          <div className={clsx()}>
            <span className={clsx()}>
              <Icon aria-hidden="true" />
            </span>
            <h2 className={clsx()}>{category.name}</h2>
          </div>

          <ul className={clsx()}>
            {category.subcategories.map((subcategory) => (
              <li key={subcategory.id}>
                <button onClick={() => onSelect(category.id)}>{subcategory.name}</button>
              </li>
            ))}
          </ul>
        </div>
      )
    })}
  </div>
)
