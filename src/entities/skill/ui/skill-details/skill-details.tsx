import { useEffect } from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import { clsx } from 'clsx'
import { useCarouselState } from '@/shared/hooks/useCarouselState'
import { IconButton } from '@/shared/ui/icon-button'
import { ChevronRightIcon } from '@/shared/assets/icons'
import type { SkillDetailsProps } from './types'
import styles from './skill-details.module.css'

const VISIBLE_THUMBNAILS = 3

export const SkillDetails = ({
  title,
  description,
  categoryName,
  subcategoryName,
  images,
  variant = 'page',
  titleAs = 'h1',
  actions,
  className,
}: SkillDetailsProps) => {
  const Title = titleAs
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true })
  const { canScrollPrev, canScrollNext, selectedIndex } = useCarouselState(emblaApi)

  const [thumbsRef, thumbsApi] = useEmblaCarousel({ axis: 'y', containScroll: 'keepSnaps' })
  const { selectedIndex: thumbsIndex } = useCarouselState(thumbsApi)

  const lastStart = Math.max(images.length - VISIBLE_THUMBNAILS, 0)
  const firstVisible = Math.min(Math.max(thumbsIndex - 1, 0), lastStart)
  const hiddenCount = Math.max(images.length - VISIBLE_THUMBNAILS - firstVisible, 0)

  useEffect(() => {
    thumbsApi?.scrollTo(selectedIndex)
  }, [thumbsApi, selectedIndex])

  const handlePrevClick = () => emblaApi?.scrollPrev()
  const handleNextClick = () => emblaApi?.scrollNext()
  const handleThumbnailClick = (index: number) => emblaApi?.scrollTo(index)

  return (
    <div className={clsx(styles.skillDetails, styles[variant], className)}>
      <div className={styles.info}>
        <Title className={styles.title}>{title}</Title>
        <p className={styles.category}>
          {categoryName} / {subcategoryName}
        </p>
        <p className={styles.description}>{description}</p>
        {actions && <div className={styles.actions}>{actions}</div>}
      </div>

      {images.length > 0 && (
        <div className={styles.gallery}>
          <div className={styles.sliders}>
            <div className={styles.viewport} ref={emblaRef}>
              <div className={styles.slides}>
                {images.map((src, index) => (
                  <img
                    key={`${src}-${index}`}
                    className={styles.slide}
                    src={src}
                    alt={`${title}, фото ${index + 1}`}
                    loading={index === 0 ? 'eager' : 'lazy'}
                  />
                ))}
              </div>
            </div>

            {images.length > 1 && (
              <>
                <IconButton
                  className={clsx(styles.arrow, styles.prev)}
                  icon={<ChevronRightIcon />}
                  aria-label="Предыдущее фото"
                  disabled={!canScrollPrev}
                  onClick={handlePrevClick}
                />
                <IconButton
                  className={clsx(styles.arrow, styles.next)}
                  icon={<ChevronRightIcon />}
                  aria-label="Следующее фото"
                  disabled={!canScrollNext}
                  onClick={handleNextClick}
                />
              </>
            )}
          </div>

          {images.length > 1 && (
            <div className={styles.thumbnails}>
              <div className={styles.thumbnailsViewport} ref={thumbsRef}>
                <ul className={styles.thumbnailsList}>
                  {images.map((src, index) => {
                    const isSelected = index === selectedIndex

                    return (
                      <li key={`${src}-${index}`} className={styles.thumbnail}>
                        <button
                          className={clsx(
                            styles.thumbnailButton,
                            isSelected && styles.thumbnailSelected,
                          )}
                          type="button"
                          aria-label={`Показать фото ${index + 1}`}
                          aria-current={isSelected}
                          onClick={() => handleThumbnailClick(index)}
                        >
                          <img className={styles.thumbnailImage} src={src} alt="" loading="lazy" />
                        </button>
                      </li>
                    )
                  })}
                </ul>
              </div>

              {hiddenCount > 0 && (
                <span className={styles.more} aria-hidden="true">
                  +{hiddenCount}
                </span>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
