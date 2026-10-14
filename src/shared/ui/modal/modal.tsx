import { useRef } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import clsx from 'clsx'
import type { ModalProps } from './types'
import styles from './modal.module.css'

export const Modal = ({ isOpen, onClose, title, children, className }: ModalProps) => {
  const previouslyFocusedElementRef = useRef<HTMLElement | null>(null)

  return (
    <Dialog.Root open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className={styles.overlay} />
        <Dialog.Content
          className={clsx(styles.content, className)}
          aria-describedby={undefined}
          onOpenAutoFocus={() => {
            const activeElement = document.activeElement
            previouslyFocusedElementRef.current =
              activeElement instanceof HTMLElement ? activeElement : null
          }}
          onCloseAutoFocus={(event) => {
            event.preventDefault()
            previouslyFocusedElementRef.current?.focus()
            previouslyFocusedElementRef.current = null
          }}
        >
          <Dialog.Title className={styles.title}>{title}</Dialog.Title>
          {children}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
