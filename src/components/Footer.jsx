import { useTranslation } from 'react-i18next'

export default function Footer() {
  const { t } = useTranslation()
  const copyright = t('footer.copyright', { defaultValue: `© ${new Date().getFullYear()} Laura Pereira. All rights reserved.` })
  return (
    <footer className="fixed bottom-0 left-0 right-0 text-center py-4 bg-black bg-opacity-80 text-white z-40">
      <span>{copyright}</span>
    </footer>
  )
}
