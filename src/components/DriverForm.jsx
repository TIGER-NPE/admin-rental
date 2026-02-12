import { useState, useEffect, useRef } from 'react'
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
  const [photoPreview, setPhotoPreview] = useState('')
  const [pendingPhoto, setPendingPhoto] = useState(null) // For new drivers before save
  const fileInputRef = useRef(null)

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
      if (driver.photo_url) {
        setPhotoPreview(driver.photo_url)
      }
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

  const handleFileUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    // For existing drivers, upload directly
    if (driver?.id) {
      await uploadPhotoToServer(file, driver.id)
    } else {
      // For new drivers, create preview URL
      const previewUrl = URL.createObjectURL(file)
      setPendingPhoto(file)
      setPhotoPreview(previewUrl)
      setFormData(prev => ({ ...prev, photo_url: previewUrl }))
    }
    
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const uploadPhotoToServer = async (file, driverId) => {
    setUploading(true)
    
    try {
      const formDataUpload = new FormData()
      formDataUpload.append('photo', file)

      const response = await fetch(`${API_BASE}/admin/drivers/${driverId}/photo`, {
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
          photo_url: data.photoUrl
        }))
        setPhotoPreview(data.photoUrl)
      } else {
        alert(data.message || 'Failed to upload photo')
      }
    } catch (error) {
      console.error('Error uploading photo:', error)
      alert('Error uploading photo')
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setUploading(true)
    
    console.log('=== DRIVER FORM DEBUG ===')
    console.log('formData:', formData)
    console.log('photo_url being sent:', formData.photo_url)
    console.log('pendingPhoto:', pendingPhoto)
    
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
        
        // Upload pending photo for new drivers
        if (pendingPhoto && data.id) {
          await uploadPhotoToServer(pendingPhoto, data.id)
        }
        
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
            <label htmlFor="driver-name">Name *</label>
            <input
              type="text"
              id="driver-name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Driver full name"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="driver-photo">Photo</label>
            <div className="photo-upload-container">
              {photoPreview ? (
                <div className="photo-preview">
                  <img src={photoPreview} alt="Driver preview" />
                  <button 
                    type="button" 
                    className="remove-photo-btn"
                    onClick={() => {
                      setPhotoPreview('')
                      setPendingPhoto(null)
                      setFormData(prev => ({ ...prev, photo_url: '' }))
                    }}
                    aria-label="Remove driver photo"
                  >
                    &times;
                  </button>
                </div>
              ) : (
                <div className="photo-placeholder">
                  <span>No photo</span>
                </div>
              )}
              <input
                type="file"
                id="driver-photo"
                ref={fileInputRef}
                onChange={handleFileUpload}
                accept="image/*"
                disabled={uploading}
              />
              {uploading && <span className="upload-status">Uploading...</span>}
            </div>
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="driver-phone">Phone *</label>
              <input
                type="text"
                id="driver-phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                placeholder="+250788123456"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="driver-email">Email</label>
              <input
                type="email"
                id="driver-email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="driver@email.com"
              />
            </div>
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="driver-license">License Number</label>
              <input
                type="text"
                id="driver-license"
                name="license_number"
                value={formData.license_number}
                onChange={handleChange}
                placeholder="DL123456"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="driver-vehicle">Vehicle Assigned</label>
              <input
                type="text"
                id="driver-vehicle"
                name="vehicle_assigned"
                value={formData.vehicle_assigned}
                onChange={handleChange}
                placeholder="Toyota Corolla"
              />
            </div>
          </div>
          
          <div className="form-group">
            <label htmlFor="driver-status">Status</label>
            <select id="driver-status" name="status" value={formData.status} onChange={handleChange}>
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
