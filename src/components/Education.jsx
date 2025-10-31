import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'

// Certificate icon component
const CertificateIcon = ({ href }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-accent/10 hover:bg-accent/20 transition-colors group"
    title="View Certificate/Recommendation Letter"
  >
    <svg
      className="w-5 h-5 text-accent group-hover:text-accent-dark transition-colors"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9 13h6m-6 4h6"
      />
    </svg>
  </a>
)

export default function Education() {
  const { t } = useTranslation()
  const education = t('education', { returnObjects: true })
  const experience = t('experience', { returnObjects: true })

  return (
    <div className="w-full max-w-6xl px-6 py-12 space-y-16">
      {/* Education Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative"
      >
        <h2 className="text-3xl font-bold mb-8">Education</h2>
        <div className="space-y-6">
          {education.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white/50 backdrop-blur-sm rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start gap-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">{item.institution}</h3>
                  <p className="text-accent/80 mt-1 font-medium">
                    {item.location} · {item.period}
                  </p>
                  <p className="text-gray-600 mt-2 leading-relaxed">{item.degree}</p>
                </div>
                {item.certificate && (
                  <CertificateIcon href={item.certificate} />
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Experience Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative pt-8"
      >
        <h2 className="text-3xl font-bold mb-8">Experience</h2>
        <div className="space-y-6">
          {experience.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white/50 backdrop-blur-sm rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start gap-4">
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-xl font-bold text-gray-900">{item.company}</h3>
                    <span className="text-accent/80">·</span>
                    <span className="text-lg text-gray-600 font-medium">{item.role}</span>
                  </div>
                  <p className="text-accent/80 mt-1 font-medium">
                    {item.location} · {item.period}
                  </p>
                  <p className="text-gray-600 mt-2 leading-relaxed">{item.description}</p>
                </div>
                {item.certificate && (
                  <CertificateIcon href={item.certificate} />
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}