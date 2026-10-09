import { useId } from 'react'
import { CardsSectionProps } from './types'

import styles from './cards-section.module.css'

export const CardsSection = ({ title, action, children, className }: CardsSectionProps) => {
  const titleId = useId()

  return (
    <section className={className} aria-labelledby={titleId}>
      <div className={styles.header}>
        <h2 className={styles.title} id={titleId}>
          {title}
        </h2>
        {action}
      </div>
      <div className={styles.grid}>{children}</div>
    </section>
  )
}
