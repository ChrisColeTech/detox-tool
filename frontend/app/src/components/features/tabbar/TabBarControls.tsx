import React from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface TabBarControlsProps {
  canScrollLeft: boolean
  canScrollRight: boolean
  onScrollLeft: () => void
  onScrollRight: () => void
}

/**
 * Component for tab bar scroll controls
 * Follows architecture guide principles:
 * - Single responsibility: Scroll control buttons
 * - Under 150 lines
 * - Clean props interface
 * - No business logic
 */
const TabBarControls: React.FC<TabBarControlsProps> = ({
  canScrollLeft,
  canScrollRight,
  onScrollLeft,
  onScrollRight,
}) => {
  if (!canScrollLeft && !canScrollRight) {
    return null
  }

  return (
    <>
      {/* Left scroll button */}
      {canScrollLeft && (
        <button
          onClick={onScrollLeft}
          className="flex-shrink-0 w-8 h-full flex items-center justify-center bg-surface-hover hover:bg-surface text-text-muted hover:text-text app-border-r transition-colors"
          aria-label="Scroll tabs left"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
      )}
      
      {/* Right scroll button */}
      {canScrollRight && (
        <button
          onClick={onScrollRight}
          className="flex-shrink-0 w-8 h-full flex items-center justify-center bg-surface-hover hover:bg-surface text-text-muted hover:text-text app-border-l transition-colors"
          aria-label="Scroll tabs right"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      )}
    </>
  )
}

export default TabBarControls
