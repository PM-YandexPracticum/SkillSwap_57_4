import clsx from 'clsx'
import type { IllustrationPanelProps } from './types'
import styles from './illustration-panel.module.css'

export const IllustrationPanel = ({
  illustration,
  title,
  text,
  className,
}: IllustrationPanelProps) => {
  return (
    <section className={clsx(styles.panel, className)}>
      <div className={styles.illustration} aria-hidden="true">
        {illustration}
      </div>

      <h2 className={styles.title}>{title}</h2>

      <p className={styles.text}>{text}</p>
    </section>
  )
}
