import { useState, useEffect } from 'react'
import { useLanguage } from '../context/LanguageContext'
import './DatePicker.css'

function DatePicker({ onSelectDates, selectedDates, onCheckAvailability, onClear }) {
  const { t } = useLanguage()
  const [pickupDate, setPickupDate] = useState(selectedDates?.start || '')
  
  // Sync with parent's selectedDates when it changes
  useEffect(() => {
    if (selectedDates) {
      setPickupDate(selectedDates.start || '')
    }
  }, [selectedDates])

  const handlePickupChange = (e) => {
    const date = e.target.value
    setPickupDate(date)
    if (onSelectDates) {
      onSelectDates({ start: date, end: '' })
    }
  }

  const handleCheck = () => {
    if (pickupDate && onCheckAvailability) {
      onCheckAvailability({ start: pickupDate, end: '' })
    }
  }

  const handleClear = () => {
    setPickupDate('')
    if (onSelectDates) {
      onSelectDates({ start: '', end: '' })
    }
    if (onClear) {
      onClear()
    }
  }

  // Get today's date in YYYY-MM-DD format for min attribute
  const today = new Date().toISOString().split('T')[0]

  return (
    <div className="date-picker">
      <div className="date-picker-label">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
          <line x1="16" y1="2" x2="16" y2="6"/>
          <line x1="8" y1="2" x2="8" y2="6"/>
          <line x1="3" y1="10" x2="21" y2="10"/>
        </svg>
        <span>{t.checkAvailability || 'Check Availability'}</span>
      </div>
      
      <div className="date-picker-inputs">
        <div className="date-input-group">
          <label>{t.pickupDate || 'Pickup Date'}</label>
          <input
            type="date"
            value={pickupDate}
            onChange={handlePickupChange}
            min={today}
            className="date-input"
          />
        </div>
        
        <div className="date-picker-actions">
          <button 
            className="check-availability-btn"
            onClick={handleCheck}
            disabled={!pickupDate}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
            {t.check || 'Check'}
          </button>
          
          {pickupDate && (
            <button className="clear-dates-btn" onClick={handleClear}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18"/>
                <line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default DatePicker
