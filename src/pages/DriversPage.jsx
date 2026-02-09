import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import './DriversPage.css'
import LanguageSelector from '../components/LanguageSelector'
import { useLanguage } from '../context/LanguageContext'

const API_BASE = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? 'https://car-rental-api-pp6g.onrender.com' : 'http://localhost:3000')

// Helper to format image URLs for local paths
const formatPhotoUrl = (url) => {
  if (!url) return null
  if (url.startsWith('/')) {
    return `${API_BASE}${url}`
  }
  return url
}



function DriversPage() {
  const { t } = useLanguage()
  const [drivers, setDrivers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    fetchDrivers()
  }, [])

  const fetchDrivers = async () => {
    try {
      // Fetch all drivers, not just available ones
      const response = await fetch(`${API_BASE}/api/drivers`)
      const data = await response.json()
      if (data.success) {
        setDrivers(data.data)
      } else {
        setDrivers([])
      }
    } catch {
      setDrivers([])
    } finally {
      setLoading(false)
    }
  }

  const getStatusClass = (status) => {
    switch (status) {
      case 'available': return 'status-available'
      case 'busy': return 'status-busy'
      case 'offline': return 'status-offline'
      default: return ''
    }
  }

  return (
    <div className="app">
      <header className="header">
        <div className="header-content">
          <Link to="/" className="logo">
            <img src="/log.png" alt="" className="logo-image" />
            <span>RentACar</span>
          </Link>
          <nav className={`header-nav ${mobileMenuOpen ? 'open' : ''}`}>
            <Link to="/" className="nav-link">{t.backToCars}</Link>
            <Link to="/terms" className="nav-link">{t.terms}</Link>
          </nav>
          <button className="hamburger-btn" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              {mobileMenuOpen ? (
                <path d="M6 18L18 6M6 6l12 12"/>
              ) : (
                <>
                  <line x1="3" y1="6" x2="21" y2="6"/>
                  <line x1="3" y1="12" x2="21" y2="12"/>
                  <line x1="3" y1="18" x2="21" y2="18"/>
                </>
              )}
            </svg>
          </button>
        </div>
      </header>

      <main className="main drivers-main">
        <div className="drivers-container">
          <div className="drivers-header">
            <h1>{t.ourDrivers}</h1>
            <p>{t.driverSubtitle}</p>
          </div>
          
          {loading ? (
            <div className="drivers-loading">
              <div className="spinner"></div>
              <p>Loading drivers...</p>
            </div>
          ) : error ? (
            <div className="drivers-error">{error}</div>
          ) : drivers.length === 0 ? (
            <div className="drivers-empty">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#ccc" strokeWidth="1.5">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
              <p>No drivers available</p>
            </div>
          ) : (
            <div className="drivers-grid">
              {drivers.map(driver => (
                <div key={driver.id} className="driver-card">
                  <div className="driver-avatar">
                    {driver.photo_url ? (
                      <img src={formatPhotoUrl(driver.photo_url)} alt={driver.name} />
                    ) : (
                      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#25D366" strokeWidth="1.5">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                        <circle cx="12" cy="7" r="4"/>
                      </svg>
                    )}
                  </div>
                  <div className="driver-info">
                    <h3>{driver.name}</h3>
                    <span className={`status-badge ${getStatusClass(driver.status)}`}>
                      {driver.status}
                    </span>
                  </div>
                  <div className="driver-details">
                    <p className="driver-vehicle">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"/>
                        <circle cx="7" cy="17" r="2"/>
                        <circle cx="17" cy="17" r="2"/>
                      </svg>
                      {driver.vehicle_assigned || 'Not assigned'}
                    </p>
                    <p className="driver-phone">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                      </svg>
                      {driver.phone}
                    </p>
                  </div>
                  <a 
                    href={`https://wa.me/${driver.phone.replace(/[^0-9+]/g, '').replace(/^\+/, '').replace(/^0/, '250')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="driver-whatsapp"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                    </svg>
                    Contact via WhatsApp
                  </a>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <footer className="footer">
        <div className="footer-content">
          <div className="footer-info">
            <div className="footer-logo">
              <img src="/log.png" alt="" className="footer-logo-image" />
              <span>RentACar</span>
            </div>
            <p className="footer-location">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                <circle cx="12" cy="10" r="3"/>
              </svg>
              Kigali, Rwanda
            </p>
            <p className="footer-phone">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
              </svg>
              <a href="tel:+250735735319">+250 735 735 319</a>
            </p>
          </div>
          
          <div className="footer-links">
            <h4>Quick Links</h4>
            <Link to="/">Back to Cars</Link>
            <Link to="/terms">Terms & Conditions</Link>
          </div>
          
          <div className="footer-social">
            <h4>Follow Us</h4>
            <a href="https://www.facebook.com/share/1DFrDsM9zT/" target="_blank" rel="noopener noreferrer" className="social-link">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
            </a>
            <a href="https://www.instagram.com/p_a_t_i_e_n_c?igsh=NjF6azc1aDNsbDM1" target="_blank" rel="noopener noreferrer" className="social-link">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
            </a>
            <a href="tel:+250735735319" target="_blank" rel="noopener noreferrer" className="social-link phone">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
              </svg>
            </a>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2024 RentACar Rwanda. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}

export default DriversPage
