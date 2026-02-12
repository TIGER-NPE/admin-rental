import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { LanguageProvider } from './context/LanguageContext.jsx'
import App from './App.jsx'
import CarsPage from './pages/CarsPage.jsx'
import DriversPage from './pages/DriversPage.jsx'
import TermsPage from './pages/TermsPage.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <LanguageProvider>
        <Routes>
          <Route path="/" element={<CarsPage />} />
          <Route path="/drivers" element={<DriversPage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/admin" element={<App />} />
        </Routes>
      </LanguageProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
