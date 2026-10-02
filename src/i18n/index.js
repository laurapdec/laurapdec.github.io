import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import en from './en.json'
import fr from './fr.json'
import pt from './pt.json'

const resources = { en: { translation: en }, fr: { translation: fr }, pt: { translation: pt } }

function detectLanguage() {
  if (typeof navigator === 'undefined') return 'en'
  const supported = Object.keys(resources)
  const candidates = navigator.languages && navigator.languages.length ? navigator.languages : [navigator.language]
  for (const candidate of candidates) {
    const code = candidate?.slice(0, 2).toLowerCase()
    if (supported.includes(code)) return code
  }
  return 'en'
}

i18n.use(initReactI18next).init({
  resources,
  lng: detectLanguage(),
  fallbackLng: 'en',
  interpolation: { escapeValue: false }
})

export default i18n
