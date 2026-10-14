import type { ReactNode } from 'react'
import type { IllustrationPanelProps } from '@/shared/ui/illustration-panel'

export interface AuthFrameProps extends Pick<
  IllustrationPanelProps,
  'illustration' | 'title' | 'text'
> {
  children: ReactNode
  className?: string
}
