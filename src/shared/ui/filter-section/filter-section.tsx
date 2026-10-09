import type { FilterSectionProps } from './types'
import styles from './filter-section.module.css'

export const FilterSection = ({ title, hideTitle = false, children }: FilterSectionProps) => {
  return (
    <fieldset>
      <legend className={hideTitle ? 'visually-hidden' : styles.title}>{title}</legend>
      {children}
    </fieldset>
  )
}
