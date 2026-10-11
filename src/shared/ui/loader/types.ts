export type LoaderSize = 's' | 'm' | 'l'

export interface LoaderProps {
  size?: LoaderSize
  fullPage?: boolean
  className?: string
}
