import { motion } from 'framer-motion'
import Navbar from '../components/Navbar'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

function ErrorFallback({ error }) {
  return (
    <div role="alert" className="text-red-500">
      <p>Something went wrong:</p>
      <pre>{error.message}</pre>
    </div>
  );
}

export default function CreativeServices() {
  const { t } = useTranslation();
  const [mediaCategories, setMediaCategories] = useState([])
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0) // Track the current photo index
  const [showFullPoem, setShowFullPoem] = useState(false) // Track if full poem should be shown

  useEffect(() => {
    async function fetchMedia() {
      // Make Photos first so gallery/debugging focuses on images
      const folders = [
        { title: 'Photos', folder: '/media/photos' },
        { title: '3D Designs', folder: '/media/3d-designs' },
        { title: 'Videos', folder: '/media/videos' },
        { title: 'Writings', folder: '/media/writings' },
      ]

      const categories = folders.map((folder) => {
        if (folder.title === 'Photos') {
          const photoFiles = [
            'DSC00068.JPG',
            'DSC00092.JPG',
            'DSC00127.JPG',
            'DSC00304.JPG',
            'DSC00455.JPG',
            'DSC00581.JPG',
            'DSC00611.JPG',
            'DSC00797.JPG',
            'DSC00800.JPG',
          ]
          return { ...folder, items: photoFiles }
        }

        if (folder.title === '3D Designs') {
          const designFiles = [
            'droney.glb',
            'F1.glb',
            'SaturnV.glb',
          ]
          return { ...folder, items: designFiles }
        }

        if (folder.title === 'Videos') {
          const videoFiles = [
            'video1.mp4',
            'video2.mp4',
          ]
          return { ...folder, items: videoFiles }
        }

        if (folder.title === 'Writings') {
          const writingFiles = [
            'writing1.pdf',
            'writing2.pdf',
          ]
          return { ...folder, items: writingFiles }
        }

        return { ...folder, items: [] }
      })

      setMediaCategories(categories)
    }

    fetchMedia()
  }, [])

  useEffect(() => {
    console.log('Media Categories:', mediaCategories);
  }, [mediaCategories]);

  const handleNextPhoto = () => {
    if (mediaCategories[0]?.items?.length > 0) {
      setCurrentPhotoIndex((prevIndex) => (prevIndex + 1) % mediaCategories[0].items.length)
    }
  }

  const handlePrevPhoto = () => {
    if (mediaCategories[0]?.items?.length > 0) {
      setCurrentPhotoIndex((prevIndex) =>
        (prevIndex - 1 + mediaCategories[0].items.length) % mediaCategories[0].items.length
      )
    }
  }

  const handleImageClick = (e) => {
    const imageWidth = e.target.offsetWidth
    const clickPosition = e.nativeEvent.offsetX

    if (clickPosition < imageWidth / 2) {
      handlePrevPhoto()
    } else {
      handleNextPhoto()
    }
  }

  return (
  <div className="site-scroll">
      <Navbar />
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-6xl mx-auto px-6 py-16">
        <div className="hero-inner">
          <div>
            <p className="text-sm font-medium uppercase text-muted-2">{t('creative.subheading')}</p>
            <h1 className="mt-4 text-4xl md:text-5xl font-extrabold leading-tight">{t('creative.heading')}</h1>
            <p className="mt-4 text-lg text-muted max-w-2xl">{t('creative.description')}</p>

            <div className="mt-6 flex flex-wrap gap-3">
              <a href="https://www.instagram.com/laurapdec" className="btn-cta inline-flex items-center gap-2" target="_blank" rel="noreferrer">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
                Instagram
              </a>
              <a href="mailto:laurapdec@gmail.com" className="btn-ghost inline-flex items-center gap-2">{t('creative.contact')}</a>
            </div>

            </div>

          <div className="profile-placeholder hidden md:block w-96 h-96 bg-white" style={{ borderRadius: 0 }}>
            <video
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full"
              style={{ 
                pointerEvents: 'none',
                borderRadius: 0,
                boxShadow: 'none',
                objectFit: 'contain',
                background: '#f9f9fc',
                mixBlendMode: 'normal',
                filter: 'none'
              }}
            >
              <source src="/media/videos/Make_an_animation_202510311429.mp4" type="video/mp4" />
            </video>
          </div>
        </div>
      </motion.div>

      {/* Gallery Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-6xl mx-auto px-6 py-12"
      >
        <h2 className="text-3xl font-bold mb-8">{t('creative.photography')}</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {mediaCategories[0]?.items.map((photo, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="relative group aspect-square"
            >
              <img
                src={`/media/photos/${photo}`}
                alt={`Gallery ${index + 1}`}
                className="w-full h-full object-cover rounded-lg shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer"
                onClick={handleImageClick}
              />
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Writing Sections */}
      <div className="w-full max-w-6xl mx-auto px-6">
        {/* Poetry Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="py-12 border-b border-gray-100"
        >
          <h2 className="text-3xl font-bold mb-8">{t('creative.writing')}</h2>
          <div className={`grid grid-cols-1 ${showFullPoem ? 'md:grid-cols-2' : ''} gap-8`}>
            {/* Featured Poem Card */}
            <motion.div 
              className="bg-white/60 backdrop-blur-sm rounded-lg p-6 shadow-sm hover:shadow-md transition-all cursor-pointer"
              onClick={() => setShowFullPoem(!showFullPoem)}
              layout
            >
              <h3 className="text-xl font-semibold mb-3">{t('creative.poem_orlando.title')}</h3>
              <p className="text-gray-600 text-sm mb-4">{t('creative.poem_orlando.date')}</p>
              <div className="prose prose-lg">
                {showFullPoem ? (
                  <motion.p 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="whitespace-pre-line text-base"
                  >
                    {t('creative.poem_orlando.text')}
                  </motion.p>
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <p className="text-base line-clamp-4 mb-4">
                      {t('creative.poem_orlando.text').split('\n\n')[0]}...
                    </p>
                    <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                      {showFullPoem ? t('creative.read_less') : t('creative.read_more')}
                    </button>
                  </motion.div>
                )}
              </div>
            </motion.div>
            {/* Poetry Context */}
            {showFullPoem && (
              <motion.div 
                className="space-y-6"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <div className="bg-white/60 backdrop-blur-sm rounded-lg p-6">
                  <h4 className="font-medium mb-2">{t('creative.about')}</h4>
                  <p className="text-gray-600 text-sm">{t('creative.poem_orlando.context')}</p>
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>


      </div>
    </div>
  )
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<CreativeServices />} />
      </Routes>
    </Router>
  )
}

export { App }