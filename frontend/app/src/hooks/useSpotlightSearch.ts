import { useState, useEffect, useCallback, useRef } from 'react'
import { searchResults, type SearchResult } from '@/data/searchData'

interface UseSpotlightSearchParams {
  isOpen: boolean
  onNavigate: (page: string, section?: string) => void
  onClose: () => void
}

/**
 * Custom hook for managing spotlight search state and operations
 * Follows architecture guide principles:
 * - Single responsibility: Search state management
 * - Clean separation from UI logic
 * - Reusable search functionality
 */
export const useSpotlightSearch = ({
  isOpen,
  onNavigate,
  onClose,
}: UseSpotlightSearchParams) => {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [selectedIndex, setSelectedIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)

  // Clear state when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setQuery('')
      setResults([])
      setSelectedIndex(0)
      // Focus input after animation
      setTimeout(() => inputRef.current?.focus(), 150)
    }
  }, [isOpen])

  // Handle search query changes
  useEffect(() => {
    if (query.trim()) {
      const searchResultsData = searchResults(query, 6) // Limit to 6 results for compact view
      setResults(searchResultsData)
      setSelectedIndex(0)
    } else {
      setResults([])
      setSelectedIndex(0)
    }
  }, [query])

  // Handle result selection
  const handleSelect = useCallback((result: SearchResult) => {
    onNavigate(result.page, result.section)
    onClose()
  }, [onNavigate, onClose])

  // Handle query changes
  const handleQueryChange = useCallback((newQuery: string) => {
    setQuery(newQuery)
  }, [])

  return {
    // State
    query,
    results,
    selectedIndex,
    inputRef,

    // Actions
    setSelectedIndex,
    handleSelect,
    handleQueryChange,
  }
}
