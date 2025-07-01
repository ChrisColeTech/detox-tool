import React from 'react'
import { Search } from 'lucide-react'

interface SearchEmptyStateProps {
  query: string
}

/**
 * Component for displaying empty state when no search results found
 * Follows architecture guide principles:
 * - Single responsibility: Empty state display
 * - Under 150 lines
 * - Clean props interface
 * - No business logic
 */
const SearchEmptyState: React.FC<SearchEmptyStateProps> = ({ query }) => {
  if (!query.trim()) {
    return null
  }

  return (
    <div className="p-6 text-center">
      <div className="page-icon mx-auto mb-3" role="img" aria-label="No results">
        <Search className="w-6 h-6 text-text-muted" aria-hidden="true" />
      </div>
      <p className="text-text-muted">No results found</p>
      <p className="text-sm text-text-muted mt-1">
        Try searching for features, pages, or settings
      </p>
    </div>
  )
}

export default SearchEmptyState
