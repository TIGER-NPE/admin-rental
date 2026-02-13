import { useState, useEffect } from 'react'
import './App.css'
import CarForm from './components/CarForm'
import CarList from './components/CarList'
import DriverList from './components/DriverList'
import DriverForm from './components/DriverForm'
import TermsList from './components/TermsList'
import TermsForm from './components/TermsForm'

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editingCar, setEditingCar] = useState(null)
  const [refreshKey, setRefreshKey] = useState(0)
  const [activeTab, setActiveTab] = useState('cars')
  
  // Driver state
  const [editingDriver, setEditingDriver] = useState(null)
  
  // Terms state
  const [editingTerm, setEditingTerm] = useState(null)

  const handleLogin = async (e) => {
    e.preventDefault()
    try {
      const response = await fetch(`${API_BASE}/admin/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      })
      const data = await response.json()
      if (data.success) {
        setIsAuthenticated(true)
        localStorage.setItem('adminToken', password)
        setError('')
      } else {
        setError('Invalid password')
      }
    } catch (err) {
      setError('Connection error - make sure the API server is running')
    }
  }

  const handleLogout = () => {
    setIsAuthenticated(false)
    setPassword('')
    localStorage.removeItem('adminToken')
  }

  // Car handlers
  const handleEdit = (car) => {
    setEditingCar(car)
    setShowForm(true)
  }

  const handleNewCar = () => {
    setEditingCar(null)
    setShowForm(true)
  }

  const handleFormClose = () => {
    setShowForm(false)
    setEditingCar(null)
  }

  const handleFormSubmit = () => {
    setRefreshKey(prev => prev + 1)
    handleFormClose()
  }

  // Driver handlers
  const handleNewDriver = () => {
    setEditingDriver(null)
    setShowForm(true)
  }

  const handleEditDriver = (driver) => {
    setEditingDriver(driver)
    setShowForm(true)
  }

  const handleDriverFormClose = () => {
    setShowForm(false)
    setEditingDriver(null)
  }

  const handleDriverFormSubmit = () => {
    setRefreshKey(prev => prev + 1)
    handleDriverFormClose()
  }

  // Terms handlers
  const handleNewTerm = () => {
    setEditingTerm(null)
    setShowForm(true)
  }

  const handleEditTerm = (term) => {
    setEditingTerm(term)
    setShowForm(true)
  }

  const handleTermFormClose = () => {
    setShowForm(false)
    setEditingTerm(null)
  }

  const handleTermFormSubmit = () => {
    setRefreshKey(prev => prev + 1)
    handleTermFormClose()
  }

  useEffect(() => {
    const token = localStorage.getItem('adminToken')
    if (token) {
      setPassword(token)
      verifyToken(token)
    }
  }, [])

  const verifyToken = async (token) => {
    try {
      const response = await fetch(`${API_BASE}/admin/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: token })
      })
      const data = await response.json()
      if (data.success) {
        setIsAuthenticated(true)
      }
    } catch (err) {
      console.error('Token verification failed')
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="login-page">
        <div className="login-card">
          <div className="login-header">
            <img src="../log.png" alt="" className="logo-image" />
            <h1>RentACar Admin</h1>
            <p>Manage your car rental platform</p>
          </div>
          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter admin password"
              />
            </div>
            {error && <p className="error">{error}</p>}
            <button type="submit" className="btn btn-full">Login</button>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className="admin-app">
      <header className="admin-header">
        <div className="header-content">
          <div className="logo">
            <img src="../log.png" alt="" className="logo-image" />
            <span className="logo-text">RentACar Admin</span>
          </div>
          <button className="btn-logout" onClick={handleLogout}>Logout</button>
        </div>
      </header>

      {/* Tab Navigation */}
      <nav className="admin-tabs">
        <button 
          className={`tab ${activeTab === 'cars' ? 'active' : ''}`}
          onClick={() => setActiveTab('cars')}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"/>
            <circle cx="7" cy="17" r="2"/>
            <circle cx="17" cy="17" r="2"/>
          </svg>
          Cars
        </button>
        <button 
          className={`tab ${activeTab === 'drivers' ? 'active' : ''}`}
          onClick={() => setActiveTab('drivers')}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
            <circle cx="12" cy="7" r="4"/>
          </svg>
          Drivers
        </button>
        <button 
          className={`tab ${activeTab === 'terms' ? 'active' : ''}`}
          onClick={() => setActiveTab('terms')}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
            <polyline points="14 2 14 8 20 8"/>
            <line x1="16" y1="13" x2="8" y2="13"/>
            <line x1="16" y1="17" x2="8" y2="17"/>
            <polyline points="10 9 9 9 8 9"/>
          </svg>
          Terms & Policies
        </button>
      </nav>

      <main className="admin-main">
        {activeTab === 'cars' && (
          <>
            <div className="page-header">
              <h1>Manage Cars</h1>
              <button className="btn-add" onClick={handleNewCar}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 5v14M5 12h14"/>
                </svg>
                Add New Car
              </button>
            </div>

            <CarList 
              password={password} 
              onEdit={handleEdit} 
              refreshKey={refreshKey}
            />
          </>
        )}

        {activeTab === 'drivers' && (
          <>
            <div className="page-header">
              <h1>Manage Drivers</h1>
              <button className="btn-add" onClick={handleNewDriver}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 5v14M5 12h14"/>
                </svg>
                Add New Driver
              </button>
            </div>

            <DriverList 
              password={password} 
              onEdit={handleEditDriver} 
              refreshKey={refreshKey}
            />
          </>
        )}

        {activeTab === 'terms' && (
          <>
            <div className="page-header">
              <h1>Manage Terms & Policies</h1>
              <button className="btn-add" onClick={handleNewTerm}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 5v14M5 12h14"/>
                </svg>
                Add New Policy
              </button>
            </div>

            <TermsList 
              password={password} 
              onEdit={handleEditTerm} 
              refreshKey={refreshKey}
            />
          </>
        )}
      </main>

      {showForm && activeTab === 'cars' && (
        <CarForm 
          car={editingCar}
          password={password}
          onClose={handleFormClose}
          onSubmit={handleFormSubmit}
        />
      )}

      {showForm && activeTab === 'drivers' && (
        <DriverForm 
          driver={editingDriver}
          password={password}
          onClose={handleDriverFormClose}
          onSubmit={handleDriverFormSubmit}
        />
      )}

      {showForm && activeTab === 'terms' && (
        <TermsForm 
          term={editingTerm}
          password={password}
          onClose={handleTermFormClose}
          onSubmit={handleTermFormSubmit}
        />
      )}
    </div>
  )
}

export default App
