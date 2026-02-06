import { useState, useEffect } from 'react'
import './DriverForm.css'

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'
const ADMIN_PASSWORD = 'tiger2oo8'

function DriverForm({ driver, onClose, onSubmit }) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    license_number: '',
    vehicle_assigned: '',
    status: 'available',
    photo_url: ''
  })
  const [uploading, setUploading] = useState(false)
  const [urlPreview, setUrlPreview] = useState('')

  useEffect(() => {
    if (driver) {
      setFormData({
        name: driver.name || '',
        phone: driver.phone || '',
        email: driver.email || '',
        license_number: driver.license_number || '',
        vehicle_assigned: driver.vehicle_assigned || '',
        status: driver.status || 'available',
        photo_url: driver.photo_url || ''
      })
    }
  }, [driver])

  const handleChange = (e) => {
    const { name, value } = e.target
    
    // Update URL preview when photo_url changes
    if (name === 'photo_url') {
      setUrlPreview(value)
    }
    
    // Auto-add +250 to phone number if not present
    if (name === 'phone') {
      let phone = value.replace(/[^0-9+]/g, '')
      if (phone && !phone.startsWith('+')) {
        phone = '+250' + phone.replace(/^0/, '')
      }
      setFormData(prev => ({ ...prev, [name]: phone }))
    } else {
      setFormData(prev => ({ ...prev, [name]: value }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setUploading(true)
    
    console.log('=== DRIVER FORM DEBUG ===')
    console.log('formData:', formData)
    console.log('photo_url being sent:', formData.photo_url)
    
    try {
      const url = driver 
        ? `${API_BASE}/admin/drivers/${driver.id}`
        : `${API_BASE}/admin/drivers`
      
      const method = driver ? 'PUT' : 'POST'
      
      const response = await fetch(url, {
        method,
        headers: { 
          'Content-Type': 'application/json',
          'x-admin-password': ADMIN_PASSWORD
        },
        body: JSON.stringify(formData)
      })
      
      console.log('Response status:', response.status)
      const data = await response.json()
      console.log('API Response:', data)
      
      if (data.success) {
        console.log('Driver saved successfully!')
        onSubmit()
      } else {
        console.error('API Error:', data.message)
        alert(data.message || 'Failed to save driver')
      }
    } catch (err) {
      console.error('Connection error:', err)
      alert('Connection error')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="form-overlay">
      <div className="form-modal">
        <div className="form-header">
          <h2>{driver ? 'Edit Driver' : 'Add New Driver'}</h2>
          <button className="btn-close" onClick={onClose}>&times;</button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Name *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Driver full name"
            />
          </div>
          
          <div className="form-group">
            <label>Photo URL</label>
            <input
              type="url"
              name="photo_url"
              value={formData.photo_url}
              onChange={handleChange}
              placeholder="https://example.com/driver-photo.jpg"
            />
            <small>Use images from Google Photos, Imgur, or direct image links. Avoid Facebook/Instagram URLs (CORS blocked).</small>
            {urlPreview && (
              <div className="url-preview">
                <img src={urlPreview} alt="Preview" onError={(e) => {
                  e.target.style.display='none';
                  e.target.parentElement.innerHTML = '<span style="color: #e74c3c; font-size: 12px;">⚠️ Image blocked by CORS. Try a different URL.</span>';
                }} />
              </div>
            )}
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label>Phone *</label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                placeholder="+250788123456"
              />
            </div>
            
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="driver@email.com"
              />
            </div>
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label>License Number</label>
              <input
                type="text"
                name="license_number"
                value={formData.license_number}
                onChange={handleChange}
                placeholder="DL123456"
              />
            </div>
            
            <div className="form-group">
              <label>Vehicle Assigned</label>
              <input
                type="text"
                name="vehicle_assigned"
                value={formData.vehicle_assigned}
                onChange={handleChange}
                placeholder="Toyota Corolla"
              />
            </div>
          </div>
          
          <div className="form-group">
            <label>Status</label>
            <select name="status" value={formData.status} onChange={handleChange}>
              <option value="available">Available</option>
              <option value="busy">Busy</option>
              <option value="offline">Offline</option>
            </select>
          </div>
          
          <div className="form-actions">
            <button type="button" className="btn-cancel" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-submit" disabled={uploading}>
              {uploading ? 'Saving...' : (driver ? 'Update Driver' : 'Add Driver')}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default DriverForm
