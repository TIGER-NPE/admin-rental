import { useState } from 'react'
import './CarCard.css'

// Helper to check if a car is available on a specific date
const isCarAvailableOnDate = (car, date = new Date()) => {
  // If car has no date restrictions, it's available
  if (!car.start_date && !car.end_date) {
    return true
  }
  
  const checkDate = new Date(date)
  checkDate.setHours(0, 0, 0, 0)
  
  const carStart = car.start_date ? new Date(car.start_date) : null
  const carEnd = car.end_date ? new Date(car.end_date) : null
  
  // Check if current date falls within the car's availability period
  if (carStart && carEnd) {
    return checkDate >= carStart && checkDate <= carEnd
  } else if (carStart) {
    return checkDate >= carStart
  } else if (carEnd) {
    return checkDate <= carEnd
  }
  
  return true
}

function CarCard({ car, onRent, onClick, selectedDate }) {
  const [currentSlide, setCurrentSlide] = useState(0)
  
  // Check if car is available - available column from MySQL (TRUE/1 or FALSE/0)
  const isDbAvailable = car.available === 1 || car.available === true || car.available === '1' || car.available === 'true'
  
  // Get today's date at midnight for comparison
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  
  // Check if start_date is in the future
  const hasFutureStartDate = car.start_date ? new Date(car.start_date) > today : false
  
  // Check date-based availability using selected date or current date
  const checkDate = selectedDate ? new Date(selectedDate) : today
  checkDate.setHours(0, 0, 0, 0)
  
  const isDateAvailable = isCarAvailableOnDate(car, checkDate)
  
  // Show unavailable sign if:
  // 1. Car has date restrictions AND selected date is NOT within range, OR
  // 2. Car is marked unavailable in DB AND has no date restrictions
  const hasDateRestrictions = car.start_date || car.end_date
  const showUnavailableSign = hasDateRestrictions ? !isDateAvailable : !isDbAvailable
  
  // Allow booking if:
  // 1. Date is within availability range (overrides DB status), OR
  // 2. Car has no date restrictions AND DB says available
  const canBook = isDateAvailable || (!hasDateRestrictions && isDbAvailable)
  
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-RW', {
      style: 'currency',
      currency: 'RWF',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price)
  }

  // Get images array
  const getImages = () => {
    if (car.images) {
      if (Array.isArray(car.images)) {
        return car.images
      } else if (typeof car.images === 'string') {
        try {
          return JSON.parse(car.images)
        } catch {
          return car.images.split(',').map(img => img.trim())
        }
      }
    }
    if (car.image_url) {
      return [car.image_url]
    }
    return []
  }

  const images = getImages()
  const hasMultipleImages = images.length > 1

  const nextSlide = (e) => {
    e.stopPropagation()
    if (hasMultipleImages) {
      setCurrentSlide((prev) => (prev + 1) % images.length)
    }
  }

  const prevSlide = (e) => {
    e.stopPropagation()
    if (hasMultipleImages) {
      setCurrentSlide((prev) => (prev - 1 + images.length) % images.length)
    }
  }

  const getImageUrl = (url) => {
    if (!url) {
      return '/favicon.ico'
    }
    if (url.startsWith('/')) {
      return url
    }
    return url
  }

  const handleCardClick = () => {
    if (canBook) {
      onClick()
    }
  }

  // Get unavailability reason
  const getUnavailabilityReason = () => {
    if (!isDbAvailable && !car.start_date && !car.end_date) {
      return 'Booked'
    }
    if (car.start_date && car.end_date) {
      return `Available: ${car.start_date} - ${car.end_date}`
    } else if (car.start_date) {
      return `Available from ${car.start_date}`
    } else if (car.end_date) {
      return `Available until ${car.end_date}`
    }
    return 'Unavailable'
  }

  return (
    <div className={`car-card ${showUnavailableSign ? 'unavailable' : ''}`} onClick={handleCardClick}>
      <div className="car-image">
        {images.length > 0 ? (
          <div className="image-slider-wrapper">
            <img 
              src={getImageUrl(images[currentSlide])} 
              alt={`${car.name} ${car.model}`}
              onError={(e) => {
                e.target.src = '/favicon.ico'
              }}
            />
            
            {hasMultipleImages && (
              <>
                <button className="slider-arrow prev" onClick={prevSlide}>
                  &#10094;
                </button>
                <button className="slider-arrow next" onClick={nextSlide}>
                  &#10095;
                </button>
                <div className="slider-dots">
                  {images.map((_, index) => (
                    <span 
                      key={index} 
                      className={`dot ${index === currentSlide ? 'active' : ''}`}
                      onClick={(e) => {
                        e.stopPropagation()
                        setCurrentSlide(index)
                      }}
                    />
                  ))}
                </div>
              </>
            )}
            
            <div className="image-count">
              {currentSlide + 1} / {images.length}
            </div>
          </div>
        ) : (
          <img 
            src="https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=400" 
            alt={`${car.name} ${car.model}`}
          />
        )}
        
        <div className="car-year">{car.year}</div>
        {showUnavailableSign && (
          <div className="unavailable-overlay">
            <span>{getUnavailabilityReason()}</span>
          </div>
        )}
      </div>
      
      <div className="car-content">
        <h3 className="car-title">{car.name}</h3>
        <p className="car-model">{car.model}</p>
        
        {car.description && (
          <p className="car-description">{car.description}</p>
        )}

        {/* Car Details Icons */}
        <div className="car-details">
          <div className="car-detail" title="Seats">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#25D366" strokeWidth="2">
              <path d="M4 12h16a2 2 0 012 2v5a2 2 0 01-2 2H4a2 2 0 01-2-2v-5a2 2 0 012-2z"/>
              <path d="M4 12V7a4 4 0 016-2c.5 1.5 1.5 2.5 3 3l1 1"/>
              <path d="M8 7v0M12 7v0M16 7v0"/>
            </svg>
            <span>{car.seats || 5}</span>
          </div>
          <div className="car-detail" title="Doors">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#25D366" strokeWidth="2">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
              <path d="M9 3v18M12 9h3M12 13h3"/>
            </svg>
            <span>{car.doors || 4}</span>
          </div>
          <div className="car-detail" title="Transmission">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#25D366" strokeWidth="2">
              <circle cx="12" cy="12" r="3"/>
              <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/>
            </svg>
            <span>{car.transmission || 'Auto'}</span>
          </div>
        </div>

        {car.location && (
          <p className="car-location">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
              <circle cx="12" cy="10" r="3"/>
            </svg>
            {car.location}
          </p>
        )}
        
        <div className="car-footer">
          <div className="car-price">
            <span className="price-amount">{formatPrice(car.price_per_day)}</span>
            <span className="price-period">/day</span>
          </div>
          
          <button 
            className={`btn-rent ${!canBook ? 'disabled' : ''}`}
            disabled={!canBook}
            onClick={(e) => {
              e.stopPropagation()
              if (canBook) {
                onRent(car)
              }
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            Rent via WhatsApp
          </button>
        </div>
      </div>
    </div>
  )
}

export default CarCard
