import { Children, type SVGProps } from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import clsx from 'clsx'

import { useCarouselState } from '@/shared/hooks/useCarouselState'
import { ChevronRightIcon } from '@/shared/assets/icons'
import { IconButton } from '@/shared/ui/icon-button'
import type { CarouselProps } from './types'

import styles from './carousel.module.css'

const ChevronLeftIcon = ({ className, ...props }: SVGProps<SVGSVGElement>) => (
  <ChevronRightIcon className={clsx(styles.flipped, className)} {...props} />
)

export const Carousel = ({ children, className }: CarouselProps) => {
  const [emblaRef, emblaApi] = useEmblaCarousel({ align: 'start' })
  const { canScrollPrev, canScrollNext } = useCarouselState(emblaApi)

  const handleNextClick = () => emblaApi?.scrollNext()
  const handlePrevClick = () => emblaApi?.scrollPrev()

  return (
    <div className={clsx(styles.carousel, className)}>
      <div className={styles.viewport} ref={emblaRef}>
        <div className={styles.container}>
          {Children.map(children, (child) => (
            <div className={styles.slide}>{child}</div>
          ))}
        </div>
      </div>

      {canScrollPrev && (
        <IconButton
          className={clsx(styles.arrow, styles.prev)}
          icon={<ChevronLeftIcon />}
          aria-label="Пролистать назад"
          onClick={handlePrevClick}
        />
      )}

      {canScrollNext && (
        <IconButton
          className={clsx(styles.arrow, styles.next)}
          icon={<ChevronRightIcon />}
          aria-label="Пролистать вперёд"
          onClick={handleNextClick}
        />
      )}
    </div>
  )
}
