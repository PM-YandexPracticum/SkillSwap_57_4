import { TagCategory, TagProps } from './types'
import clsx from 'clsx'
import Styles from './tag.module.css'

const CATEGORY_STYLES: Record<TagCategory, string> = {
  business: Styles.tag_business,
  creativity: Styles.tag_creativity,
  languages: Styles.tag_languages,
  education: Styles.tag_education,
  health: Styles.tag_health,
  home: Styles.tag_home,
  more: Styles.tag_more,
}

export const TagUI = ({ category, label }: TagProps) => {
  return <span className={clsx(Styles.tag, CATEGORY_STYLES[category])}>{label}</span>
}
