import { forwardRef, useState, useId } from 'react';
import { useDropzone } from 'react-dropzone';
import { clsx } from 'clsx';
import { ImageDropZoneProps } from './types';
import { useFilePreviews } from '@/shared/hooks/useFilePreviews';
import { MAX_IMAGE_SIZE, IMAGE_ACCEPT, getRejectionError } from '@/shared/lib/files';
import GalleryAddIcon from '@/shared/assets/icons/gallery-add.svg?react';
import CrossIcon from '@/shared/assets/icons/cross.svg?react';
import { IconButton } from '@/shared/ui/icon-button';
import styles from './image-drop-zone.module.css';

export const ImageDropZone = forwardRef<HTMLButtonElement, ImageDropZoneProps>(
  ({ files, onChange, error, className }, ref) => {
    const inputId = useId();
    const [localError, setLocalError] = useState<string | undefined>();
    const previews = useFilePreviews(files);

    const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
      accept: IMAGE_ACCEPT,
      maxSize: MAX_IMAGE_SIZE,
      noClick: true,
      noKeyboard: true,
      onDrop: (accepted, rejected) => {
        setLocalError(getRejectionError(rejected));
        if (accepted.length > 0) {
          onChange([...files, ...accepted]);
        }
      },
    });

    const handleRemove = (indexToRemove: number) => {
      onChange(files.filter((_, i) => i !== indexToRemove));
    };

    const displayError = error || localError;

    return (
      <div className={clsx(styles.container, className)}>
        <div
          {...getRootProps({
            className: clsx(styles.dropzone, isDragActive && styles.dropzoneActive),
          })}
        >
          <input {...getInputProps({ id: inputId })} />
          <span className={styles.text}>Перетащите или выберите изображения навыка</span>
          <button type="button" ref={ref} className={styles.selectButton} onClick={open}>
            <GalleryAddIcon className={styles.buttonIcon} />
            Выбрать изображения
          </button>
        </div>

        {previews.length > 0 && (
          <div className={styles.previews}>
            {previews.map((preview, index) => (
              <div key={preview.url} className={styles.previewItem}>
                <img src={preview.url} alt="Превью" className={styles.image} />
                <IconButton
                  className={styles.removeButton}
                  icon={<CrossIcon />}
                  aria-label="Удалить фото"
                  onClick={() => handleRemove(index)}
                  type="button"
                />
              </div>
            ))}
          </div>
        )}

        {displayError && <p className={styles.error}>{displayError}</p>}
      </div>
    );
  }
);
ImageDropZone.displayName = 'ImageDropZone';