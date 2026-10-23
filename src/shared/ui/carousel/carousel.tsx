import { Children, useEffect, useRef, type SVGProps } from 'react'
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

  const prevRef = useRef<HTMLButtonElement>(null)
  const nextRef = useRef<HTMLButtonElement>(null)
  const focusTargetRef = useRef<'prev' | 'next' | null>(null)

  useEffect(() => {
    if (focusTargetRef.current === 'prev') prevRef.current?.focus()
    if (focusTargetRef.current === 'next') nextRef.current?.focus()
    focusTargetRef.current = null
  }, [canScrollPrev, canScrollNext])

  const handleNextClick = () => {
    if (!emblaApi) return

    emblaApi.scrollNext()
    if (!emblaApi.canScrollNext()) focusTargetRef.current = 'prev'
  }

  const handlePrevClick = () => {
    if (!emblaApi) return

    emblaApi.scrollPrev()
    if (!emblaApi.canScrollPrev()) focusTargetRef.current = 'next'
  }

  return (
    <div className={clsx(styles.carousel, className)}>
      <div className={styles.viewport} ref={emblaRef}>
        <ul className={styles.container}>
          {Children.map(children, (child) => (
            <li className={styles.slide}>{child}</li>
          ))}
        </ul>
      </div>

      {canScrollPrev && (
        <IconButton
          ref={prevRef}
          className={clsx(styles.arrow, styles.prev)}
          icon={<ChevronLeftIcon />}
          aria-label="Пролистать назад"
          onClick={handlePrevClick}
        />
      )}

      {canScrollNext && (
        <IconButton
          ref={nextRef}
          className={clsx(styles.arrow, styles.next)}
          icon={<ChevronRightIcon />}
          aria-label="Пролистать вперёд"
          onClick={handleNextClick}
        />
      )}
    </div>
  )
}
