import clsx from 'clsx'
import { IllustrationPanel } from '@/shared/ui/illustration-panel'
import type { AuthFrameProps } from './types'
import styles from './auth-frame.module.css'

export const AuthFrame = ({ children, illustration, title, text, className }: AuthFrameProps) => {
  return (
    <div className={clsx(styles.frame, className)}>
      <div className={styles.content}>{children}</div>
      <IllustrationPanel illustration={illustration} title={title} text={text} />
    </div>
  )
}
