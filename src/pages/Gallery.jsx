import { motion } from 'framer-motion'

export default function Gallery() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-900 via-purple-900 to-black text-white p-8 pt-24">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl">
        <h1 className="text-5xl font-extrabold mb-4">Welcome to My Gallery</h1>
        <p className="mb-6 text-lg">Explore my creative works, projects, and experiments.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 bg-white/5 rounded">Placeholder for artwork or projects.</div>
          <div className="p-6 bg-white/5 rounded">Placeholder for interactive experiments.</div>
        </div>
      </motion.div>
    </div>
  )
}