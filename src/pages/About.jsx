import { useTranslation } from 'react-i18next'
import Navbar from '../components/Navbar'
import { SocialIcon } from 'react-social-icons'

export default function About() {
  const { t } = useTranslation()
  const languages = t('languages', { returnObjects: true }) || []
  const education = t('about.education', { returnObjects: true }) || []
  const contact = t('contact', { returnObjects: true }) || {}

  return (
    <div className="site-scroll">
      <Navbar />
      <section className="max-w-3xl mx-auto px-6 pt-16 pb-16">
        <h1 className="text-3xl md:text-4xl font-bold mb-8">{t('nav.about')}</h1>

        <div className="space-y-6 mb-16">
          <p className="text-cream leading-relaxed text-lg">{t('about.bio')}</p>
          <p className="text-cream/60 leading-relaxed text-sm">{t('about.pastLife')}</p>
          <p className="text-cream/35 text-xs">{t('about.equipment')}</p>
        </div>

        <div className="mb-16">
          <h2 className="text-2xl font-bold mb-6">{t('about.educationHeading')}</h2>
          <div className="grid gap-4">
            {education.map((edu, idx) => (
              <div key={idx} className="bg-cream p-5 rounded-lg">
                <h3 className="font-semibold text-ink">{edu.institution}</h3>
                <p className="text-accent text-sm font-medium mt-1">{edu.location} · {edu.period}</p>
                {edu.degree && <p className="text-ink/70 mt-2 text-sm leading-relaxed">{edu.degree}</p>}
              </div>
            ))}
          </div>
        </div>

        <div className="mb-16">
          <h2 className="text-2xl font-bold mb-6">{t('about.languagesHeading')}</h2>
          <div className="flex flex-wrap gap-3">
            {languages.map((lang, idx) => (
              <div key={idx} className="bg-cream px-4 py-2 rounded-lg text-sm">
                <span className="font-medium text-ink">{lang.name}</span>
                <span className="text-ink/60"> · {lang.level}</span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-bold mb-6">{t('about.contactHeading')}</h2>
          <div className="flex items-center gap-4">
            <SocialIcon url={`mailto:${contact.email}`} style={{ height: 40, width: 40 }} className="social-icon" />
            <SocialIcon url={contact.linkedin} style={{ height: 40, width: 40 }} className="social-icon" />
            <SocialIcon url={contact.instagram} style={{ height: 40, width: 40 }} className="social-icon" />
            <SocialIcon url={contact.tiktok} style={{ height: 40, width: 40 }} className="social-icon" />
            <SocialIcon url={contact.substack} style={{ height: 40, width: 40 }} className="social-icon" />
            <a href={`mailto:${contact.email}`} className="text-cream underline text-sm">{contact.email}</a>
          </div>
        </div>
      </section>
    </div>
  )
}
