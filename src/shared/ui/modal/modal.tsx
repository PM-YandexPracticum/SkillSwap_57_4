import { useRef } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import clsx from 'clsx'
import type { ModalProps } from './types'
import styles from './modal.module.css'

export const Modal = ({ isOpen, onClose, title, icon, children, className }: ModalProps) => {
  const previouslyFocusedElementRef = useRef<HTMLElement | null>(null)

  const handleOpenChange = (open: boolean) => {
    if (!open) onClose()
  }

  const handleOpenAutoFocus = () => {
    const activeElement = document.activeElement
    previouslyFocusedElementRef.current =
      activeElement instanceof HTMLElement ? activeElement : null
  }

  const handleCloseAutoFocus = (e: Event) => {
    e.preventDefault()
    previouslyFocusedElementRef.current?.focus()
    previouslyFocusedElementRef.current = null
  }

  return (
    <Dialog.Root open={isOpen} onOpenChange={handleOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className={styles.overlay}>
          <Dialog.Content
            className={clsx(styles.content, className)}
            aria-describedby={undefined}
            onOpenAutoFocus={handleOpenAutoFocus}
            onCloseAutoFocus={handleCloseAutoFocus}
          >
            {icon && (
              <span className={styles.icon} aria-hidden="true">
                {icon}
              </span>
            )}
            <Dialog.Title className={styles.title}>{title}</Dialog.Title>
            {children}
          </Dialog.Content>
        </Dialog.Overlay>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
