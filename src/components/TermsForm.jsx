import { useState, useEffect } from 'react'
import './TermsForm.css'

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

function TermsForm({ term, password, onClose, onSubmit }) {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    display_order: 0
  })

  useEffect(() => {
    if (term) {
      setFormData(term)
    }
  }, [term])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: name === 'display_order' ? parseInt(value) : value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    try {
      const url = term 
        ? `${API_BASE}/admin/terms/${term.id}`
        : `${API_BASE}/admin/terms`
      
      const method = term ? 'PUT' : 'POST'
      
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
        alert(data.message || 'Failed to save term')
      }
    } catch {
      alert('Connection error')
    }
  }

  return (
    <div className="form-overlay">
      <div className="form-modal">
        <div className="form-header">
          <h2>{term ? 'Edit Policy' : 'Add New Policy'}</h2>
          <button className="btn-close" onClick={onClose}>&times;</button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Title *</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              placeholder="e.g., 1. Eligibility"
            />
          </div>
          
          <div className="form-group">
            <label>Content *</label>
            <textarea
              name="content"
              value={formData.content}
              onChange={handleChange}
              required
              rows={6}
              placeholder="Enter the policy content. Use new lines for separate points."
            />
          </div>
          
          <div className="form-group">
            <label>Display Order</label>
            <input
              type="number"
              name="display_order"
              value={formData.display_order}
              onChange={handleChange}
              min="0"
              placeholder="0"
            />
          </div>
          
          <div className="form-actions">
            <button type="button" className="btn-cancel" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-submit">
              {term ? 'Update Policy' : 'Add Policy'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default TermsForm
