import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { LanguageProvider } from './context/LanguageContext.jsx'
<<<<<<< HEAD
import App from './App.jsx'
import CarsPage from './pages/CarsPage.jsx'
import DriversPage from './pages/DriversPage.jsx'
import TermsPage from './pages/TermsPage.jsx'
=======
import CarsPage from './pages/CarsPage.jsx'
import TermsPage from './pages/TermsPage.jsx'
import DriversPage from './pages/DriversPage.jsx'
>>>>>>> ff7160f1171aed3e542b433584147108eec8dd13
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <LanguageProvider>
        <Routes>
<<<<<<< HEAD
          <Route path="/" element={<App />} />
          <Route path="/cars" element={<CarsPage />} />
          <Route path="/drivers" element={<DriversPage />} />
          <Route path="/terms" element={<TermsPage />} />
=======
          <Route path="/" element={<CarsPage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/drivers" element={<DriversPage />} />
>>>>>>> ff7160f1171aed3e542b433584147108eec8dd13
        </Routes>
      </LanguageProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
