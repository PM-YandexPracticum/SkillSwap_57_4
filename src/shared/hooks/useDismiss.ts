import { useEffect, useRef, type RefObject } from 'react'

type UseDismissParams = {
  ref: RefObject<HTMLElement | null>
  onDismiss: () => void
  isActive: boolean
}

/**
 * Вызывает `onDismiss` при клике мимо `ref` или при нажатии `Escape`.
 * Обработчики вешаются на `document` только при `isActive === true`
 * и снимаются при его смене на `false` или размонтировании компонента.
 *
 * @example
 * const wrapperRef = useRef<HTMLDivElement>(null)
 * const [isOpen, setIsOpen] = useState(false)
 *
 * useDismiss({
 *   ref: wrapperRef,
 *   onDismiss: () => setisOpen(false),
 *   isActive: isOpen
 * })
 */
export function useDismiss({ ref, onDismiss, isActive }: UseDismissParams) {
  const onDismissRef = useRef(onDismiss)

  useEffect(() => {
    onDismissRef.current = onDismiss
  }, [onDismiss])

  useEffect(() => {
    if (!isActive) return

    const handleMouseDown = (event: MouseEvent) => {
      const target = event.target
      if (target instanceof Node && ref.current?.contains(target)) return
      onDismissRef.current()
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onDismissRef.current()
    }

    document.addEventListener('mousedown', handleMouseDown)
    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('mousedown', handleMouseDown)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [ref, isActive])
}
