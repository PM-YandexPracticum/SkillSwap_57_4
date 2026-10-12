import clsx from 'clsx'
import { Button } from '@/shared/ui/button'
import { GoogleIcon, AppleIcon } from '@/shared/assets/icons'
import type { SocialAuthProps } from './types'
import styles from './social-auth.module.css'

export const SocialAuth = ({ className }: SocialAuthProps) => {
  return (
    <div className={clsx(styles.socialAuth, className)}>
      <div className={styles.buttons}>
        <Button
          variant="secondary"
          leftIcon={<GoogleIcon />}
          fullWidth
          aria-disabled="true"
          type="button"
        >
          Продолжить с Google
        </Button>

        <Button
          variant="secondary"
          leftIcon={<AppleIcon />}
          fullWidth
          aria-disabled="true"
          type="button"
        >
          Продолжить с Apple
        </Button>
      </div>

      <div className={styles.divider}>
        <span>или</span>
      </div>
    </div>
  )
}
