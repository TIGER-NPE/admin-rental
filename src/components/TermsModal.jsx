import { useState, useEffect } from 'react'
import './TermsModal.css'

const API_BASE = '/api'

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

function TermsModal({ isOpen, onClose }) {
  const [terms, setTerms] = useState([])
  const [loading, setLoading] = useState(true)
  const [expandedTerm, setExpandedTerm] = useState(null)

  useEffect(() => {
    if (isOpen) {
      fetchTerms()
    }
  }, [isOpen])

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

  if (!isOpen) return null

  return (
    <div className="terms-modal-overlay" onClick={onClose}>
      <div className="terms-modal" onClick={e => e.stopPropagation()}>
        <div className="terms-modal-header">
          <h2>Car Rental Rules & Policies</h2>
          <button className="terms-modal-close" onClick={onClose}>&times;</button>
        </div>
        
        <div className="terms-modal-content">
          <p className="terms-intro">Please review our terms and conditions before booking</p>
          
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
      </div>
    </div>
  )
}

export default TermsModal
