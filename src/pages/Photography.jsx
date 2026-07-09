import { useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import Navbar from '../components/Navbar'
import photos from '../data/photography.json'

export default function Photography() {
  const { t } = useTranslation()
  const [selected, setSelected] = useState(null)
  const [activeTags, setActiveTags] = useState([])

  const allTags = useMemo(() => {
    const set = new Set()
    photos.forEach(p => p.tags.forEach(tag => set.add(tag)))
    return Array.from(set).sort()
  }, [])

  const toggleTag = (tag) => {
    setActiveTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag])
  }

  const filtered = activeTags.length === 0
    ? photos
    : photos.filter(p => activeTags.some(tag => p.tags.includes(tag)))

  return (
    <div className="site-scroll">
      <Navbar />
      <section className="max-w-6xl mx-auto px-6 pt-16 pb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-6">{t('nav.photography')}</h1>
        <div className="flex flex-wrap gap-2" role="group" aria-label="Filter photos by tag">
          <button
            onClick={() => setActiveTags([])}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
              activeTags.length === 0 ? 'bg-cream text-ink' : 'bg-ink-light text-cream/70 hover:bg-ink-light/70'
            }`}
          >
            {t('filters.all')}
          </button>
          {allTags.map(tag => (
            <button
              key={tag}
              onClick={() => toggleTag(tag)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                activeTags.includes(tag) ? 'bg-cream text-ink' : 'bg-ink-light text-cream/70 hover:bg-ink-light/70'
              }`}
            >
              {t(`filters.tag_${tag.replace(/\s+/g, '')}`, { defaultValue: tag })}
            </button>
          ))}
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 pb-24">
        <div className="columns-2 md:columns-3 lg:columns-4 gap-3 [column-fill:_balance]">
          {filtered.map((photo) => {
            const idx = photos.indexOf(photo)
            return (
              <motion.button
                key={photo.file}
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSelected(idx)}
                className="block w-full mb-3 break-inside-avoid rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-shadow"
              >
                <img
                  src={`/media/photography/${photo.file}`}
                  alt={`Photograph ${idx + 1}`}
                  loading="lazy"
                  className="w-full h-auto object-cover"
                />
              </motion.button>
            )
          })}
        </div>
        {filtered.length === 0 && (
          <p className="text-cream/50 text-center py-16">{t('filters.empty')}</p>
        )}
      </section>

      <AnimatePresence>
        {selected !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 z-[60] flex items-center justify-center p-4"
            onClick={() => setSelected(null)}
          >
            <button
              className="absolute top-4 right-4 text-white/80 hover:text-white text-3xl leading-none"
              onClick={() => setSelected(null)}
              aria-label="Close"
            >
              &times;
            </button>
            {selected > 0 && (
              <button
                className="absolute left-2 md:left-6 text-white/70 hover:text-white text-4xl px-3 select-none"
                onClick={(e) => { e.stopPropagation(); setSelected(s => s - 1) }}
                aria-label="Previous"
              >
                &#8249;
              </button>
            )}
            {selected < photos.length - 1 && (
              <button
                className="absolute right-2 md:right-6 text-white/70 hover:text-white text-4xl px-3 select-none"
                onClick={(e) => { e.stopPropagation(); setSelected(s => s + 1) }}
                aria-label="Next"
              >
                &#8250;
              </button>
            )}
            <motion.img
              key={selected}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              src={`/media/photography/${photos[selected].file}`}
              alt={`Photograph ${selected + 1}`}
              className="max-w-full max-h-[90vh] object-contain rounded"
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
