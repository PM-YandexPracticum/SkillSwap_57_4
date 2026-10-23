import { Children, useId } from 'react'
import { Carousel } from '@/shared/ui/carousel'
import type { CardsSectionProps } from './types'

import styles from './cards-section.module.css'

export const CardsSection = ({
  title,
  action,
  carousel = false,
  children,
  className,
}: CardsSectionProps) => {
  const titleId = useId()

  return (
    <section className={className} aria-labelledby={titleId}>
      <div className={styles.header}>
        <h2 className={styles.title} id={titleId}>
          {title}
        </h2>
        {action}
      </div>

      {carousel ? (
        <Carousel className={styles.carousel}>{children}</Carousel>
      ) : (
        <ul className={styles.grid}>
          {Children.map(children, (child) => (
            <li className={styles.item}>{child}</li>
          ))}
        </ul>
      )}
    </section>
  )
}
