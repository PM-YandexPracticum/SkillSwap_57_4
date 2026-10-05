import { TagCategory, TagProps } from './types'
import clsx from 'clsx'
import styles from './tag.module.css'

const CATEGORY_STYLES: Record<TagCategory, string> = {
  business: styles.business,
  creativity: styles.creativity,
  languages: styles.languages,
  education: styles.education,
  health: styles.health,
  home: styles.home,
  more: styles.more,
}

export const Tag = ({ category, label }: TagProps) => {
  return <span className={clsx(styles.tag, CATEGORY_STYLES[category])}>{label}</span>
}
