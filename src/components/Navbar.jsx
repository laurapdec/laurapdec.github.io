import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import i18next from 'i18next'
import { useTranslation } from 'react-i18next'
import profilePhoto from '/src/assets/photo.jpg'
import { SocialIcon } from 'react-social-icons'
import {
  SiJavascript,
  SiTypescript,
  SiFortran,
  SiMongodb,
  SiPytorch,
  SiNextdotjs,
  SiTensorflow,
  SiC,
  SiPandas,
  SiNumpy,
  SiScipy,
  SiGnubash,
  SiLatex,
  SiGooglecloud,
  SiPostgresql
} from 'react-icons/si'
import { TbBrandCpp } from 'react-icons/tb'
import { FaPython, FaReact, FaDocker, FaNodeJs, FaLinux, FaGitAlt } from 'react-icons/fa'

const getIconForTech = (tech) => {
  const icons = {
    'Python': FaPython,
    'React': FaReact,
    'React.js': FaReact,
    'JavaScript': SiJavascript,
    'TypeScript': SiTypescript,
    'Fortran': SiFortran,
    'MongoDB': SiMongodb,
    'C': SiC,
    'Docker': FaDocker,
    'PyTorch': SiPytorch,
    'Next.js': SiNextdotjs,
    'Node.js': FaNodeJs,
    'Tensorflow': SiTensorflow,
    'Pandas': SiPandas,
    'NumPy': SiNumpy,
    'SciPy': SiScipy,
    'Linux': FaLinux,
    'Git': FaGitAlt,
    'Bash': SiGnubash,
    'LaTeX': SiLatex,
    'GCP': SiGooglecloud,
    'PostgreSQL': SiPostgresql,
  }
  
  const Icon = icons[tech]
  return Icon ? <Icon className="text-base" /> : null
}

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

  return (
    <>
      {scrolled && <div style={{ height: headerHeight, width: '100%', margin: 0, padding: 0 }} aria-hidden="true" />}
      <header ref={headerRef} className="w-full fixed top-0 inset-x-0 z-50 transition-all duration-300 m-0 p-0 bg-white/90 backdrop-blur-sm shadow-sm">
      <div className="block max-w-6xl mx-auto px-6 transition-all duration-500 max-h-[174px] opacity-100 py-4">
        <div className="flex items-center gap-4">
          <div className="flex-shrink-0 w-20 h-20 md:w-24 md:h-24">
            <img src={profilePhoto} alt="Profile" className="w-full h-full rounded-full object-cover shadow-sm" style={{maxWidth:96, maxHeight:96}} />
          </div>
          <div aria-label='headerText' className="flex-1 flex items-center justify-between min-w-0">
            <div className="flex-1 min-w-0 pr-4">
              <h1 className="text-xl md:text-2xl font-semibold truncate">Laura Pereira de Castro</h1>
              <div className="text-muted mt-1 truncate">{t('headline')}</div>
            </div>
            <div className="flex items-center flex-shrink-0 gap-2">
              <SocialIcon url="mailto:laurapdec@gmail.com" style={{ height: 36, width: 36 }} className="social-icon" />
              <SocialIcon url="https://linkedin.com/in/laurapdec" style={{ height: 36, width: 36 }} className="social-icon" />
              <SocialIcon url="https://github.com/laurapdec" style={{ height: 36, width: 36 }} className="social-icon" />
              <select
                aria-label="Change language"
                className="bg-white/5 backdrop-blur-sm rounded-lg px-3 py-2 text-sm appearance-none hover:bg-white/10 transition-colors cursor-pointer"
                value={lang}
                onChange={e => changeLang(e.target.value)}
                style={{ width: 'auto' }}
              >
                <option value="en" aria-label='option'>🇬🇧↓</option>
                <option value="fr" aria-label='option'>🇫🇷↓</option>
                <option value="pt" aria-label='option'>🇧🇷↓</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 overflow-hidden">
        <div className="marquee-wrapper relative border-b border-gray-100">
          <div className="marquee flex items-center gap-8 py-2">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="flex items-center" style={{ marginRight: '3rem' }}>
                {t('tech_stack', { returnObjects: true }).map((tech, index) => {
                  const icon = getIconForTech(tech);
                  return (
                    <div key={index} className="flex items-center gap-2 whitespace-nowrap text-sm text-gray-700 mx-6">
                      {icon && <span className="text-gray-600">{icon}</span>}
                      <span className="font-medium">{tech}</span>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
    </header>
    </>
  )
}
