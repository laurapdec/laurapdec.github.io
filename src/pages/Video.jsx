import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import Navbar from '../components/Navbar'
import videos from '../data/videos.json'

export default function Video() {
  const { t } = useTranslation()
  const [activeTags, setActiveTags] = useState([])

  const allTags = useMemo(() => {
    const set = new Set()
    videos.forEach(v => v.tags.forEach(tag => set.add(tag)))
    return Array.from(set).sort()
  }, [])

  const toggleTag = (tag) => {
    setActiveTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag])
  }

  const filtered = activeTags.length === 0
    ? videos
    : videos.filter(v => activeTags.some(tag => v.tags.includes(tag)))

  return (
    <div className="site-scroll">
      <Navbar />
      <section className="max-w-6xl mx-auto px-6 pt-6 md:pt-12 pb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-6">{t('nav.video')}</h1>
        <div className="flex flex-wrap gap-2" role="group" aria-label="Filter videos by tag">
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
        <div className="columns-1 md:columns-2 gap-6 [column-fill:_balance]">
          {filtered.map((video) => (
            <motion.div
              key={video.file}
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className={`mb-6 break-inside-avoid rounded-lg overflow-hidden shadow-sm bg-black ${video.vertical ? 'max-w-xs mx-auto' : ''}`}
            >
              <video
                controls
                playsInline
                preload="metadata"
                poster={`/media/videos/posters/${video.file.replace('.mp4', '.jpg')}`}
                className={`w-full object-cover ${video.vertical ? 'aspect-[9/16]' : 'aspect-video'}`}
              >
                <source src={`/media/videos/${video.file}`} type="video/mp4" />
              </video>
            </motion.div>
          ))}
        </div>
        {filtered.length === 0 && (
          <p className="text-cream/50 text-center py-16">{t('filters.empty')}</p>
        )}
      </section>

      <section className="max-w-4xl mx-auto px-6 pb-24 text-center">
        <p className="text-cream/50">{t('video.moreSoon')}</p>
      </section>
    </div>
  )
}
