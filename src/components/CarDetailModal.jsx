import { useState } from 'react'
import './CarDetailModal.css'

// Helper to parse JSON string to array if needed
const parseImages = (images) => {
  if (!images) return []
  if (Array.isArray(images)) return images
  if (typeof images === 'string') {
    try {
      return JSON.parse(images)
    } catch {
      return []
    }
  }
  return []
}

// Helper to format image URLs for local paths
const formatImageUrl = (url) => {
  if (!url) return ''
  if (url.startsWith('/')) {
    return `http://localhost:3000${url}`
  }
  return url
}

function CarDetailModal({ car, images, onClose, onRent }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  
  // Return null if no car is provided
  if (!car) return null
  
  // Parse and format all images
  const parsedImages = parseImages(images || car.images)
  const formattedImages = (parsedImages.length > 0 
    ? parsedImages 
    : car.image_url 
      ? [car.image_url] 
      : []
  ).map(formatImageUrl)

  const allImages = formattedImages
  
  const goToPrevious = () => {
    setCurrentImageIndex(prev => prev === 0 ? allImages.length - 1 : prev - 1)
  }

  const goToNext = () => {
    setCurrentImageIndex(prev => prev === allImages.length - 1 ? 0 : prev + 1)
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-RW', {
      style: 'currency',
      currency: 'RWF',
      minimumFractionDigits: 0
    }).format(price)
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="car-detail-modal" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>&times;</button>
        
        {/* Image Slideshow */}
        {allImages.length > 0 && (
          <div className="image-slideshow">
            <img 
              src={allImages[currentImageIndex]} 
              alt={`${car.name} ${car.model} - Image ${currentImageIndex + 1}`}
              className="slideshow-image"
            />
            
            {allImages.length > 1 && (
              <>
                <button className="slideshow-btn prev" onClick={goToPrevious}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M15 18l-6-6 6-6"/>
                  </svg>
                </button>
                <button className="slideshow-btn next" onClick={goToNext}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M9 18l6-6-6-6"/>
                  </svg>
                </button>
                
                {/* Dots indicator */}
                <div className="slideshow-dots">
                  {allImages.map((_, index) => (
                    <span 
                      key={index}
                      className={`dot ${index === currentImageIndex ? 'active' : ''}`}
                      onClick={() => setCurrentImageIndex(index)}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        )}
        
        <div className="car-detail-content">
          <h2>{car.name} {car.model}</h2>
          
          <div className="car-meta">
            <span className="car-year-badge">{car.year}</span>
            <span className="car-location">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                <circle cx="12" cy="10" r="3"/>
              </svg>
              {car.location || 'Kigali, Rwanda'}
            </span>
          </div>
          
          {/* Car Details Icons */}
          <div className="modal-car-details">
            <div className="car-detail" title="Seats">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#25D366" strokeWidth="2">
                <path d="M4 12h16a2 2 0 012 2v5a2 2 0 01-2 2H4a2 2 0 01-2-2v-5a2 2 0 012-2z"/>
                <path d="M4 12V7a4 4 0 016-2c.5 1.5 1.5 2.5 3 3l1 1"/>
                <path d="M8 7v0M12 7v0M16 7v0"/>
              </svg>
              <span>{car.seats || 5} Seats</span>
            </div>
            <div className="car-detail" title="Doors">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#25D366" strokeWidth="2">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                <path d="M9 3v18M12 9h3M12 13h3"/>
              </svg>
              <span>{car.doors || 4} Doors</span>
            </div>
            <div className="car-detail" title="Transmission">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#25D366" strokeWidth="2">
                <circle cx="12" cy="12" r="3"/>
                <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/>
              </svg>
              <span>{car.transmission || 'Automatic'}</span>
            </div>
          </div>
          
          {car.description && (
            <p className="car-description">{car.description}</p>
          )}
          
          <div className="car-price-section">
            <span className="price-label">Daily Rate</span>
            <span className="price-value">{formatPrice(car.price_per_day)}</span>
            <span className="price-period">/day</span>
          </div>
          
          <div className="car-contact">
            <p>Contact owner via WhatsApp:</p>
            <a href={`https://wa.me/${car.whatsapp_number.replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener noreferrer" className="whatsapp-link">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              {car.whatsapp_number}
            </a>
          </div>
          
          <button className="btn-rent-large" onClick={() => onRent(car)}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            Contact via WhatsApp
          </button>
        </div>
      </div>
    </div>
  )
}

export default CarDetailModal
