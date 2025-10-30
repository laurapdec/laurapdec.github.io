import { motion } from 'framer-motion'
import Navbar from '../components/Navbar'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, useGLTF } from '@react-three/drei'
import { ErrorBoundary } from 'react-error-boundary';

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
    <div className="min-h-screen flex flex-col items-center bg-gradient-to-b from-gray-50 to-white text-gray-900">
      <Navbar />
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-6xl px-6 py-16">
        <div className="hero-inner mx-auto">
          <div>
            <p className="text-sm font-medium uppercase text-muted-2">Machine Learning & Data Engineering</p>
            <h1 className="mt-4 text-4xl md:text-5xl font-extrabold leading-tight">Machine Learning Engineer • Data Analyst</h1>
            <p className="mt-4 text-lg text-muted max-w-2xl">I build production-ready computer vision systems, model-compression pipelines, and data-driven simulation tools for real-world applications in robotics and scientific computing.</p>

            <div className="mt-6 flex flex-wrap gap-3">
              <a href="/documents/CV.pdf" className="btn-cta inline-flex items-center gap-2" target="_blank" rel="noreferrer">Download CV</a>
              <a href="mailto:laurapdec@gmail.com" className="btn-ghost inline-flex items-center gap-2">Contact</a>
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-3 text-sm text-muted">
              <span className="px-2 py-1 bg-white/60 rounded">PyTorch</span>
              <span className="px-2 py-1 bg-white/60 rounded">OpenCV</span>
              <span className="px-2 py-1 bg-white/60 rounded">SLAM</span>
              <span className="px-2 py-1 bg-white/60 rounded">Model Compression</span>
            </div>
          </div>

          <div className="profile-placeholder hidden md:flex">
            {/* Minimal graphic placeholder — replace with profile image if desired */}
            <div className="w-56 h-56 rounded-full bg-gradient-to-br from-accent to-indigo-500 flex items-center justify-center text-white font-semibold">CV</div>
          </div>
        </div>
      </motion.div>

      {/* Interactive 3D Models */}
      <div className="w-full flex flex-col items-center gap-16">

        {/* J1 Engine */}
        <div className="w-full h-[500px]">
          <Canvas>
            <ambientLight intensity={0.5} />
            <directionalLight position={[10, 10, 5]} />
            <OrbitControls />
            <Model url="/media/3d-designs/F1.glb" />
          </Canvas>
        </div>

        {/* Saturn V Launch */}
        <div className="w-full h-[600px]">
          <SaturnVLaunchWrapper />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 px-8 w-full">
        {mediaCategories.map((category, index) => (
          <div key={index} className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {category.items.map((item, idx) => {
              console.log('Category:', category.title, 'Item:', item);
              const ext = (item.split('.').pop() || '').toLowerCase();
              const src = `${category.folder}/${item}`;

              // Only render <img> for known image extensions. For .glb and others, show a placeholder/link.
              const isImage = ['jpg', 'jpeg', 'png', 'webp', 'gif'].includes(ext);

              if (isImage) {
                return (
                  <div key={idx} className="relative group">
                    <img
                      src={src}
                      alt={item}
                      onLoad={() => console.log('Image loaded:', src)}
                      onError={(e) => console.error('Image failed to load:', src, e)}
                      style={{ display: 'block', opacity: 1, visibility: 'visible' }}
                      className="w-full h-auto rounded-lg object-cover cursor-pointer hover:opacity-80 transition"
                    />
                  </div>
                )
              }

              if (ext === 'glb') {
                return (
                  <div key={idx} className="p-4 rounded-lg bg-gray-800 border border-gray-700">
                    <div className="text-sm text-gray-300">3D Model</div>
                    <a href={src} target="_blank" rel="noreferrer" className="text-white block mt-2 underline">
                      {item}
                    </a>
                  </div>
                )
              }

              // Fallback for unknown file types
              return (
                <div key={idx} className="p-4 rounded-lg bg-gray-800 border border-gray-700">
                  <div className="text-sm text-gray-300">File</div>
                  <a href={src} target="_blank" rel="noreferrer" className="text-white block mt-2 underline">
                    {item}
                  </a>
                </div>
              )
            })}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <img
          src="/media/photos/DSC00068.JPG"
          alt="Test Image"
          className="w-full h-auto rounded-lg object-cover cursor-pointer hover:opacity-80 transition"
        />
      </div>
    </div>
  )
}

// Component to Load and Render a 3D Model
function Model({ url }) {
  const { scene } = useGLTF(url, '/draco-gltf/')
  return <primitive object={scene} scale={1.5} />
}

// Component for Saturn V Launch Animation
function SaturnVLaunch() {
  const { scene } = useGLTF('/media/3d-designs/SaturnV.glb', '/draco-gltf/');
  const [position, setPosition] = useState([0, -2, 0]);
  const [rotation, setRotation] = useState([0, 0, 0]);

  useEffect(() => {
    let frame;
    const animate = () => {
      setRotation((prev) => [prev[0], prev[1] + 0.01, prev[2]]);
      setPosition((prev) => [prev[0], prev[1] + 0.02, prev[2]]);
      frame = requestAnimationFrame(animate);
    };
    animate();
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <primitive object={scene} position={position} rotation={rotation} scale={1.5} />
  );
}

function SaturnVLaunchWrapper() {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <Canvas>
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} />
        <OrbitControls />
        <SaturnVLaunch />
      </Canvas>
    </ErrorBoundary>
  );
}

function App() {
  useEffect(() => {
    const canvas = document.querySelector('canvas');
    canvas.addEventListener('webglcontextlost', (event) => {
      event.preventDefault();
      console.error('WebGL context lost');
    });
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<PortfolioMinimal />} />
      </Routes>
    </Router>
  )
}

export { App }