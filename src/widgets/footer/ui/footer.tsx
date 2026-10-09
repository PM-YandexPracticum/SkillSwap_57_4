import { NavLink } from 'react-router-dom'
import { ROUTES, STUB_ROUTES } from '@/shared/lib/constants'
import styles from './footer.module.css'
import { Logo } from '@/shared/ui/logo'

interface FooterLink {
  text: string
  to: string
}

const FOOTER_LINKS: FooterLink[] = [
  { text: 'О проекте', to: STUB_ROUTES.ABOUT },
  { text: 'Контакты', to: STUB_ROUTES.CONTACTS },
  { text: 'Политика конфиденциальности', to: STUB_ROUTES.PRIVACY },
  { text: 'Все навыки', to: ROUTES.HOME },
  { text: 'Блог', to: STUB_ROUTES.BLOG },
  { text: 'Пользовательское соглашение', to: STUB_ROUTES.TERMS },
]

export const Footer = () => {
  const currentYear = new Date().getFullYear()

  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <Logo />
        <nav aria-label="Нижнее меню" className={styles.nav}>
          <ul className={styles.list}>
            {FOOTER_LINKS.map((link) => (
              <li key={link.text}>
                <NavLink to={link.to} className={styles.link}>
                  {link.text}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
        <span className={styles.copyright}>SkillSwap - {currentYear}</span>
      </div>
    </footer>
  )
}
