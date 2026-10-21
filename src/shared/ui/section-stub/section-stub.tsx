import clsx from 'clsx'
import type { SectionStubProps } from './types'
import styles from './section-stub.module.css'

export const SectionStub = ({ className }: SectionStubProps) => (
  <p className={clsx(styles.stub, className)}>Раздел ещё в разработке</p>
)
