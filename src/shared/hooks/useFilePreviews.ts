import { useState, useEffect } from 'react';

export type FilePreview = { file: File; url: string };

export const useFilePreviews = (files: File[]): FilePreview[] => {
  const [previews, setPreviews] = useState<FilePreview[]>([]);

  useEffect(() => {
    const newPreviews = files.map((file) => ({
      file,
      url: URL.createObjectURL(file),
    }));

    setPreviews(newPreviews);

    return () => {
      newPreviews.forEach((preview) => URL.revokeObjectURL(preview.url));
    };
  }, [files]);

  return previews;
};