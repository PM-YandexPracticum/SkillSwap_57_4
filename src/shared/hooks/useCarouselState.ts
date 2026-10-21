import { useCallback, useEffect, useState } from 'react'
import type { UseEmblaCarouselType } from 'embla-carousel-react'

export type CarouselApi = NonNullable<UseEmblaCarouselType[1]>

/**
 * Состояние карусели embla для кнопок: можно ли листать и какой слайд выбран.
 * Пересчитываются по событиям embla: select - пролистали, reInit - поменялись слайды или размер.
 *
 * @example
 * const [emblaRef, emblaApi] = useEmblaCarousel()
 * const { canScrollPrev, canScrollNext } = useCarouselState(emblaApi)
 */
export function useCarouselState(api: CarouselApi | undefined) {
  const [canScrollPrev, setCanScrollPrev] = useState<boolean>(false)
  const [canScrollNext, setCanScrollNext] = useState<boolean>(false)
  const [selectedIndex, setSelectedIndex] = useState<number>(0)

  const update = useCallback((carousel: CarouselApi) => {
    setCanScrollPrev(carousel.canScrollPrev())
    setCanScrollNext(carousel.canScrollNext())
    setSelectedIndex(carousel.selectedScrollSnap())
  }, [])

  useEffect(() => {
    if (!api) return

    update(api)
    api.on('select', update).on('reInit', update)

    return () => {
      api.off('select', update).off('reInit', update)
    }
  }, [api, update])

  return { canScrollPrev, canScrollNext, selectedIndex }
}
