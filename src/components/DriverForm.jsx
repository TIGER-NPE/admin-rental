import { useState, useEffect } from 'react'
import './DriverForm.css'

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

function DriverForm({ driver, password, onClose, onSubmit }) {
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
    
    console.log('Submitting driver formData:', formData)
    console.log('Driver Photo URL being sent:', formData.photo_url)
    
    try {
      // First save driver data
      const url = driver 
        ? `${API_BASE}/admin/drivers/${driver.id}`
        : `${API_BASE}/admin/drivers`
      
      const method = driver ? 'PUT' : 'POST'
      
      console.log('API URL:', url)
      console.log('Method:', method)
      
      const response = await fetch(url, {
        method,
        headers: { 
          'Content-Type': 'application/json',
          'x-admin-password': password
        },
        body: JSON.stringify(formData)
      })
      
      console.log('Response status:', response.status)
      const data = await response.json()
      console.log('Response data:', data)
      
      if (data.success) {
        onSubmit()
      } else {
        alert(data.message || 'Failed to save driver')
      }
    } catch {
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
