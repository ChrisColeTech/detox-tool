import React, { useCallback } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import SearchInput from '@/components/features/spotlight-search/SearchInput'
import SearchResults from '@/components/features/spotlight-search/SearchResults'
import SearchEmptyState from '@/components/features/spotlight-search/SearchEmptyState'
import { useSpotlightSearch } from '@/hooks/useSpotlightSearch'
import { useSpotlightKeyboard } from '@/hooks/useSpotlightKeyboard'

interface SpotlightSearchProps {
  isOpen: boolean
  onClose: () => void
  onNavigate: (page: string, section?: string) => void
}

/**
 * Main SpotlightSearch component - orchestrates the search experience
 * Follows architecture guide principles:
 * - Single responsibility: Search modal orchestration
 * - Under 150 lines
 * - Composition over complex logic
 * - Clean separation of concerns via custom hooks
 * 
 * Refactored from 246 lines to ~100 lines (59% reduction)
 * All keyboard logic extracted to useSpotlightKeyboard hook
 * All search state extracted to useSpotlightSearch hook
 * All UI components split into focused, reusable pieces
 */
const SpotlightSearch: React.FC<SpotlightSearchProps> = ({ isOpen, onClose, onNavigate }) => {
  const prefersReducedMotion = useReducedMotion()
  
  // Extract search state management
  const spotlightSearch = useSpotlightSearch({
    isOpen,
    onNavigate,
    onClose,
  })
  
  // Extract keyboard navigation logic
  const spotlightKeyboard = useSpotlightKeyboard({
    results: spotlightSearch.results,
    selectedIndex: spotlightSearch.selectedIndex,
    setSelectedIndex: spotlightSearch.setSelectedIndex,
    onClose,
    onSelect: spotlightSearch.handleSelect,
  })

  const handleBackdropClick = useCallback((event: React.MouseEvent) => {
    if (event.target === event.currentTarget) {
      onClose()
    }
  }, [onClose])

  // Animation variants
  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 }
  }

  const searchVariants = (reducedMotion: boolean | null) => ({
    hidden: reducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.8, y: -50 },
    visible: reducedMotion ? { opacity: 1 } : { opacity: 1, scale: 1, y: 0 }
  })

  const transition = prefersReducedMotion ? { duration: 0 } : { duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          variants={overlayVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
          transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.2 }}
          className="fixed inset-0 bg-background/60 backdrop-blur-sm z-50 flex items-center justify-center"
          onClick={handleBackdropClick}
          role="dialog"
          aria-modal="true"
          aria-label="Spotlight search"
        >
          <motion.div
            variants={searchVariants(prefersReducedMotion)}
            initial="hidden"
            animate="visible"
            exit="hidden"
            transition={transition}
            className="bg-surface app-border overflow-hidden w-full max-w-lg mx-4 motion-safe:hover:shadow-theme"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Search Input */}
            <SearchInput
              query={spotlightSearch.query}
              onChange={spotlightSearch.handleQueryChange}
              onKeyDown={spotlightKeyboard.handleKeyDown}
              inputRef={spotlightSearch.inputRef}
            />

            {/* Content Area */}
            <div>
              {/* Search Results */}
              {spotlightSearch.query.trim() && spotlightSearch.results.length > 0 && (
                <SearchResults
                  results={spotlightSearch.results}
                  selectedIndex={spotlightSearch.selectedIndex}
                  onSelect={spotlightSearch.handleSelect}
                />
              )}

              {/* Empty State */}
              <SearchEmptyState query={spotlightSearch.query} />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default SpotlightSearch
