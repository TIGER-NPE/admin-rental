import { useState, useEffect, useRef } from 'react'
import './CarForm.css'

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'
const ADMIN_PASSWORD = 'tiger2oo8'

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

function CarForm({ car, onClose, onSubmit }) {
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
  const [currentSlide, setCurrentSlide] = useState(0)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [pendingImages, setPendingImages] = useState([]) // For new cars before save
  const fileInputRef = useRef(null)

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

  const handleFileUpload = async (e) => {
    const files = Array.from(e.target.files)
    if (files.length === 0) return

    // For existing cars, upload directly
    if (car?.id) {
      await uploadImagesToServer(files, car.id)
    } else {
      // For new cars, create preview URLs
      const newImages = files.map(file => URL.createObjectURL(file))
      setPendingImages(prev => [...prev, ...files])
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, ...newImages]
      }))
      setCurrentSlide(formData.images.length)
    }
    
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const uploadImagesToServer = async (files, carId) => {
    setUploading(true)
    
    try {
      const formDataUpload = new FormData()
      files.forEach(file => {
        formDataUpload.append('photos', file)
      })

      const response = await fetch(`${API_BASE}/admin/cars/${carId}/images`, {
        method: 'POST',
        headers: {
          'x-admin-password': ADMIN_PASSWORD
        },
        body: formDataUpload
      })

      const data = await response.json()
      
      if (data.success) {
        setFormData(prev => ({
          ...prev,
          images: data.images
        }))
        setCurrentSlide(data.images.length - 1)
      } else {
        alert(data.message || 'Failed to upload images')
      }
    } catch (error) {
      console.error('Error uploading images:', error)
      alert('Error uploading images')
    } finally {
      setUploading(false)
    }
  }

  const removeImage = async (index) => {
    const imageToRemove = formData.images[index]
    
    // For new cars or blob URLs (local preview), just remove from local preview
    if (!car?.id || imageToRemove.startsWith('blob:')) {
      setFormData(prev => ({
        ...prev,
        images: prev.images.filter((_, i) => i !== index)
      }))
      // Adjust current slide if needed
      if (currentSlide >= formData.images.length - 1) {
        setCurrentSlide(Math.max(0, formData.images.length - 2))
      }
      return
    }
    
    // For existing cars, remove from server
    try {
      const response = await fetch(`${API_BASE}/admin/cars/${car.id}/images`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-password': ADMIN_PASSWORD
        },
        body: JSON.stringify({ imageUrl: imageToRemove })
      })

      const data = await response.json()
      
      if (data.success) {
        setFormData(prev => ({
          ...prev,
          images: data.images
        }))
        if (currentSlide >= data.images.length) {
          setCurrentSlide(Math.max(0, data.images.length - 1))
        }
      } else {
        alert(data.message || 'Failed to remove image')
      }
    } catch (error) {
      console.error('Error removing image:', error)
      alert('Error removing image')
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
      // For new cars with blob images, upload images first
      let finalImages = [...formData.images]
      if (!car && pendingImages.length > 0) {
        // Upload blob images first
        const uploadedUrls = await uploadBlobImagesToServer(pendingImages)
        finalImages = [...formData.images.filter(img => !img.startsWith('blob:')), ...uploadedUrls]
      }
      
      const url = car 
        ? `${API_BASE}/admin/cars/${car.id}`
        : `${API_BASE}/admin/cars`
      const method = car ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'x-admin-password': ADMIN_PASSWORD
        },
        body: JSON.stringify({ ...formData, images: finalImages })
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

  // Upload blob images to server and return real URLs
  const uploadBlobImagesToServer = async (blobFiles) => {
    setUploading(true)
    try {
      const formDataUpload = new FormData()
      blobFiles.forEach(file => {
        formDataUpload.append('photos', file)
      })

      // First create a temporary car to get an ID
      const tempResponse = await fetch(`${API_BASE}/admin/cars`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-password': ADMIN_PASSWORD
        },
        body: JSON.stringify({
          name: formData.name,
          model: formData.model,
          year: formData.year,
          price_per_day: formData.price_per_day,
          whatsapp_number: formData.whatsapp_number,
          description: formData.description,
          seats: formData.seats,
          doors: formData.doors,
          transmission: formData.transmission,
          images: []
        })
      })
      
      const tempData = await tempResponse.json()
      if (!tempData.success) {
        throw new Error('Failed to create temporary car')
      }
      
      const tempCarId = tempData.id
      
      // Now upload images to the temp car
      const uploadResponse = await fetch(`${API_BASE}/admin/cars/${tempCarId}/images`, {
        method: 'POST',
        headers: {
          'x-admin-password': ADMIN_PASSWORD
        },
        body: formDataUpload
      })
      
      const uploadData = await uploadResponse.json()
      
      // Delete the temp car (we'll recreate with full data including images)
      await fetch(`${API_BASE}/admin/cars/${tempCarId}`, {
        method: 'DELETE',
        headers: {
          'x-admin-password': ADMIN_PASSWORD
        }
      })
      
      if (uploadData.success) {
        return uploadData.images
      } else {
        throw new Error('Failed to upload images')
      }
    } catch (error) {
      console.error('Error uploading blob images:', error)
      alert('Error uploading images')
      return []
    } finally {
      setUploading(false)
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
              <label htmlFor="name">Car Name *</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g., Toyota"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="model">Model *</label>
              <input
                type="text"
                id="model"
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
              <label htmlFor="year">Year *</label>
              <input
                type="number"
                id="year"
                name="year"
                value={formData.year}
                onChange={handleChange}
                min="2000"
                max="2030"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="price_per_day">Price/Day (RWF) *</label>
              <input
                type="number"
                id="price_per_day"
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
              <label htmlFor="seats">Seats</label>
              <select id="seats" name="seats" value={formData.seats} onChange={handleChange}>
                <option value="2">2 Seats</option>
                <option value="4">4 Seats</option>
                <option value="5">5 Seats</option>
                <option value="7">7 Seats</option>
                <option value="8">8 Seats</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="doors">Doors</label>
              <select id="doors" name="doors" value={formData.doors} onChange={handleChange}>
                <option value="3">3 Doors</option>
                <option value="4">4 Doors</option>
                <option value="5">5 Doors</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="transmission">Transmission</label>
              <select id="transmission" name="transmission" value={formData.transmission} onChange={handleChange}>
                <option value="Automatic">Automatic</option>
                <option value="Manual">Manual</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="location">Location</label>
              <input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="e.g., Kigali, Rwanda"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="whatsapp_number">WhatsApp Number *</label>
            <input
              type="text"
              id="whatsapp_number"
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
                  <button type="button" className="slider-btn prev" onClick={prevSlide} disabled={formData.images.length <= 1} aria-label="Previous image">
                    &#10094;
                  </button>
                  <div className="slider-content">
                    <img 
                      src={formData.images[currentSlide]} 
                      alt={`Car image ${currentSlide + 1}`}
                      className="slider-image"
                    />
                    <div className="slider-indicator">
                      {currentSlide + 1} / {formData.images.length}
                    </div>
                    <button 
                      type="button" 
                      className="remove-image-btn"
                      onClick={() => removeImage(currentSlide)}
                      aria-label="Remove current image"
                    >
                      Remove
                    </button>
                  </div>
                  <button type="button" className="slider-btn next" onClick={nextSlide} disabled={formData.images.length <= 1} aria-label="Next image">
                    &#10095;
                  </button>
                </div>
              ) : (
                <div className="no-images">
                  <img src="/favicon.ico" alt="No image" />
                  <p>Upload car images below</p>
                </div>
              )}
            </div>
            
            {/* File Upload */}
            <div className="add-image-row">
              <label htmlFor="image-upload" className="sr-only">Upload car images</label>
              <input
                type="file"
                id="image-upload"
                ref={fileInputRef}
                onChange={handleFileUpload}
                accept="image/*"
                multiple
                disabled={uploading}
              />
              <span className="upload-status">
                {uploading ? 'Uploading...' : ''}
              </span>
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
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
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
