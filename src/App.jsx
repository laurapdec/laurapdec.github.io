import { HashRouter as Router, Routes, Route } from 'react-router-dom'
import Footer from './components/Footer'
import Home from './pages/Home'
import Photography from './pages/Photography'
import Video from './pages/Video'
import About from './pages/About'
import NotFound from './pages/NotFound'
import './index.css'

function App() {
  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<Home />} />
        <Route path="/photography" element={<Photography />} />
        <Route path="/video" element={<Video />} />
        <Route path="/about" element={<About />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Footer />
    </Router>
  )
}

export default App
