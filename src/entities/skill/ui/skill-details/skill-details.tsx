import clsx from 'clsx'
import type { SkillDetailsProps } from './types'
import styles from './skill-details.module.css'

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
  const mainImage = images[0]
  const thumbnails = images.slice(1, 4)
  const extraImagesCount = images.length - 4

  return (
    <div className={clsx(styles.wrapper, className)}>
      <div className={styles.info}>
        <Title className={styles.title}>{title}</Title>
        <p className={styles.subtitle}>
          {categoryName} / {subcategoryName}
        </p>
        <p className={styles.description}>{description}</p>
        {actions && <div className={styles.actions}>{actions}</div>}
      </div>

      {images.length > 0 && (
        <div className={styles.gallery}>
          <div className={styles['main-image-wrapper']}>
            <img src={mainImage} alt={title} className={styles['main-image']} />
          </div>
          {thumbnails.length > 0 && (
            <div className={styles.thumbnails}>
              {thumbnails.map((src, index) => {
                const isLastThumbnail = index === 2
                const showOverlay = isLastThumbnail && extraImagesCount > 0

                return (
                  <div key={src} className={styles['thumbnail-wrapper']}>
                    <img src={src} alt="" className={styles.thumbnail} />
                    {showOverlay && (
                      <div className={styles.overlay}>
                        <span className={styles['overlay-text']}>
                          +{extraImagesCount}
                        </span>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
