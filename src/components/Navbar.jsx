import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import i18next from 'i18next'
import { useTranslation } from 'react-i18next'
import profilePhoto from '/src/assets/photo.jpg'
import { SocialIcon } from 'react-social-icons'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const headerRef = useRef(null)
  const [headerHeight, setHeaderHeight] = useState(0)
  const { t } = useTranslation()
  const [lang, setLang] = useState(typeof window !== 'undefined' ? i18next.language : 'en')

  // No need for body padding as we're using a placeholder div

  const changeLang = (v) => {
    setLang(v)
    i18next.changeLanguage(v)
  }

  // No client-side width gating — rely on Tailwind's md breakpoint to show/hide desktop controls.

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

  // Re-measure header height whenever the header's fixed state changes
  useEffect(() => {
    let raf = null
    const measure = () => setHeaderHeight(headerRef.current?.offsetHeight || 0)
    // measure in next frame to allow layout to settle
    raf = requestAnimationFrame(measure)
    return () => {
      if (raf) cancelAnimationFrame(raf)
    }
  }, [scrolled])

  const nav = [
    { label: 'About', to: '/cv' },
    { label: 'Projects', to: '/projects' },
    { label: 'Contact', to: '/#contact' }
  ]

  const pathname = typeof window !== 'undefined' ? window.location.pathname : '/'
  const showCvHeader = pathname === '/cv' || pathname.startsWith('/cv')

  return (
    <>
      {scrolled && <div style={{ height: headerHeight, width: '100%', margin: 0, padding: 0 }} aria-hidden="true" />}
      <header ref={headerRef} className="w-full fixed top-0 inset-x-0 z-50 transition-all duration-300 m-0 p-0 bg-white/90 backdrop-blur-sm shadow-sm">
      {/* Single header: expanded CV block will be used as the single header across the site */}

      {/* Expanded CV-style area: visible only when not scrolled */}
      {/* expanded CV header: only visible on md+ to avoid taking full screen on mobile */}
  <div className={`${showCvHeader ? 'block' : 'hidden md:block'} max-w-6xl mx-auto px-6 transition-all duration-500 max-h-[160px] opacity-100 py-4`}>
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex-shrink-0 w-20 h-20 md:w-24 md:h-24">
            <img src={profilePhoto} alt="Profile" className="w-full h-full rounded-full object-cover shadow-sm" style={{maxWidth:96, maxHeight:96}} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-4 w-full">
              <div className="min-w-0">
                <h1 className="text-xl md:text-2xl font-semibold truncate">Laura Pereira de Castro</h1>
                <div className="text-sm text-muted mt-1 truncate">Machine Learning Engineer • Data Engineer</div>
                <p className="text-xs md:text-sm text-muted mt-1 truncate">Data Analyst</p>
                <nav className="mt-3 hidden md:flex items-center gap-4">
                  {nav.map(n => (
                    <a key={n.label} href={n.to} className="text-sm text-gray-700 hover:text-gray-900 transition py-1 px-2">{n.label}</a>
                  ))}
                </nav>
              </div>

              {/* Right-aligned controls inside the expanded CV header (desktop): socials + language select */}
              <div className="flex items-center">
                <SocialIcon url="mailto:laurapdec@gmail.com" style={{ height: 36, width: 36 }} className="social-icon" />
                <SocialIcon url="https://linkedin.com/in/laurapdec" style={{ height: 36, width: 36 }} className="social-icon" />
                <select
                  aria-label="Change language"
                  className="bg-white/5 backdrop-blur-sm rounded-full px-4 py-2 text-sm appearance-none shadow-sm"
                  value={lang}
                  onChange={e => changeLang(e.target.value)}
                  style={{ width: 36 }}
                >
                  <option value="en">EN</option>
                  <option value="fr">FR</option>
                  <option value="pt">PT</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* mobile menu removed (hamburger intentionally removed) */}
    </header>
    </>
  )
}
