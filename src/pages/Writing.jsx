import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import Navbar from '../components/Navbar'

const SCRIPTS = [
  {
    key: 'witchcraft',
    file: '/documents/WITCHCRAFT ACADEMY.pdf',
  },
  {
    key: 'pretty',
    file: '/documents/It Hurts to be Pretty Scene.pdf',
  },
]

export default function Writing() {
  const { t } = useTranslation()

  return (
    <div className="site-scroll">
      <Navbar />
      <section className="max-w-6xl mx-auto px-6 pt-32 pb-8">
        <h1 className="text-3xl md:text-4xl font-bold">{t('nav.writing')}</h1>
      </section>

      <section className="max-w-4xl mx-auto px-6 pb-16">
        <div className="bg-cream rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-2 text-ink">{t('writing.mfaHeading')}</h2>
          <p className="text-ink/80 leading-relaxed">{t('writing.mfaNote')}</p>
          <a
            href="https://substack.com/@laurapdec"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block mt-4 text-sm font-medium text-accent underline"
          >
            {t('writing.substackLink')} &rarr;
          </a>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 pb-24">
        <p className="text-cream/50 text-sm mb-6">{t('writing.draftNote')}</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {SCRIPTS.map((script) => (
            <motion.a
              key={script.key}
              href={script.file}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="group block bg-cream rounded-lg p-6 shadow-sm hover:shadow-lg transition-all duration-300"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-xl font-bold text-ink group-hover:text-accent transition-colors">
                    {t(`writing.script_${script.key}.title`)}
                  </h3>
                  <p className="text-accent text-sm font-medium mt-1">
                    {t(`writing.script_${script.key}.meta`)}
                  </p>
                  <p className="text-ink/70 mt-3 text-sm leading-relaxed">
                    {t(`writing.script_${script.key}.description`)}
                  </p>
                </div>
                <span className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-accent/10 group-hover:bg-accent/20 transition-colors flex-shrink-0">
                  <svg className="w-5 h-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                </span>
              </div>
              <span className="inline-block mt-4 text-sm font-medium text-accent">{t('writing.readScript')} &rarr;</span>
            </motion.a>
          ))}
        </div>
      </section>
    </div>
  )
}
