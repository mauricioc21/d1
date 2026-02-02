import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './App.css'

// Componentes
import Navbar from './components/Navbar'
import Footer from './components/Footer'

// Páginas
import HomePage from './pages/HomePage'
import ProjectsPage from './pages/ProjectsPage'
import ViewerPage from './pages/ViewerPage'
import UploadPage from './pages/UploadPage'

function App() {
  return (
    <Router>
      <div className="app">
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/projects" element={<ProjectsPage />} />
            <Route path="/viewer/:id" element={<ViewerPage />} />
            <Route path="/upload" element={<UploadPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  )
}

export default App
