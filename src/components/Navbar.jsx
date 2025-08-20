import { useState, useEffect, useMemo } from 'react'
import i18next from 'i18next'
import { useTranslation } from 'react-i18next'
import profilePhoto from '/src/assets/photo.jpg'
import { SiReact, SiJavascript, SiTypescript, SiFortran, SiSanity, SiMongodb, SiC, SiDocker, SiPytorch } from 'react-icons/si'
import { FaPython } from 'react-icons/fa'
import { SocialIcon } from 'react-social-icons'
import { Link } from 'react-router-dom'



export default function Navbar() {
  const { t } = useTranslation()
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      // header expanded height ~20% of viewport, compact height 80px -> threshold = expanded - compact
      const expandedPx = window.innerHeight * 0.2
      const compactPx = 80
      const threshold = Math.max(20, expandedPx - compactPx)
      setScrolled(window.scrollY > threshold)
    }
    handleScroll()
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    if (scrolled) document.body.classList.add('header-fixed-active')
    else document.body.classList.remove('header-fixed-active')
  }, [scrolled])

  const skillIcons = [
    { Icon: FaPython, title: 'Python' },
    { Icon: SiReact, title: 'React' },
    { Icon: SiJavascript, title: 'JavaScript' },
    { Icon: SiTypescript, title: 'TypeScript' },
    { Icon: SiFortran, title: 'Fortran' },
    { Icon: SiSanity, title: 'Sanity' },
    { Icon: SiMongodb, title: 'MongoDB' },
    { Icon: SiC, title: 'C' },
    { Icon: SiDocker, title: 'Docker' },
    { Icon: SiPytorch, title: 'PyTorch' }
  ]

  // build ticker items: prefer icons, append text-only skills at end
  const tickerItems = useMemo(() => {
    let textSkills = []
    try {
      const s = t('skills', { returnObjects: true })
      if (Array.isArray(s)) textSkills = s
    } catch (e) { /* ignore */ }

    const iconTitles = skillIcons.map(s => s.title.toLowerCase())
    const items = [...skillIcons.map(s => ({ title: s.title, Icon: s.Icon }))]
    // append any text skills not already represented
    textSkills.forEach(ts => {
      if (!iconTitles.includes((ts || '').toString().toLowerCase())) {
        items.push({ title: ts, Icon: null })
      }
    })
    if (items.length === 0) items.push({ title: 'Skills', Icon: null })
    return [...items, ...items] // duplicate for smooth loop
  }, [t])

  return (
    <header
      aria-hidden={false}
      className={`transition-[height,background] mx-0 my-0 duration-500 ease-in-out z-40 w-full ${scrolled ? 'fixed top-0 left-0 right-0 h-20 shadow-md' : 'relative h-[20vh]'} bg-gray-50/95 backdrop-blur-md border-b border-gray-200/20`}
    >
      <div className="max-w-6xl mx-auto px-6 h-full flex items-center relative">
        {/* Profile photo */}
        <img
          src={profilePhoto}
          alt={t('hero.title')}
          className={`rounded-full object-cover border-0 transition-all duration-500 ${scrolled ? 'w-16 h-16' : 'w-24 h-24'}`}
          width={scrolled ? 64 : 96}
          height={scrolled ? 64 : 96}
          style={{ minWidth: scrolled ? 64 : 96 }}
        />

        {/* Title, subtitle, socials */}
        <div className="flex flex-col justify-center min-w-0 flex-1 ml-6">
          <span className={`font-bold transition-all duration-500 truncate ${scrolled ? 'text-xl' : 'text-2xl'}`} style={{ textDecoration: 'none', cursor: 'default', color: 'inherit' }}>{t('hero.title')}</span>
          <div className={`muted transition-all duration-500 truncate ${scrolled ? 'text-base' : 'text-lg'}`}>{t('hero.subtitle')}</div>
          <div className="flex items-center gap-4 mt-1">
            <SocialIcon url={`mailto:${t('contact.email') || 'laurapdec@gmail.com'}`} style={{ height: 36, width: 36 }} />
            <SocialIcon url={t('contact.linkedin') || 'https://linkedin.com/in/laurapdec'} style={{ height: 36, width: 36 }} />
          </div>
        </div>

        {/* Heart and language selector flush right */}
          <div className="right-0 top-1/2 flex items-center gap-2">
            <div className="relative group">
              <button
                aria-label="Like"
                className={`transition-opacity text-lg bg-transparent rounded-full p-1 border border-transparent ${window.location.pathname.includes('portfolio') ? 'opacity-100' : 'opacity-80 hover:opacity-100'}`}
                onClick={() => {
                  if (window.location.pathname.includes('portfolio')) {
                    window.location.href = './'
                  } else {
                    window.dispatchEvent(new CustomEvent('art:toggle', { detail: { open: true } }))
                    window.location.href = '/portfolio'
                  }
                }}
                onMouseEnter={e => {
                  e.currentTarget.querySelector('span.heart-emoji').textContent = window.location.pathname.includes('portfolio') ? '💔' : '❤️';
                  const tip = e.currentTarget.parentNode.querySelector('.heart-tip');
                  tip.style.opacity = 1;
                  tip.textContent = window.location.pathname.includes('portfolio') ? 'close' : 'open';
                }}
                onMouseLeave={e => {
                  e.currentTarget.querySelector('span.heart-emoji').textContent = window.location.pathname.includes('portfolio') ? '💔' : '❤️';
                  const tip = e.currentTarget.parentNode.querySelector('.heart-tip');
                  tip.style.opacity = 0;
                }}
              >
                <span className="heart-emoji" role="img" aria-label="heart">{window.location.pathname.includes('portfolio') ? '💔' : '❤️'}</span>
              </button>
              <span className="heart-tip absolute left-1/2 -translate-x-1/2 -top-5 -translate-y-[120%]  px-2 py-1 text-xs bg-black/70 text-white rounded opacity-0 transition-opacity pointer-events-none whitespace-nowrap">open</span>
            </div>
            <select
              aria-label="Change language"
              className="bg-inherit text-sm rounded px-3 py-1 border-0 focus:outline-none"
              value={i18next.language}
              onChange={e => i18next.changeLanguage(e.target.value)}
              style={{ minWidth: 56 }}
            >
              <option value="en">EN</option>
              <option value="fr">FR</option>
              <option value="pt">PT</option>
            </select>
          </div>
              </div>

      <div className="w-full border-t border-gray-200/10 bg-gray-50/90">
        <div className="max-w-6xl mx-auto px-6 overflow-hidden">
          <div className="marquee-wrapper relative">
            <div className="marquee flex items-center gap-8 py-2">
              {tickerItems.map((it, i) => {
                const Icon = it.Icon
                return (
                  <div key={i} className="flex items-center gap-2 whitespace-nowrap text-sm text-gray-700">
                    {Icon ? <Icon className="text-base" /> : <span className="text-xs">•</span>}
                    <span className="font-medium">{it.title}</span>
                    <span className="mx-2 text-gray-400">·</span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
