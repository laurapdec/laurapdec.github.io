import { motion } from 'framer-motion'

export default function Portfolio(){
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-purple-900 via-pink-900 to-black text-white p-8">
      <motion.div initial={{opacity:0, y:20}} animate={{opacity:1,y:0}} className="max-w-4xl">
        <h1 className="text-5xl font-extrabold mb-4">Personal & Experimental Work</h1>
        <p className="mb-6 text-lg">This space is for sketches, short writings, experimental webdesign and interactive pieces — a more personal, handcrafted presentation.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 bg-white/5 rounded">Placeholder for drawings and sketches. Replace with images or embedded works.</div>
          <div className="p-6 bg-white/5 rounded">Placeholder for writings and web experiments. Link to demos or host creative pages here.</div>
        </div>
      </motion.div>
    </div>
  )
}
