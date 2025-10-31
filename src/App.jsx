import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import Portfolio from './pages/Portfolio'
import Gallery from './pages/Gallery'
import PortfolioMinimal from './pages/PortfolioMinimal'
import Projects from './pages/Projects'
import NotFound from './pages/NotFound'
import './index.css'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<PortfolioMinimal />} /> {/* Minimal portfolio as the main page */}
        <Route path="/cv" element={<Home />} /> {/* CV remains at /cv */}
        <Route path="*" element={<NotFound />} /> {/* Custom 404 page for unmatched routes */}
      </Routes>
      <Footer />
    </Router>
  )
}

export default App
