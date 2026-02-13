import { useState, useEffect } from 'react'
import './CarForm.css'

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

// Helper to format date for input field (YYYY-MM-DD)
const formatDateForInput = (dateStr) => {
  if (!dateStr) return ''
  // If already in YYYY-MM-DD format, return as-is
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return dateStr
  // Try to parse and format
  const date = new Date(dateStr)
  if (isNaN(date.getTime())) return ''
  return date.toISOString().split('T')[0]
}

function CarForm({ car, password, onClose, onSubmit }) {
  const [formData, setFormData] = useState({
    name: '',
    model: '',
    year: new Date().getFullYear(),
    price_per_day: '',
    whatsapp_number: '',
    description: '',
    location: '',
    seats: 5,
    doors: 4,
    transmission: 'Automatic',
    available: true,
    start_date: '',
    end_date: '',
    images: []
  })
  const [newImageUrl, setNewImageUrl] = useState('')
  const [currentSlide, setCurrentSlide] = useState(0)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (car) {
      let carImages = []
      if (car.images) {
        if (Array.isArray(car.images)) {
          carImages = car.images
        } else if (typeof car.images === 'string') {
          try {
            carImages = JSON.parse(car.images)
          } catch {
            carImages = car.images.split(',').map(img => img.trim())
          }
        }
      } else if (car.image_url) {
        carImages = [car.image_url]
      }
      
      setFormData({
        name: car.name || '',
        model: car.model || '',
        year: car.year || new Date().getFullYear(),
        price_per_day: car.price_per_day || '',
        whatsapp_number: car.whatsapp_number || '',
        description: car.description || '',
        location: car.location || '',
        seats: car.seats || 5,
        doors: car.doors || 4,
        transmission: car.transmission || 'Automatic',
        available: car.available !== false,
        start_date: formatDateForInput(car.start_date),
        end_date: formatDateForInput(car.end_date),
        images: carImages
      })
    }
  }, [car])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    
    if (name === 'whatsapp_number') {
      let phone = value.replace(/[^0-9+]/g, '')
      if (phone && !phone.startsWith('+')) {
        phone = '+250' + phone.replace(/^0/, '')
      }
      setFormData(prev => ({
        ...prev,
        [name]: phone
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }))
    }
  }

  const addImage = () => {
    if (newImageUrl.trim()) {
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, newImageUrl.trim()]
      }))
      setNewImageUrl('')
      // Show the newly added image
      setCurrentSlide(formData.images.length)
    }
  }

  const removeImage = (index) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }))
    // Adjust current slide if needed
    if (currentSlide >= formData.images.length - 1) {
      setCurrentSlide(Math.max(0, formData.images.length - 2))
    }
  }

  const nextSlide = () => {
    if (formData.images.length > 0) {
      setCurrentSlide(prev => (prev + 1) % formData.images.length)
    }
  }

  const prevSlide = () => {
    if (formData.images.length > 0) {
      setCurrentSlide(prev => (prev - 1 + formData.images.length) % formData.images.length)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)

    try {
      const url = car 
        ? `${API_BASE}/admin/cars/${car.id}`
        : `${API_BASE}/admin/cars`
      const method = car ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'x-admin-password': password
        },
        body: JSON.stringify(formData)
      })

      const data = await response.json()
      
      if (data.success) {
        onSubmit()
      } else {
        alert(data.message || 'Failed to save car')
      }
    } catch (error) {
      console.error('Error saving car:', error)
      alert('Error saving car')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal car-form-modal" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>&times;</button>
        <h2>{car ? 'Edit Car' : 'Add New Car'}</h2>
        
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label>Car Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g., Toyota"
                required
              />
            </div>
            <div className="form-group">
              <label>Model *</label>
              <input
                type="text"
                name="model"
                value={formData.model}
                onChange={handleChange}
                placeholder="e.g., Corolla"
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Year *</label>
              <input
                type="number"
                name="year"
                value={formData.year}
                onChange={handleChange}
                min="2000"
                max="2030"
                required
              />
            </div>
            <div className="form-group">
              <label>Price/Day (RWF) *</label>
              <input
                type="number"
                name="price_per_day"
                value={formData.price_per_day}
                onChange={handleChange}
                min="0"
                placeholder="45000"
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Seats</label>
              <select name="seats" value={formData.seats} onChange={handleChange}>
                <option value="2">2 Seats</option>
                <option value="4">4 Seats</option>
                <option value="5">5 Seats</option>
                <option value="7">7 Seats</option>
                <option value="8">8 Seats</option>
              </select>
            </div>
            <div className="form-group">
              <label>Doors</label>
              <select name="doors" value={formData.doors} onChange={handleChange}>
                <option value="3">3 Doors</option>
                <option value="4">4 Doors</option>
                <option value="5">5 Doors</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Transmission</label>
              <select name="transmission" value={formData.transmission} onChange={handleChange}>
                <option value="Automatic">Automatic</option>
                <option value="Manual">Manual</option>
              </select>
            </div>
            <div className="form-group">
              <label>Location</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="e.g., Kigali, Rwanda"
              />
            </div>
          </div>

          <div className="form-group">
            <label>WhatsApp Number *</label>
            <input
              type="text"
              name="whatsapp_number"
              value={formData.whatsapp_number}
              onChange={handleChange}
              placeholder="e.g., +250788123456"
              required
            />
          </div>

          <div className="form-group">
            <label>Car Images</label>
            
            {/* Image Slider */}
            <div className="image-slider-container">
              {formData.images.length > 0 ? (
                <div className="image-slider">
                  <button type="button" className="slider-btn prev" onClick={prevSlide} disabled={formData.images.length <= 1}>
                    &#10094;
                  </button>
                  <div className="slider-content">
                    <img 
                      src={formData.images[currentSlide]} 
                      alt={`Car ${currentSlide + 1}`}
                      className="slider-image"
                    />
                    <div className="slider-indicator">
                      {currentSlide + 1} / {formData.images.length}
                    </div>
                    <button 
                      type="button" 
                      className="remove-image-btn"
                      onClick={() => removeImage(currentSlide)}
                    >
                      Remove
                    </button>
                  </div>
                  <button type="button" className="slider-btn next" onClick={nextSlide} disabled={formData.images.length <= 1}>
                    &#10095;
                  </button>
                </div>
              ) : (
                <div className="no-images">
                  <img src="/favicon.ico" alt="No image" />
                  <p>Add image URL below</p>
                </div>
              )}
            </div>
            
            {/* Add Image Input */}
            <div className="add-image-row">
              <input
                type="text"
                value={newImageUrl}
                onChange={(e) => setNewImageUrl(e.target.value)}
                placeholder="Enter URL"
              />
              <button type="button" onClick={addImage} disabled={!newImageUrl.trim()}>
                Add Image
              </button>
            </div>
            
            {/* Image Thumbnails */}
            {formData.images.length > 0 && (
              <div className="image-thumbnails">
                {formData.images.map((url, index) => (
                  <div 
                    key={index} 
                    className={`thumbnail ${index === currentSlide ? 'active' : ''}`}
                    onClick={() => setCurrentSlide(index)}
                  >
                    <img src={url} alt={`Thumbnail ${index + 1}`} />
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Brief description of the car"
              rows="3"
            />
          </div>

          <div className="form-group status-toggle">
            <label className="status-label">
              <span className="status-text">Status</span>
              <div className="toggle-wrapper">
                <input
                  type="checkbox"
                  name="available"
                  id="available"
                  checked={formData.available}
                  onChange={handleChange}
                />
                <label htmlFor="available" className="toggle-switch">
                  <span className={`toggle-slider ${formData.available ? 'available' : 'unavailable'}`}></span>
                </label>
                <span className={`status-badge ${formData.available ? 'available' : 'unavailable'}`}>
                  {formData.available ? 'Available' : 'Unavailable'}
                </span>
              </div>
            </label>
            <p className="status-hint">
              {formData.available 
                ? 'Car will be visible to customers' 
                : 'Car will be hidden from customers'}
            </p>
          </div>

          <div className="form-group availability-dates">
            <label>Availability Dates (Optional)</label>
            <p className="date-hint">Set the date range when this car is available for rent. Cars will only be shown as available if the selected date falls within this range.</p>
            <div className="date-inputs-row">
              <div className="date-input-group">
                <label htmlFor="start_date">Start Date</label>
                <input
                  type="date"
                  name="start_date"
                  id="start_date"
                  value={formData.start_date}
                  onChange={handleChange}
                />
              </div>
              <div className="date-input-group">
                <label htmlFor="end_date">End Date</label>
                <input
                  type="date"
                  name="end_date"
                  id="end_date"
                  value={formData.end_date}
                  onChange={handleChange}
                />
              </div>
            </div>
            {(formData.start_date || formData.end_date) && (
              <button 
                type="button" 
                className="clear-dates-btn"
                onClick={() => setFormData(prev => ({ ...prev, start_date: '', end_date: '' }))}
              >
                Clear Dates
              </button>
            )}
          </div>

          <div className="modal-actions">
            <button type="button" className="btn btn-cancel" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn" disabled={saving}>
              {saving ? 'Saving...' : (car ? 'Update Car' : 'Add Car')}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CarForm
