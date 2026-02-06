import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { LanguageProvider } from './context/LanguageContext.jsx'
import CarsPage from './pages/CarsPage.jsx'
import TermsPage from './pages/TermsPage.jsx'
import DriversPage from './pages/DriversPage.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <LanguageProvider>
        <Routes>
          <Route path="/" element={<CarsPage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/drivers" element={<DriversPage />} />
        </Routes>
      </LanguageProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
