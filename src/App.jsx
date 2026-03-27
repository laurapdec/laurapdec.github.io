import { HashRouter as Router, Routes, Route } from 'react-router-dom'
import Footer from './components/Footer'
import CV from './pages/CV'
import NotFound from './pages/NotFound'
import './index.css'

function App() {
  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<CV />} />
        <Route exact path="cv" element={<CV />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Footer />
    </Router>
  )
}

export default App
