import { useState, useEffect, useRef } from 'react'
import { Link, useLocation } from 'react-router-dom'
import i18next from 'i18next'
import { useTranslation } from 'react-i18next'
import profilePhoto from '/images/me.jpg'
import { SocialIcon } from 'react-social-icons'

const NAV_LINKS = [
  { to: '/', key: 'home' },
  { to: '/photography', key: 'photography' },
  { to: '/video', key: 'video' },
  { to: '/writing', key: 'writing' },
  { to: '/about', key: 'about' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const headerRef = useRef(null)
  const [headerHeight, setHeaderHeight] = useState(0)
  const { t } = useTranslation()
  const location = useLocation()
  const [lang, setLang] = useState(typeof window !== 'undefined' ? i18next.language : 'en')
  const [menuOpen, setMenuOpen] = useState(false)

  const changeLang = (v) => {
    setLang(v)
    i18next.changeLanguage(v)
  }

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (scrolled) document.body.classList.add('header-fixed-active')
    else document.body.classList.remove('header-fixed-active')
  }, [scrolled])

  useEffect(() => {
    const update = () => setHeaderHeight(headerRef.current?.offsetHeight || 0)
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

  useEffect(() => {
    let raf = requestAnimationFrame(() => setHeaderHeight(headerRef.current?.offsetHeight || 0))
    return () => cancelAnimationFrame(raf)
  }, [scrolled, menuOpen])

  useEffect(() => { setMenuOpen(false) }, [location.pathname])

  return (
    <>
      {scrolled && <div style={{ height: headerHeight, width: '100%', margin: 0, padding: 0 }} aria-hidden="true" />}
      <header ref={headerRef} className="w-full fixed top-0 inset-x-0 z-50 transition-all duration-300 m-0 p-0 bg-ink/90 backdrop-blur-sm shadow-sm">
        <div className="block max-w-6xl mx-auto px-6 transition-all duration-500 py-4">
          <div className="flex items-center gap-4">
            <Link to="/" className="flex-shrink-0 w-16 h-16 md:w-20 md:h-20">
              <img src={profilePhoto} alt="Laura Pereira de Castro" className="w-full h-full rounded-full object-cover shadow-sm" style={{ maxWidth: 80, maxHeight: 80 }} />
            </Link>
            <div className="flex-1 flex items-center justify-between min-w-0">
              <div className="flex-1 min-w-0 pr-4">
                <Link to="/" className="block">
                  <h1 className="text-xl md:text-2xl font-semibold truncate text-cream">Laura Pereira de Castro</h1>
                  <div className="text-cream/60 mt-1 truncate">{t('headline')}</div>
                </Link>
              </div>
              <div className="hidden md:flex items-center gap-2 flex-shrink-0">
                <SocialIcon url="mailto:laurapdec@hotmail.com" style={{ height: 32, width: 32 }} className="social-icon" />
                <SocialIcon url="https://linkedin.com/in/laurapdec" style={{ height: 32, width: 32 }} className="social-icon" />
                <SocialIcon url="https://instagram.com/laurapdec" style={{ height: 32, width: 32 }} className="social-icon" />
                <SocialIcon url="https://tiktok.com/@laura.pc" style={{ height: 32, width: 32 }} className="social-icon" />
                <SocialIcon url="https://substack.com/@laurapdec" style={{ height: 32, width: 32 }} className="social-icon" />
                <select
                  aria-label="Change language"
                  className="bg-white/5 backdrop-blur-sm rounded-lg px-3 py-2 text-sm appearance-none hover:bg-white/10 transition-colors cursor-pointer"
                  value={lang}
                  onChange={e => changeLang(e.target.value)}
                >
                  <option value="en">🇬🇧</option>
                  <option value="fr">🇫🇷</option>
                  <option value="pt">🇧🇷</option>
                </select>
              </div>
              <button
                className="md:hidden p-2 -mr-2 flex-shrink-0"
                aria-label="Toggle menu"
                onClick={() => setMenuOpen(o => !o)}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {menuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
          </div>
        </div>

        <nav className={`max-w-6xl mx-auto px-6 border-t border-cream/10 ${menuOpen ? 'block' : 'hidden'} md:block`}>
          <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-6 py-3">
            {NAV_LINKS.map(link => (
              <Link
                key={link.to}
                to={link.to}
                className={`text-sm font-medium px-2 py-1.5 md:px-0 md:py-0 transition-colors ${
                  location.pathname === link.to ? 'text-white' : 'text-cream/60 hover:text-cream'
                }`}
              >
                {t(`nav.${link.key}`)}
              </Link>
            ))}
            <div className="md:hidden flex items-center gap-3 pt-2 mt-1 border-t border-cream/10">
              <SocialIcon url="mailto:laurapdec@hotmail.com" style={{ height: 28, width: 28 }} className="social-icon" />
              <SocialIcon url="https://linkedin.com/in/laurapdec" style={{ height: 28, width: 28 }} className="social-icon" />
              <SocialIcon url="https://instagram.com/laurapdec" style={{ height: 28, width: 28 }} className="social-icon" />
              <SocialIcon url="https://tiktok.com/@laura.pc" style={{ height: 28, width: 28 }} className="social-icon" />
              <SocialIcon url="https://substack.com/@laurapdec" style={{ height: 28, width: 28 }} className="social-icon" />
              <select
                aria-label="Change language"
                className="bg-white/5 backdrop-blur-sm rounded-lg px-3 py-1.5 text-sm appearance-none hover:bg-white/10 transition-colors cursor-pointer"
                value={lang}
                onChange={e => changeLang(e.target.value)}
              >
                <option value="en">🇬🇧</option>
                <option value="fr">🇫🇷</option>
                <option value="pt">🇧🇷</option>
              </select>
            </div>
          </div>
        </nav>
      </header>
    </>
  )
}
