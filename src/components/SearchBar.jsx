import { useState } from 'react'
import { useLanguage } from '../context/LanguageContext'
import './SearchBar.css'

function SearchBar({ onSearch }) {
  const { t } = useLanguage()
  const [query, setQuery] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (onSearch) onSearch(query)
    // Scroll to cars section
    document.getElementById('cars')?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleChange = (e) => {
    const value = e.target.value
    setQuery(value)
    if (onSearch) onSearch(value)
  }

  const handleClear = () => {
    setQuery('')
    if (onSearch) onSearch('')
  }

  return (
    <form className="search-bar" onSubmit={handleSubmit}>
      <div className="search-input-wrapper">
        <svg className="search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="11" cy="11" r="8"/>
          <path d="m21 21-4.35-4.35"/>
        </svg>
        <input
          type="text"
          placeholder={t.searchPlaceholder}
          value={query}
          onChange={handleChange}
        />
        {query && (
          <button type="button" className="clear-btn" onClick={handleClear}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12"/>
            </svg>
          </button>
        )}
      </div>
      <button type="submit" className="search-btn">
        {t.search}
      </button>
    </form>
  )
}

export default SearchBar
