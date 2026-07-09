import { useTranslation } from 'react-i18next'

export default function Footer() {
  const { t } = useTranslation()
  const copyright = t('footer.copyright', { defaultValue: `© ${new Date().getFullYear()} Laura Pereira. All rights reserved.` })
  return (
    <footer className="fixed bottom-0 left-0 right-0 text-center py-4 bg-ink-dark bg-opacity-90 text-cream/70 z-40">
      <span>{copyright}</span>
    </footer>
  )
}
