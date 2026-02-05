import { useState, useEffect } from 'react'
import './TermsList.css'

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

function TermsList({ password, onEdit, refreshKey }) {
  const [terms, setTerms] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchTerms()
  }, [refreshKey])

  const fetchTerms = async () => {
    try {
      const response = await fetch(`${API_BASE}/admin/terms`, {
        headers: { 'x-admin-password': password }
      })
      const data = await response.json()
      if (data.success) {
        setTerms(data.data)
      } else {
        setError('Failed to fetch terms')
      }
    } catch {
      setError('Connection error')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this policy?')) return
    
    try {
      const response = await fetch(`${API_BASE}/admin/terms/${id}`, {
        method: 'DELETE',
        headers: { 'x-admin-password': password }
      })
      const data = await response.json()
      if (data.success) {
        setTerms(terms.filter(t => t.id !== id))
      } else {
        alert('Failed to delete term')
      }
    } catch {
      alert('Connection error')
    }
  }

  if (loading) {
    return <div className="loading">Loading terms...</div>
  }

  if (error) {
    return <div className="error-message">{error}</div>
  }

  return (
    <div className="terms-list">
      {terms.length === 0 ? (
        <div className="empty-state">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#ccc" strokeWidth="1.5">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
            <polyline points="14 2 14 8 20 8"/>
          </svg>
          <p>No terms & policies added yet</p>
        </div>
      ) : (
        <div className="terms-grid">
          {terms.map(term => (
            <div key={term.id} className="term-card">
              <div className="term-header">
                <h3>{term.title}</h3>
                <div className="term-actions">
                  <button className="btn-edit" onClick={() => onEdit(term)}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                    </svg>
                  </button>
                  <button className="btn-delete" onClick={() => handleDelete(term.id)}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="3 6 5 6 21 6"/>
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                    </svg>
                  </button>
                </div>
              </div>
              <div className="term-content">
                {term.content.split('\n').map((line, idx) => (
                  <p key={idx}>{line}</p>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default TermsList
