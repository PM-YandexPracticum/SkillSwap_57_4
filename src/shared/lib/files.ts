import { FileRejection } from 'react-dropzone';

export const MAX_IMAGE_SIZE = 2 * 1024 * 1024; // 2 МБ
export const IMAGE_ACCEPT = { 'image/jpeg': [], 'image/png': [] };
export const IMAGE_TYPE_ERROR = 'Можно загрузить только JPEG или PNG';
export const IMAGE_SIZE_ERROR = 'Размер фото - не больше 2 МБ';

export const getRejectionError = (rejections: FileRejection[]): string | undefined => {
  if (!rejections.length) return undefined;
  const error = rejections[0].errors[0];
  if (error.code === 'file-too-large') return IMAGE_SIZE_ERROR;
  if (error.code === 'file-invalid-type') return IMAGE_TYPE_ERROR;
  return error.message;
};