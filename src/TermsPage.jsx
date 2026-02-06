import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import './TermsPage.css'
import LanguageSelector from '../components/LanguageSelector'
import { useLanguage } from '../context/LanguageContext'

const API_BASE = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? 'https://car-rental-api-pp6g.onrender.com' : 'http://localhost:3000')

// FAQ Section - Most common questions
const FAQS = [
  {
    id: 'faq1',
    question: 'What documents do I need to rent a car?',
    answer: 'You need a valid driver\'s license (international if not in English), passport or national ID, and a mobile phone for WhatsApp communication.'
  },
  {
    id: 'faq2',
    question: 'Is insurance included?',
    answer: 'Basic insurance is included in the rental price. Comprehensive insurance can be added for additional coverage at a small fee.'
  },
  {
    id: 'faq3',
    question: 'Can I pick up the car at the airport?',
    answer: 'Yes, we offer airport pickup and drop-off services at no additional cost. Simply contact us via WhatsApp to arrange.'
  },
  {
    id: 'faq4',
    question: 'What is the cancellation policy?',
    answer: 'Free cancellation up to 24 hours before pickup. Late cancellations may incur a one-day charge. No-shows will be charged in full.'
  },
  {
    id: 'faq5',
    question: 'How does the WhatsApp booking work?',
    answer: 'Browse cars on our website, click "Rent" to open WhatsApp with a pre-filled message. Our team will respond within minutes to confirm availability and payment.'
  },
  {
    id: 'faq6',
    question: 'What payment methods do you accept?',
    answer: 'We accept cash, mobile money (M-Pesa, Airtel Money), and bank transfers. Payment must be made before vehicle release.'
  }
]

// Default terms for when API is unavailable
const DEFAULT_TERMS = [
  {
    id: 1,
    title: '1. Eligibility',
    content: 'Renters must be 18 years or older.\nA valid driver\'s license is required.\nProof of identity and contact information must be provided.'
  },
  {
    id: 2,
    title: '2. Booking and Reservation',
    content: 'All bookings must be made through our website or approved contact methods.\nReservations are confirmed only after payment or admin approval.\nCancellations must be notified at least 24 hours in advance.'
  },
  {
    id: 3,
    title: '3. Payment',
    content: 'Payment can be made via approved methods (e.g., cash, mobile money, or bank transfer).\nNo vehicle will be released without full payment.\nAdditional charges may apply for late return or extra services.'
  },
  {
    id: 4,
    title: '4. Vehicle Use',
    content: 'Vehicles must be used legally and responsibly.\nNo smoking, alcohol, or illegal substances in the vehicle.\nRenters are responsible for any damage caused during rental.\nVehicles must be returned in the same condition as received.'
  },
  {
    id: 5,
    title: '5. Fuel Policy',
    content: 'Vehicles are provided with a full tank.\nRenters must refuel before returning; otherwise, refueling charges apply.'
  },
  {
    id: 6,
    title: '6. Rental Duration and Late Returns',
    content: 'The rental period starts at the agreed pickup time.\nLate returns are subject to extra charges per hour/day.\nEarly returns will not affect the paid rental fee unless otherwise agreed.'
  },
  {
    id: 7,
    title: '7. Insurance & Liability',
    content: 'Renters are responsible for minor damages and fines.\nMajor accidents must be reported immediately.\nInsurance coverage details will be provided at pickup.'
  },
  {
    id: 8,
    title: '8. WhatsApp / Contact Rules',
    content: 'Communication for booking is done via WhatsApp or official contact numbers.\nDo not share the vehicle or booking details with third parties.\nAll inquiries must be polite and professional.'
  },
  {
    id: 9,
    title: '9. Termination of Rental',
    content: 'Rental may be terminated immediately if rules are violated.\nNo refunds for early termination caused by renter misconduct.'
  },
  {
    id: 10,
    title: '10. General',
    content: 'We reserve the right to update these rules at any time.\nBy renting a vehicle, you agree to follow all terms and policies.\nQuestions or concerns can be addressed via official contact channels.'
  }
]

function TermsPage() {
  const { t } = useLanguage()
  const [terms, setTerms] = useState([])
  const [loading, setLoading] = useState(true)
  const [expandedTerm, setExpandedTerm] = useState(null)
  const [expandedFaq, setExpandedFaq] = useState(null)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    fetchTerms()
  }, [])

  const fetchTerms = async () => {
    try {
      const response = await fetch(`${API_BASE}/terms`)
      const data = await response.json()
      if (data.success) {
        if (data.data.length === 0) {
          setTerms(DEFAULT_TERMS)
        } else {
          setTerms(data.data)
        }
      } else {
        setTerms(DEFAULT_TERMS)
      }
    } catch {
      setTerms(DEFAULT_TERMS)
    } finally {
      setLoading(false)
    }
  }

  const toggleTerm = (id) => {
    setExpandedTerm(expandedTerm === id ? null : id)
  }

  const toggleFaq = (id) => {
    setExpandedFaq(expandedFaq === id ? null : id)
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
            <Link to="/drivers" className="nav-link">{t.drivers}</Link>
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

      <main className="main terms-main">
        <div className="terms-container">
          <div className="terms-header">
            <h1>Frequently Asked Questions</h1>
            <p>Quick answers to common questions about renting a car</p>
          </div>
          
          {/* FAQ Section */}
          <div className="faq-section">
            {FAQS.map((faq) => (
              <div 
                key={faq.id} 
                className={`faq-item ${expandedFaq === faq.id ? 'expanded' : ''}`}
                onClick={() => toggleFaq(faq.id)}
              >
                <div className="faq-question">
                  <h3>{faq.question}</h3>
                  <span className="toggle-icon">
                    {expandedFaq === faq.id ? (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="18 15 12 9 6 15"/>
                      </svg>
                    ) : (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="6 9 12 15 18 9"/>
                      </svg>
                    )}
                  </span>
                </div>
                {expandedFaq === faq.id && (
                  <div className="faq-answer">
                    <p>{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
          
          <div className="terms-divider">
            <span className="divider-line"></span>
            <h2>Full Terms & Conditions</h2>
            <span className="divider-line"></span>
          </div>
          
          {loading ? (
            <div className="terms-loading">
              <div className="spinner"></div>
              <p>Loading terms...</p>
            </div>
          ) : (
            <div className="terms-list">
              {terms.map((term) => (
                <div 
                  key={term.id} 
                  className={`term-item ${expandedTerm === term.id ? 'expanded' : ''}`}
                  onClick={() => toggleTerm(term.id)}
                >
                  <div className="term-title">
                    <h3>{term.title}</h3>
                    <span className="toggle-icon">
                      {expandedTerm === term.id ? (
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <polyline points="18 15 12 9 6 15"/>
                        </svg>
                      ) : (
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <polyline points="6 9 12 15 18 9"/>
                        </svg>
                      )}
                    </span>
                  </div>
                  {expandedTerm === term.id && (
                    <div className="term-content">
                      {term.content.split('\n').map((line, idx) => (
                        <p key={idx}>{line}</p>
                      ))}
                    </div>
                  )}
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
    </div>
  )
}

export default TermsPage
