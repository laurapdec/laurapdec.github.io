import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import Navbar from '../components/Navbar'

const HERO_IMAGE = '/media/photography/20251204_155551_058.JPEG'

export default function Home() {
  const { t } = useTranslation()

  return (
    <div className="site-scroll">
      <Navbar />

      <section className="relative w-full h-[calc(100vh-312px)] md:h-[calc(100vh-208px)] min-h-[420px] overflow-hidden">
        <img
          src={HERO_IMAGE}
          alt="Illuminated London street"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-black/10" />
        <div className="relative h-full flex flex-col justify-end max-w-6xl mx-auto px-6 pb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-3">{t('hero.title')}</h1>
            <p className="text-lg md:text-2xl text-white/90 font-medium mb-4">{t('hero.subtitle')}</p>
            <p className="text-white/80 max-w-xl mb-8">{t('hero.description')}</p>
            <div className="flex flex-wrap gap-4">
              <Link to="/photography" className="px-6 py-3 bg-cream text-ink font-medium rounded-lg hover:bg-white transition-colors">
                {t('hero.ctaPrimary')}
              </Link>
              <Link to="/video" className="px-6 py-3 bg-white/10 backdrop-blur-sm text-white font-medium rounded-lg border border-white/30 hover:bg-white/20 transition-colors">
                {t('hero.ctaSecondary')}
              </Link>
              <Link to="/writing" className="px-6 py-3 bg-white/10 backdrop-blur-sm text-white font-medium rounded-lg border border-white/30 hover:bg-white/20 transition-colors">
                {t('hero.ctaTertiary')}
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
