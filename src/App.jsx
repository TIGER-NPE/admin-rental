import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import './App.css'
import CarCard from './components/CarCard'
import CarDetailModal from './components/CarDetailModal'
import SearchBar from './components/SearchBar'
import heroVideo from './components/WhatsApp Video 2026-01-31 at 21.56.44.mp4'

// Sample data for demo when API is unavailable
const SAMPLE_CARS = [
  { id: 1, name: 'Toyota Corolla', model: 'Corolla', year: 2023, price_per_day: 45000, whatsapp_number: '250788123456', images: ['https://images.unsplash.com/photo-1621007947382-bb3c3968e3bb?w=800', 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800'], description: 'Reliable and fuel-efficient sedan perfect for city driving', location: 'Kigali, Rwanda', seats: 5, doors: 4, transmission: 'Automatic', available: true, features: ['Air Conditioning', 'GPS Navigation', 'Bluetooth', 'USB Port'] },
  { id: 2, name: 'Honda Civic', model: 'Civic', year: 2022, price_per_day: 55000, whatsapp_number: '250788123457', images: ['https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800', 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800'], description: 'Sporty sedan with excellent handling and comfort', location: 'Kigali, Rwanda', seats: 5, doors: 4, transmission: 'Automatic', available: true, features: ['Air Conditioning', 'Sunroof', 'Reverse Camera', 'Cruise Control'] },
  { id: 3, name: 'BMW 3 Series', model: '320i', year: 2023, price_per_day: 120000, whatsapp_number: '250788123458', images: ['https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800', 'https://images.unsplash.com/photo-1605218427368-351816b9837e?w=800'], description: 'Luxury sedan with premium features and smooth ride', location: 'Kigali, Rwanda', seats: 5, doors: 4, transmission: 'Automatic', available: true, features: ['Leather Seats', 'GPS Navigation', 'Sunroof', 'Heated Seats', 'Premium Audio'] },
  { id: 4, name: 'Ford Ranger', model: 'Ranger', year: 2022, price_per_day: 80000, whatsapp_number: '250788123459', images: ['https://images.unsplash.com/photo-1605218427368-351816b9837e?w=800', 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800'], description: 'Powerful pickup truck for adventure and work', location: 'Kigali, Rwanda', seats: 5, doors: 4, transmission: 'Automatic', available: true, features: ['4WD', 'Bluetooth', 'USB Port', 'Large Cargo Bed'] },
  { id: 5, name: 'Mercedes A-Class', model: 'A200', year: 2023, price_per_day: 150000, whatsapp_number: '250788123460', images: ['https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800', 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800'], description: 'Compact luxury hatchback with modern design', location: 'Kigali, Rwanda', seats: 5, doors: 5, transmission: 'Automatic', available: true, features: ['Air Conditioning', 'GPS Navigation', 'Sunroof', 'Premium Interior'] },
  { id: 6, name: 'Volkswagen Polo', model: 'Polo', year: 2021, price_per_day: 40000, whatsapp_number: '250788123461', images: ['https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800', 'https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?w=800'], description: 'Compact and efficient car for urban use', location: 'Kigali, Rwanda', seats: 5, doors: 5, transmission: 'Manual', available: true, features: ['Air Conditioning', 'Bluetooth', 'Compact Size'] },
  { id: 7, name: 'Audi A4', model: 'A4', year: 2022, price_per_day: 110000, whatsapp_number: '250788123462', images: ['https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?w=800', 'https://images.unsplash.com/photo-1621251683728-04537f8567b6?w=800'], description: 'Elegant sedan with advanced technology', location: 'Kigali, Rwanda', seats: 5, doors: 4, transmission: 'Automatic', available: true, features: ['Leather Seats', 'Virtual Cockpit', 'Premium Audio', 'Sunroof'] },
  { id: 8, name: 'Toyota Hilux', model: 'Hilux', year: 2023, price_per_day: 95000, whatsapp_number: '250788123463', images: ['https://images.unsplash.com/photo-1621251683728-04537f8567b6?w=800', 'https://images.unsplash.com/photo-1621007947382-bb3c3968e3bb?w=800'], description: 'Rugged and reliable pickup truck', location: 'Kigali, Rwanda', seats: 5, doors: 4, transmission: 'Automatic', available: true, features: ['4WD', 'Robust Suspension', 'Cargo Bed', 'Bluetooth'] }
]

const API_BASE = '/api'

// Testimonials data
const TESTIMONIALS = [
  { id: 1, name: 'John Smith', location: 'United States', text: 'Excellent service! The car was in perfect condition and the booking process was smooth.', rating: 5, car: 'Toyota Corolla' },
  { id: 2, name: 'Sarah Johnson', location: 'United Kingdom', text: 'Best car rental experience in Rwanda. Highly recommend!', rating: 5, car: 'BMW 3 Series' },
  { id: 3, name: 'Michael Chen', location: 'Singapore', text: 'Great prices and clean cars. Will definitely rent again.', rating: 4, car: 'Honda Civic' }
]

// FAQ data
const FAQS = [
  { id: 1, question: 'What documents do I need to rent a car?', answer: 'You need a valid driver\'s license (international if not in English), passport or national ID, and a mobile phone for WhatsApp communication.' },
  { id: 2, question: 'Is insurance included?', answer: 'Basic insurance is included in the rental price. Comprehensive insurance can be added for additional coverage.' },
  { id: 3, question: 'Can I pick up the car at the airport?', answer: 'Yes, we offer airport pickup and drop-off services at no additional cost.' },
  { id: 4, question: 'What is the cancellation policy?', answer: 'Free cancellation up to 24 hours before pickup. Late cancellations may incur a one-day charge.' }
]

function App() {
  const [cars, setCars] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCar, setSelectedCar] = useState(null)
  const [selectedCarImages, setSelectedCarImages] = useState([])
  const [detailModalOpen, setDetailModalOpen] = useState(false)
  
  // Filters
  const [priceRange, setPriceRange] = useState('all')
  const [seatsFilter, setSeatsFilter] = useState('all')
  const [transmissionFilter, setTransmissionFilter] = useState('all')

  useEffect(() => {
    fetchCars()
  }, [])

  // Auto-filter cars based on all filters
  const filterCars = () => {
    let filtered = [...SAMPLE_CARS]
    
    // Apply database cars if available
    if (cars.length > 0 && !cars[0]?.images) {
      filtered = [...cars]
    } else if (cars.length > 0) {
      filtered = [...cars]
    }
    
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
        car.model.toLowerCase().includes(query)
      )
    }
    
    return filtered
  }

  const [filteredCarsResult, setFilteredCarsResult] = useState([])

  // Auto-search when filters change
  useEffect(() => {
    const filtered = filterCars()
    setFilteredCarsResult(filtered)
  }, [priceRange, seatsFilter, transmissionFilter, searchQuery, cars])

  const fetchCars = async () => {
    try {
      const response = await fetch(`${API_BASE}/cars`)
      const data = await response.json()
      if (data.success) {
        if (data.data.length === 0 && data.message && data.message.includes('Database not connected')) {
          setCars(SAMPLE_CARS)
        } else {
          setCars(data.data)
        }
      } else {
        setCars(SAMPLE_CARS)
      }
    } catch {
      setCars(SAMPLE_CARS)
    } finally {
      setLoading(false)
    }
  }

  // Get featured cars (first 3)
  const featuredCars = cars.slice(0, 3)

  // Get filtered cars for display
  const filteredCars = filteredCarsResult.length > 0 || searchQuery || priceRange !== 'all' || seatsFilter !== 'all' || transmissionFilter !== 'all' 
    ? filteredCarsResult 
    : cars

  const handleSearch = async (query) => {
    setSearchQuery(query)
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
    // Force re-filter with all cars
    setFilteredCarsResult(cars.length > 0 ? cars : SAMPLE_CARS)
  }

  return (
    <div className="app">
      <header className="header">
        <div className="header-content">
          <div className="logo">
            <img src="/favicon.ico" alt="" className="logo-image" />
            <span>RentACar</span>
          </div>
          <SearchBar onSearch={handleSearch} />
          <nav className="header-nav">
            <Link to="/terms" className="nav-link">TERMS</Link>
            <Link to="/drivers" className="nav-link">DRIVERS</Link>
          </nav>
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
                <span className="stat-number">{cars.length}+</span>
                <span className="stat-label">Cars Available</span>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Cars Section */}
        {featuredCars.length > 0 && (
          <section className="featured-section">
            <div className="section-container">
              <div className="section-header">
                <h2>Featured Cars</h2>
                <p>Handpicked premium vehicles for your comfort</p>
              </div>
              <div className="featured-grid">
                {featuredCars.map(car => (
                  <div key={car.id} className="featured-card" onClick={() => handleCarClick(car)}>
                    <div className="featured-image">
                      <img src={car.images?.[0] || car.image_url || '/favicon.ico'} alt={car.name} />
                      <span className="featured-badge">Featured</span>
                    </div>
                    <div className="featured-info">
                      <h3>{car.name} {car.model}</h3>
                      <p className="featured-price">
                        {new Intl.NumberFormat('en-RW', { style: 'currency', currency: 'RWF', minimumFractionDigits: 0 }).format(car.price_per_day)}
                        <span>/day</span>
                      </p>
                      <div className="featured-features">
                        <span>{car.seats} Seats</span>
                        <span>{car.transmission}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

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

        {/* Why Choose Us Section */}
        <section className="why-us-section">
          <div className="section-container">
            <div className="section-header centered">
              <h2>Why Choose Us</h2>
              <p>We make car rental simple, fast, and affordable</p>
            </div>
            <div className="features-grid">
              <div className="feature-card">
                <div className="feature-icon">
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"/>
                    <path d="M12 6v6l4 2"/>
                  </svg>
                </div>
                <h3>Quick Booking</h3>
                <p>Book your car in minutes via WhatsApp. No lengthy paperwork.</p>
              </div>
              <div className="feature-card">
                <div className="feature-icon">
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                  </svg>
                </div>
                <h3>Fully Insured</h3>
                <p>All our vehicles are fully insured for your peace of mind.</p>
              </div>
              <div className="feature-card">
                <div className="feature-icon">
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 2L2 7l10 5 10-5-10-5z"/>
                    <path d="M2 17l10 5 10-5"/>
                    <path d="M2 12l10 5 10-5"/>
                  </svg>
                </div>
                <h3>Quality Fleet</h3>
                <p>Well-maintained modern cars from top brands.</p>
              </div>
              <div className="feature-card">
                <div className="feature-icon">
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                    <circle cx="12" cy="10" r="3"/>
                  </svg>
                </div>
                <h3>Convenient Pickup</h3>
                <p>Free airport pickup and hotel delivery available.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Cars Section */}
        <section className="cars-section">
          <div className="section-container">
            <div className="section-header">
              <h2>Available Cars</h2>
              <span className="car-count">{filteredCars.length} {filteredCars.length === 1 ? 'car' : 'cars'} available</span>
            </div>

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
                  <CarCard key={car.id} car={car} onRent={handleRentClick} onClick={() => handleCarClick(car)} />
                ))}
              </div>
            )}
          </div>
        </section>

        {/* How It Works Section */}
        <section className="how-it-works">
          <div className="section-container">
            <div className="section-header centered">
              <h2>How It Works</h2>
              <p>Renting a car has never been easier</p>
            </div>
            <div className="steps-grid">
              <div className="step-card">
                <div className="step-number">1</div>
                <h3>Choose Your Car</h3>
                <p>Browse our selection and find the perfect vehicle for your needs.</p>
              </div>
              <div className="step-card">
                <div className="step-number">2</div>
                <h3>Book via WhatsApp</h3>
                <p>Click rent and we'll connect you directly on WhatsApp to confirm.</p>
              </div>
              <div className="step-card">
                <div className="step-number">3</div>
                <h3>Pick Up & Go</h3>
                <p>Pick up your car at the agreed location and start your journey!</p>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="testimonials-section">
          <div className="section-container">
            <div className="section-header centered">
              <h2>What Our Customers Say</h2>
              <p>Real reviews from real customers</p>
            </div>
            <div className="testimonials-grid">
              {TESTIMONIALS.map(testimonial => (
                <div key={testimonial.id} className="testimonial-card">
                  <div className="testimonial-rating">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className={i < testimonial.rating ? 'star filled' : 'star'}>★</span>
                    ))}
                  </div>
                  <p className="testimonial-text">"{testimonial.text}"</p>
                  <div className="testimonial-author">
                    <div className="author-avatar">{testimonial.name.charAt(0)}</div>
                    <div className="author-info">
                      <h4>{testimonial.name}</h4>
                      <span>{testimonial.location}</span>
                    </div>
                  </div>
                  <p className="testimonial-car">Rented: {testimonial.car}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="faq-section">
          <div className="section-container">
            <div className="section-header centered">
              <h2>Frequently Asked Questions</h2>
              <p>Got questions? We've got answers.</p>
            </div>
            <div className="faq-list">
              {FAQS.map(faq => (
                <details key={faq.id} className="faq-item">
                  <summary>{faq.question}</summary>
                  <p>{faq.answer}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="cta-section">
          <div className="section-container">
            <div className="cta-content">
              <h2>Ready to Hit the Road?</h2>
              <p>Browse our selection of quality cars and book your perfect ride today!</p>
              <Link to="/cars" className="cta-button">Browse All Cars</Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="footer-content">
          <div className="footer-info">
            <div className="footer-logo">
              <img src="/favicon.ico" alt="" className="footer-logo-image" />
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
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              +250 788 123 456
            </p>
          </div>
          
          <div className="footer-links">
            <h4>Quick Links</h4>
            <Link to="/terms">Terms & Conditions</Link>
            <Link to="/drivers">Our Drivers</Link>
          </div>
          
          <div className="footer-social">
            <p>Follow us</p>
            <div className="social-links">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="social-link">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
                </svg>
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="social-link">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
                </svg>
              </a>
              <a href="https://wa.me/250788123456" target="_blank" rel="noopener noreferrer" className="social-link whatsapp">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
        <p className="footer-copyright">&copy; 2024 RentACar. All rights reserved.</p>
      </footer>

      {detailModalOpen && selectedCar && (
        <CarDetailModal 
          car={selectedCar}
          images={selectedCarImages}
          onClose={closeDetailModal}
          onRent={handleRentClick}
        />
      )}
    </div>
  )
}

export default App
