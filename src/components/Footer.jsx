import { useTranslation } from 'react-i18next'

export default function Footer() {
  const { t } = useTranslation()
  const copyright = t('footer.copyright', { defaultValue: `© ${new Date().getFullYear()} Laura Pereira. All rights reserved.` })
  return (
    <footer className="text-center py-6 bg-black bg-opacity-80 mt-24 text-white">
      <span>{copyright}</span>
    </footer>
  )
}
