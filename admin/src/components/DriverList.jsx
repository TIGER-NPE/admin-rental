import { useState, useEffect } from 'react'
import './DriverList.css'

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

// Helper to format photo URLs for local paths
const formatPhotoUrl = (url) => {
  if (!url) return null
  if (url.startsWith('/')) {
    return `${API_BASE.replace('/api', '')}${url}`
  }
  return url
}

function DriverList({ password, onEdit, refreshKey }) {
  const [drivers, setDrivers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchDrivers()
  }, [refreshKey])

  const fetchDrivers = async () => {
    try {
      const response = await fetch(`${API_BASE}/admin/drivers`, {
        headers: { 'x-admin-password': password }
      })
      const data = await response.json()
      if (data.success) {
        setDrivers(data.data)
      } else {
        setError('Failed to fetch drivers')
      }
    } catch {
      setError('Connection error')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this driver?')) return
    
    try {
      const response = await fetch(`${API_BASE}/admin/drivers/${id}`, {
        method: 'DELETE',
        headers: { 'x-admin-password': password }
      })
      const data = await response.json()
      if (data.success) {
        setDrivers(drivers.filter(d => d.id !== id))
      } else {
        alert('Failed to delete driver')
      }
    } catch {
      alert('Connection error')
    }
  }

  const getStatusClass = (status) => {
    switch (status) {
      case 'available': return 'status-available'
      case 'busy': return 'status-busy'
      case 'offline': return 'status-offline'
      default: return ''
    }
  }

  if (loading) {
    return <div className="loading">Loading drivers...</div>
  }

  if (error) {
    return <div className="error-message">{error}</div>
  }

  return (
    <div className="driver-list">
      {drivers.length === 0 ? (
        <div className="empty-state">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#ccc" strokeWidth="1.5">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
            <circle cx="12" cy="7" r="4"/>
          </svg>
          <p>No drivers added yet</p>
        </div>
      ) : (
        <table className="data-table">
          <thead>
            <tr>
              <th>Photo</th>
              <th>Name</th>
              <th>Phone</th>
              <th>Email</th>
              <th>License #</th>
              <th>Vehicle</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {drivers.map(driver => (
              <tr key={driver.id}>
                <td>
                  <div className="driver-cell">
                    {driver.photo_url ? (
                      <img src={formatPhotoUrl(driver.photo_url)} alt={driver.name} className="driver-photo" />
                    ) : (
                      <div className="driver-photo-placeholder">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                          <circle cx="12" cy="7" r="4"/>
                        </svg>
                      </div>
                    )}
                  </div>
                </td>
                <td>{driver.name}</td>
                <td>{driver.phone}</td>
                <td>{driver.email || '-'}</td>
                <td>{driver.license_number || '-'}</td>
                <td>{driver.vehicle_assigned || '-'}</td>
                <td>
                  <span className={`status-badge ${getStatusClass(driver.status)}`}>
                    {driver.status}
                  </span>
                </td>
                <td className="actions">
                  <button className="btn-edit" onClick={() => onEdit(driver)}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                    </svg>
                  </button>
                  <button className="btn-delete" onClick={() => handleDelete(driver.id)}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="3 6 5 6 21 6"/>
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                    </svg>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}

export default DriverList
