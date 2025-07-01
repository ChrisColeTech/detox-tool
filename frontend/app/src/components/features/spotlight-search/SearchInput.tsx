import React from 'react'
import { Search } from 'lucide-react'

interface SearchInputProps {
  query: string
  onChange: (query: string) => void
  onKeyDown: (event: React.KeyboardEvent) => void
  inputRef: React.RefObject<HTMLInputElement | null>
  placeholder?: string
}

/**
 * Component for spotlight search input field
 * Follows architecture guide principles:
 * - Single responsibility: Search input handling
 * - Under 150 lines
 * - Clean props interface
 * - No business logic
 */
const SearchInput: React.FC<SearchInputProps> = ({
  query,
  onChange,
  onKeyDown,
  inputRef,
  placeholder = "Search Task Writer...",
}) => {
  return (
    <div className="bg-gradient-to-r from-surface to-background px-6 py-4 app-border-b">
      <div className="flex items-center gap-3">
        <div className="page-icon" role="img" aria-label="Search icon">
          <Search className="w-5 h-5 text-accent" aria-hidden="true" />
        </div>
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder={placeholder}
          className="flex-1 bg-surface text-text placeholder-text-muted app-border rounded-md px-3 py-2 text-base font-medium focus:outline-none focus:ring-0 focus-visible:outline-none focus:app-border-accent"
          style={{ boxShadow: 'none !important' }}
          aria-label="Search application features"
          autoComplete="off"
          spellCheck="false"
        />
      </div>
    </div>
  )
}

export default SearchInput
