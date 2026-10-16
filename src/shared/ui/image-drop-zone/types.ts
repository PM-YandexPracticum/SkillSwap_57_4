export interface ImageDropZoneProps {
  files: File[]
  onChange: (files: File[]) => void
  error?: string
  className?: string
}
