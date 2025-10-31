import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Footer from './components/Footer'
import CV from './pages/CV'
import CreativeServices from './pages/CreativeServices'
import NotFound from './pages/NotFound'
import './index.css'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<CreativeServices />} /> {/* Minimal portfolio as the main page */}
        <Route path="/cv" element={<CV />} /> {/* CV remains at /cv */}
        <Route path="*" element={<NotFound />} /> {/* Custom 404 page for unmatched routes */}
      </Routes>
      <Footer />
    </Router>
  )
}

export default App
