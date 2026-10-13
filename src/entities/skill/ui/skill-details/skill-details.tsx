import { clsx } from 'clsx'
import styles from './skill-details.module.css'
import type { SkillDetailsProps } from './types'

const MAX_THUMBNAILS = 3

export const SkillDetails = ({
  title,
  description,
  categoryName,
  subcategoryName,
  images,
  titleAs = 'h1',
  actions,
  className,
}: SkillDetailsProps) => {
  const Title = titleAs
  const [mainImage, ...restImages] = images
  const thumbnails = restImages.slice(0, MAX_THUMBNAILS)
  const hiddenCount = restImages.length - thumbnails.length

  return (
    <div className={clsx(styles.skillDetails, className)}>
      <div className={styles.info}>
        <Title className={styles.title}>{title}</Title>
        <p className={styles.category}>
          {categoryName} / {subcategoryName}
        </p>
        <p className={styles.description}>{description}</p>
        {actions && <div className={styles.actions}>{actions}</div>}
      </div>

      {mainImage && (
        <div className={styles.gallery}>
          <img className={styles.mainImage} src={mainImage} alt={title} />

          {thumbnails.length > 0 && (
            <ul className={styles.thumbnails}>
              {thumbnails.map((src, index) => {
                const isLast = index === thumbnails.length - 1
                const showCounter = isLast && hiddenCount > 0

                return (
                  <li
                    key={src}
                    className={clsx(styles.thumbnail, showCounter && styles.thumbnailMore)}
                    data-count={showCounter ? `+${hiddenCount}` : undefined}
                  >
                    <img className={styles.thumbnailImage} src={src} alt="" />
                  </li>
                )
              })}
            </ul>
          )}
        </div>
      )}
    </div>
  )
}
