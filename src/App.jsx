import { HashRouter as Router, Routes, Route } from 'react-router-dom'
import Footer from './components/Footer'
import CV from './pages/CV'
import CreativeServices from './pages/CreativeServices'
import NotFound from './pages/NotFound'
import './index.css'

function App() {
  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<CreativeServices />} /> {/* Minimal portfolio as the main page */}
        <Route exact path="cv" element={<CV />} /> {/* CV page without leading slash for HashRouter */}
        <Route path="*" element={<NotFound />} /> {/* Custom 404 page for unmatched routes */}
      </Routes>
      <Footer />
    </Router>
  )
}

export default App
