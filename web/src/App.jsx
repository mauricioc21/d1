import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './App.css'

// Componentes
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import RequireAuth from './components/RequireAuth'

// Páginas
import HomePage from './pages/HomePage'
import ProjectsPage from './pages/ProjectsPage'
import ViewerPage from './pages/ViewerPage'
import UploadPage from './pages/UploadPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'

function App() {
  return (
    <Router>
      <div className="app">
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/projects" element={(
              <RequireAuth>
                <ProjectsPage />
              </RequireAuth>
            )} />
            <Route
              path="/viewer/:id"
              element={(
                <RequireAuth>
                  <ViewerPage />
                </RequireAuth>
              )}
            />
            <Route
              path="/upload"
              element={(
                <RequireAuth>
                  <UploadPage />
                </RequireAuth>
              )}
            />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  )
}

export default App
