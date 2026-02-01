import { useState, useEffect } from 'react'
import heroVideo from '../components/WhatsApp Video 2026-01-31 at 21.56.44.mp4'
import { Link } from 'react-router-dom'
import '../App.css'
import CarCard from '../components/CarCard'
import CarDetailModal from '../components/CarDetailModal'
import SearchBar from '../components/SearchBar'
import DatePicker from '../components/DatePicker'
import LanguageSelector from '../components/LanguageSelector'
import { useLanguage } from '../context/LanguageContext'

const API_BASE = 'https://car-rental-api-pp6g.onrender.com'

function CarsPage() {
  const { t } = useLanguage()
  const [cars, setCars] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCar, setSelectedCar] = useState(null)
  const [selectedCarImages, setSelectedCarImages] = useState([])
  const [detailModalOpen, setDetailModalOpen] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [darkMode, setDarkMode] = useState(false)
  
  // Filters
  const [priceRange, setPriceRange] = useState('all')
  const [seatsFilter, setSeatsFilter] = useState('all')
  const [transmissionFilter, setTransmissionFilter] = useState('all')
  
  // Date picker state
  const [selectedDates, setSelectedDates] = useState({ start: '', end: '' })

  useEffect(() => {
    fetchCars()
    
    // Check for saved dark mode preference
    const savedDarkMode = localStorage.getItem('darkMode')
    if (savedDarkMode === 'true') {
      setDarkMode(true)
      document.body.classList.add('dark-mode')
    }
  }, [])

  // Auto-search when filters change
  useEffect(() => {
    filterCars()
  }, [priceRange, seatsFilter, transmissionFilter, searchQuery, cars])

  // Auto-filter cars based on all filters
  const filterCars = () => {
    // Use actual cars data if loaded, otherwise use empty array
    const baseCars = cars.length > 0 ? cars : []
    let filtered = [...baseCars]
    
    // Price filter
    if (priceRange !== 'all') {
      const [min, max] = priceRange.split('-').map(Number)
      filtered = filtered.filter(car => car.price_per_day >= min && car.price_per_day <= max)
    }
    
    // Seats filter
    if (seatsFilter !== 'all') {
      filtered = filtered.filter(car => car.seats === parseInt(seatsFilter))
    }
    
    // Transmission filter
    if (transmissionFilter !== 'all') {
      filtered = filtered.filter(car => car.transmission === transmissionFilter)
    }
    
    // Search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(car => 
        car.name.toLowerCase().includes(query) || 
        car.model.toLowerCase().includes(query) ||
        (car.description && car.description.toLowerCase().includes(query))
      )
    }
    
    setFilteredCarsResult(filtered)
    
    // Scroll to cars section when filters change
    document.getElementById('cars')?.scrollIntoView({ behavior: 'smooth' })
  }

  const [filteredCarsResult, setFilteredCarsResult] = useState([])

  const fetchCars = async (startDate = '') => {
    try {
      let url = `${API_BASE}/cars`
      
      // Add date parameter if provided
      if (startDate) {
        url += `?start_date=${startDate}`
      }
      
      const response = await fetch(url)
      const data = await response.json()
      if (data.success) {
        setCars(data.data || [])
      } else {
        setCars([])
      }
    } catch {
      setCars([])
    } finally {
      setLoading(false)
    }
  }

  // Get filtered cars for display
  // Show all cars including unavailable ones - CarCard will handle the display
  const filteredCars = (filteredCarsResult.length > 0 || searchQuery || priceRange !== 'all' || seatsFilter !== 'all' || transmissionFilter !== 'all') 
    ? filteredCarsResult 
    : cars

  const handleSearch = async (query) => {
    setSearchQuery(query)
  }

  const handleCheckAvailability = (dates) => {
    setSelectedDates(dates)
    fetchCars(dates.start)
    // Scroll to cars section
    document.getElementById('cars')?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleClearDates = () => {
    setSelectedDates({ start: '', end: '' })
    fetchCars()
    // Scroll to cars section
    document.getElementById('cars')?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleCarClick = (car) => {
    setSelectedCarImages(car.images || [car.image_url])
    setSelectedCar(car)
    setDetailModalOpen(true)
  }

  const handleRentClick = (car) => {
    setDetailModalOpen(false)
    
    let phoneNumber = car.whatsapp_number.replace(/[^0-9+]/g, '')
    if (!phoneNumber.startsWith('+')) {
      phoneNumber = '+250' + phoneNumber.replace(/^0/, '')
    }
    phoneNumber = phoneNumber.replace(/^\+/, '')
    
    const message = `Hi, I'm interested in renting the ${car.name} ${car.model}. Is it available?`
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`
    
    window.open(whatsappUrl, '_blank')
  }

  const closeDetailModal = () => {
    setDetailModalOpen(false)
    setSelectedCar(null)
    setSelectedCarImages([])
  }

  const clearFilters = () => {
    setPriceRange('all')
    setSeatsFilter('all')
    setTransmissionFilter('all')
    setSearchQuery('')
    setFilteredCarsResult(cars.length > 0 ? cars : [])
    // Scroll to cars section
    document.getElementById('cars')?.scrollIntoView({ behavior: 'smooth' })
  }

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode
    setDarkMode(newDarkMode)
    document.body.classList.toggle('dark-mode', newDarkMode)
    localStorage.setItem('darkMode', newDarkMode.toString())
  }

  return (
    <div className="app">
      <header className="header">
        <div className="header-content">
          <div className="logo">
            <Link to="/">
              <img src="/log.png" alt="" className="logo-image" />
              <span>RentACar</span>
            </Link>
          </div>
          <nav className={`header-nav ${mobileMenuOpen ? 'open' : ''}`}>
            <Link to="/terms" className="nav-link">{t.terms}</Link>
            <Link to="/drivers" className="nav-link">{t.drivers}</Link>
          </nav>
          <div className="desktop-nav-actions">
            <LanguageSelector />
            <button className="dark-mode-btn" onClick={toggleDarkMode} title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}>
              {darkMode ? (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="5"/>
                  <line x1="12" y1="1" x2="12" y2="3"/>
                  <line x1="12" y1="21" x2="12" y2="23"/>
                  <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
                  <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
                  <line x1="1" y1="12" x2="3" y2="12"/>
                  <line x1="21" y1="12" x2="23" y2="12"/>
                  <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
                  <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
                </svg>
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
                </svg>
              )}
            </button>
          </div>
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

      <main className="main">
        {/* Hero Section with Video */}
        <section className="hero-video">
          <video autoPlay loop muted playsInline className="hero-video-bg">
            <source src={heroVideo} type="video/mp4" />
          </video>
          <div className="hero-video-overlay">
            <h1>Find Your Perfect Ride</h1>
            <p>Browse our selection of quality cars and connect directly with owners via WhatsApp</p>
            <div className="hero-stats">
              <div className="stat">
                <span className="stat-number">{filteredCars.length}+</span>
                <span className="stat-label">Cars Available</span>
              </div>
            </div>
          </div>
        </section>

        {/* Search Bar */}
        <section className="search-section">
          <div className="section-container">
            <SearchBar onSearch={handleSearch} />
            <div className="date-picker-wrapper">
              <DatePicker 
                onSelectDates={setSelectedDates}
                selectedDates={selectedDates}
                onCheckAvailability={handleCheckAvailability}
                onClear={handleClearDates}
              />
            </div>
          </div>
        </section>

        {/* Filters Section */}
        <section className="filters-section">
          <div className="section-container">
            <div className="filters-bar">
              <div className="filter-group">
                <label>Price Range</label>
                <select value={priceRange} onChange={(e) => setPriceRange(e.target.value)}>
                  <option value="all">All Prices</option>
                  <option value="0-50000">Under RWF 50,000</option>
                  <option value="50000-100000">RWF 50,000 - 100,000</option>
                  <option value="100000-200000">RWF 100,000 - 200,000</option>
                  <option value="200000-500000">Over RWF 200,000</option>
                </select>
              </div>
              <div className="filter-group">
                <label>Seats</label>
                <select value={seatsFilter} onChange={(e) => setSeatsFilter(e.target.value)}>
                  <option value="all">All Seats</option>
                  <option value="2">2 Seats</option>
                  <option value="4">4 Seats</option>
                  <option value="5">5 Seats</option>
                  <option value="7">7 Seats</option>
                  <option value="8">8 Seats</option>
                </select>
              </div>
              <div className="filter-group">
                <label>Transmission</label>
                <select value={transmissionFilter} onChange={(e) => setTransmissionFilter(e.target.value)}>
                  <option value="all">All Types</option>
                  <option value="Automatic">Automatic</option>
                  <option value="Manual">Manual</option>
                </select>
              </div>
              <button className="clear-filters-btn" onClick={clearFilters}>
                Clear Filters
              </button>
            </div>
          </div>
        </section>

        {/* Cars Section */}
        <section className="cars-section" id="cars">
          <div className="section-container">
            <span className="car-count">{filteredCars.length} {filteredCars.length === 1 ? 'car' : 'cars'} found</span>

            {loading ? (
              <div className="loading">
                <div className="spinner"></div>
                <p>Loading cars...</p>
              </div>
            ) : filteredCars.length === 0 ? (
              <div className="no-results">
                <p>No cars found matching your criteria</p>
                <button onClick={clearFilters}>Clear Filters</button>
              </div>
            ) : (
              <div className="cars-grid">
                {filteredCars.map(car => (
                  <CarCard key={car.id} car={car} onRent={handleRentClick} onClick={() => handleCarClick(car)} selectedDate={selectedDates.start} />
                ))}
              </div>
            )}
          </div>
        </section>

        {/* CTA Section */}
        <section className="cta-section">
          <div className="section-container">
            <div className="cta-content">
              <h2>Ready to Hit the Road?</h2>
              <p>Book your perfect car today and start your journey!</p>
              <button className="cta-button" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>Browse Cars</button>
            </div>
          </div>
        </section>
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
            <Link to="/terms">Terms & Conditions</Link>
            <Link to="/drivers">Our Drivers</Link>
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

      {/* Car Detail Modal */}
      <CarDetailModal 
        isOpen={detailModalOpen}
        onClose={closeDetailModal}
        car={selectedCar}
        images={selectedCarImages}
        onRent={handleRentClick}
      />
    </div>
  )
}

export default CarsPage
