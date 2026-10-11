import clsx from 'clsx'
import { ClipLoader } from 'react-spinners'
import type { LoaderProps, LoaderSize } from './types'
import styles from './loader.module.css'

const LOADER_SIZES: Record<LoaderSize, number> = {
  s: 24,
  m: 48,
  l: 72,
}

export const Loader = ({ size = 'm', fullPage = false, className }: LoaderProps) => (
  <div className={clsx(styles.loader, fullPage && styles.fullPage, className)} role="status">
    <ClipLoader size={LOADER_SIZES[size]} color="var(--color-link)" aria-hidden="true" />
    <span className="visually-hidden">Загрузка...</span>
  </div>
)
