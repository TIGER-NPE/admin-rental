import { useState, useEffect } from 'react'
import './CarList.css'

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

// Helper to format image URLs for local paths
const formatImageUrl = (url) => {
  if (!url) return '/favicon.ico'
  if (url.startsWith('/')) {
    return url
  }
  return url
}

// Get images array from car data
const getCarImages = (car) => {
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

function CarList({ password, onEdit, refreshKey }) {
  const [cars, setCars] = useState([])
  const [loading, setLoading] = useState(true)
  const [currentSlide, setCurrentSlide] = useState({})

  useEffect(() => {
    fetchCars()
  }, [password, refreshKey])

  const fetchCars = async () => {
    try {
      const response = await fetch(`${API_BASE}/admin/cars`, {
        headers: { 'x-admin-password': password }
      })
      const data = await response.json()
      if (data.success) {
        setCars(data.data)
        // Initialize current slide for each car
        const slides = {}
        data.data.forEach(car => {
          slides[car.id] = 0
        })
        setCurrentSlide(slides)
      }
    } catch (error) {
      console.error('Error fetching cars:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this car?')) return
    
    try {
      const response = await fetch(`${API_BASE}/admin/cars/${id}`, {
        method: 'DELETE',
        headers: { 'x-admin-password': password }
      })
      const data = await response.json()
      if (data.success) {
        setCars(cars.filter(car => car.id !== id))
      } else {
        alert(data.message || 'Failed to delete car')
      }
    } catch (error) {
      alert('Error deleting car')
    }
  }

  const nextSlide = (carId, imagesLength) => {
    if (imagesLength > 1) {
      setCurrentSlide(prev => ({
        ...prev,
        [carId]: (prev[carId] + 1) % imagesLength
      }))
    }
  }

  const prevSlide = (carId, imagesLength) => {
    if (imagesLength > 1) {
      setCurrentSlide(prev => ({
        ...prev,
        [carId]: (prev[carId] - 1 + imagesLength) % imagesLength
      }))
    }
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-RW', {
      style: 'currency',
      currency: 'RWF',
      minimumFractionDigits: 0
    }).format(price)
  }

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <p>Loading cars...</p>
      </div>
    )
  }

  if (cars.length === 0) {
    return (
      <div className="no-cars">
        <p>No cars found. Add your first car!</p>
      </div>
    )
  }

  return (
    <div className="cars-table-container">
      <table className="cars-table">
        <thead>
          <tr>
            <th>Images</th>
            <th>Name</th>
            <th>Model</th>
            <th>Year</th>
            <th>Price/Day</th>
            <th>WhatsApp</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {cars.map(car => {
            const images = getCarImages(car)
            const slide = currentSlide[car.id] || 0
            
            return (
              <tr key={car.id}>
                <td>
                  <div className="car-images-cell">
                    {images.length > 0 ? (
                      <div className="car-image-slider">
                        <img 
                          src={formatImageUrl(images[slide])} 
                          alt={car.name}
                          className="car-thumb"
                        />
                        {images.length > 1 && (
                          <>
                            <button 
                              className="slide-btn prev"
                              onClick={() => prevSlide(car.id, images.length)}
                            >
                              &#10094;
                            </button>
                            <button 
                              className="slide-btn next"
                              onClick={() => nextSlide(car.id, images.length)}
                            >
                              &#10095;
                            </button>
                            <div className="slide-indicator">
                              {slide + 1}/{images.length}
                            </div>
                          </>
                        )}
                      </div>
                    ) : (
                      <div className="no-image">No image</div>
                    )}
                  </div>
                </td>
                <td>{car.name}</td>
                <td>{car.model}</td>
                <td>{car.year}</td>
                <td>{formatPrice(car.price_per_day)}</td>
                <td>{car.whatsapp_number}</td>
                <td>
                  <span className={`status-badge ${car.available ? 'available' : 'unavailable'}`}>
                    {car.available ? 'Available' : 'Unavailable'}
                  </span>
                </td>
                <td>
                  <div className="action-btns">
                    <button className="btn-edit" onClick={() => onEdit(car)}>Edit</button>
                    <button className="btn-delete" onClick={() => handleDelete(car.id)}>Delete</button>
                  </div>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

export default CarList
