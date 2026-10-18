import clsx from 'clsx'
import type { RegistrationStepsProps } from './types'
import styles from './registration-steps.module.css'

export const RegistrationSteps = ({ step, total }: RegistrationStepsProps) => {
  return (
    <div className={styles.steps}>
      <p className={styles.label}>
        Шаг {step} из {total}
      </p>
      <div className={styles.bar} aria-hidden="true">
        {Array.from({ length: total }, (_, index) => (
          <span key={index} className={clsx(styles.segment, index < step && styles.done)} />
        ))}
      </div>
    </div>
  )
}
