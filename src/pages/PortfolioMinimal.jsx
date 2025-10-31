import { motion } from 'framer-motion'
import Navbar from '../components/Navbar'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import { useState, useEffect } from 'react';

function ErrorFallback({ error }) {
  return (
    <div role="alert" className="text-red-500">
      <p>Something went wrong:</p>
      <pre>{error.message}</pre>
    </div>
  );
}

export default function PortfolioMinimal() {
  const [mediaCategories, setMediaCategories] = useState([])
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0) // Track the current photo index

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
            <p className="text-sm font-medium uppercase text-muted-2">Independent Creative Direction and Production</p>
            <h1 className="mt-4 text-4xl md:text-5xl font-extrabold leading-tight">Creative Services</h1>
            <p className="mt-4 text-lg text-muted max-w-2xl">Bringing ideas to life through both traditional videography and computer generated imagery.</p>

            <div className="mt-6 flex flex-wrap gap-3">
              <a href="https://www.instagram.com/laurapdec" className="btn-cta inline-flex items-center gap-2" target="_blank" rel="noreferrer">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
                Instagram
              </a>
              <a href="mailto:laurapdec@gmail.com" className="btn-ghost inline-flex items-center gap-2">Contact</a>
            </div>

            </div>

          <div className="profile-placeholder hidden md:flex">
            <img 
              src="/media/photos/DSC00068.JPG" 
              alt="Featured Work" 
              className="w-80 h-80 object-cover rounded-lg shadow-lg"
            />
          </div>
        </div>
      </motion.div>

      {/* Gallery Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-6xl mx-auto px-6 py-12"
      >
        <h2 className="text-3xl font-bold mb-8">Photography</h2>
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
          <h2 className="text-3xl font-bold mb-8">Poetry</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Featured Poem Card */}
            <div className="bg-white/60 backdrop-blur-sm rounded-lg p-6 shadow-sm hover:shadow-md transition-all">
              <h3 className="text-xl font-semibold mb-3">Featured Poem</h3>
              <p className="text-gray-600 text-sm mb-4">From collection "Whispers in Code"</p>
              <div className="prose prose-lg">
                <p className="italic">
                  Your featured poem excerpt here...
                </p>
              </div>
              <a href="#" className="mt-4 inline-block text-sm font-medium text-blue-600 hover:text-blue-700">
                Read more poems →
              </a>
            </div>
            {/* Poetry Collections */}
            <div className="space-y-6">
              <div className="bg-white/60 backdrop-blur-sm rounded-lg p-6">
                <h4 className="font-medium mb-2">Collections</h4>
                <ul className="space-y-3">
                  <li className="flex items-center justify-between">
                    <span>Digital Dreams</span>
                    <span className="text-sm text-gray-500">12 poems</span>
                  </li>
                  <li className="flex items-center justify-between">
                    <span>Urban Rhythms</span>
                    <span className="text-sm text-gray-500">8 poems</span>
                  </li>
                  <li className="flex items-center justify-between">
                    <span>Tech Sonnets</span>
                    <span className="text-sm text-gray-500">14 poems</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Stories Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="py-12 border-b border-gray-100"
        >
          <h2 className="text-3xl font-bold mb-8">Stories</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Story Cards */}
            <div className="bg-white/60 backdrop-blur-sm rounded-lg p-6 shadow-sm hover:shadow-md transition-all">
              <span className="text-xs font-medium text-blue-600 mb-2 block">Short Story</span>
              <h3 className="text-xl font-semibold mb-3">The Algorithm's Heart</h3>
              <p className="text-gray-600 mb-4 line-clamp-3">
                Story excerpt here...
              </p>
              <a href="#" className="text-sm font-medium text-blue-600 hover:text-blue-700">Read story →</a>
            </div>
            {/* Add more story cards as needed */}
          </div>
          <div className="mt-8 text-center">
            <a href="https://poeinblog.wordpress.com" 
               target="_blank" 
               rel="noopener noreferrer" 
               className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700">
              <span>Visit my blog for more stories</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          </div>
        </motion.div>

        {/* Songs Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="py-12"
        >
          <h2 className="text-3xl font-bold mb-8">Songs</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Featured Song */}
            <div className="bg-white/60 backdrop-blur-sm rounded-lg p-6 shadow-sm hover:shadow-md transition-all">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 bg-gray-200 rounded-lg flex-shrink-0"></div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Song Title</h3>
                  <p className="text-gray-600 mb-4">
                    Song description or lyrics excerpt...
                  </p>
                  <button className="text-sm font-medium text-blue-600 hover:text-blue-700 flex items-center gap-2">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z"/>
                    </svg>
                    Play song
                  </button>
                </div>
              </div>
            </div>
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
        <Route path="/" element={<PortfolioMinimal />} />
      </Routes>
    </Router>
  )
}

export { App }