import { forwardRef, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { clsx } from 'clsx';
import { AvatarInputProps } from './types';
import { Avatar } from '@/shared/ui/avatar';
import { MAX_IMAGE_SIZE, IMAGE_ACCEPT, getRejectionError } from '@/shared/lib/files';
import AddIcon from '@/shared/assets/icons/add.svg?react';
import GalleryEditIcon from '@/shared/assets/icons/gallery-edit.svg?react';
import styles from './avatar-input.module.css';

export const AvatarInput = forwardRef<HTMLButtonElement, AvatarInputProps>(
  ({ src, onChange, size = 'form', error, className }, ref) => {
    const [localError, setLocalError] = useState<string | undefined>();

    const { getInputProps, open } = useDropzone({
      accept: IMAGE_ACCEPT,
      maxSize: MAX_IMAGE_SIZE,
      multiple: false,
      noClick: true,
      noKeyboard: true,
      noDrag: true,
      onDrop: (accepted, rejected) => {
        setLocalError(getRejectionError(rejected));
        if (accepted.length > 0) {
          onChange(accepted[0]);
        }
      },
    });

    const displayError = error || localError;

    return (
      <div className={clsx(styles.container, className)}>
        <button
          type="button"
          ref={ref}
          onClick={open}
          className={styles.button}
          aria-label={src ? 'Изменить фото профиля' : 'Загрузить фото профиля'}
        >
          <input {...getInputProps()} />
          <Avatar src={src || undefined} size={size} alt="Фото профиля" />
          <div className={styles.overlayIcon}>
            {src ? <GalleryEditIcon /> : <AddIcon />}
          </div>
        </button>
        {displayError && <span className={styles.error}>{displayError}</span>}
      </div>
    );
  }
);
AvatarInput.displayName = 'AvatarInput';