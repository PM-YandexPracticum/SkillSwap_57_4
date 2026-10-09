import clsx from 'clsx'
import { useId } from 'react'

import { CardsSectionProps } from './types'

export const CardsSection = ({ title, action, children, className }: CardsSectionProps) => {
  const titleId = useId()

  return (
    <section className={clsx(className)} aria-labelledby={titleId}>
      <div className={clsx()}>
        <h2 className={clsx()} id={titleId}>
          {title}
        </h2>
        {action ? <div className={clsx()}>{action}</div> : null}
      </div>
      <div className={clsx()}>{children}</div>
    </section>
  )
}
