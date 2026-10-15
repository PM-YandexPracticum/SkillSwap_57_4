import { forwardRef, useState, useId } from 'react'
import { useDropzone } from 'react-dropzone'
import { clsx } from 'clsx'
import type { FileRejection } from 'react-dropzone'
import type { AvatarInputProps } from './types'
import { Avatar } from '@/shared/ui/avatar'
import { MAX_IMAGE_SIZE, IMAGE_ACCEPT, getRejectionError } from '@/shared/lib/files'
import { AddIcon, GalleryEditIcon } from '@/shared/assets/icons'
import styles from './avatar-input.module.css'

export const AvatarInput = forwardRef<HTMLButtonElement, AvatarInputProps>(
  ({ src, onChange, size = 'form', error, className }, ref) => {
    const inputId = useId()
    const errorId = useId()
    const [localError, setLocalError] = useState<string | undefined>()

    const handleDrop = (accepted: File[], rejected: readonly FileRejection[]) => {
      setLocalError(getRejectionError(rejected))
      if (accepted.length > 0) {
        onChange(accepted[0])
      }
    }

    const { getInputProps, open } = useDropzone({
      accept: IMAGE_ACCEPT,
      maxSize: MAX_IMAGE_SIZE,
      multiple: false,
      noClick: true,
      noKeyboard: true,
      noDrag: true,
      onDrop: handleDrop,
    })

    const displayError = error || localError

    return (
      <div className={clsx(styles.container, className)}>
        <input {...getInputProps({ id: inputId })} />
        <button
          type="button"
          ref={ref}
          onClick={open}
          className={styles.button}
          aria-label={src ? 'Изменить фото профиля' : 'Загрузить фото профиля'}
          aria-describedby={displayError ? errorId : undefined}
        >
          <Avatar src={src} size={size} alt="" />
          <span
            className={clsx(styles.badge, size === 'l' && styles.badgeLarge)}
            aria-hidden="true"
          >
            {src ? <GalleryEditIcon /> : <AddIcon />}
          </span>
        </button>
        {displayError && (
          <p id={errorId} className={styles.error}>
            {displayError}
          </p>
        )}
      </div>
    )
  },
)

AvatarInput.displayName = 'AvatarInput'
