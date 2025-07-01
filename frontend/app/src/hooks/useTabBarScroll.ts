import { useState, useRef, useEffect, useCallback } from 'react'

/**
 * Custom hook for managing TabBar horizontal scrolling
 * Follows architecture guide principles:
 * - Single responsibility: Scroll state management
 * - Clean separation from UI logic
 * - Reusable scroll functionality
 */
export const useTabBarScroll = () => {
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(false)
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  // Check scroll position and update button states
  const updateScrollButtons = useCallback(() => {
    const container = scrollContainerRef.current
    if (!container) return

    const { scrollLeft, scrollWidth, clientWidth } = container
    
    setCanScrollLeft(scrollLeft > 0)
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1) // -1 for rounding
  }, [])

  // Scroll functions
  const scrollLeft = useCallback(() => {
    const container = scrollContainerRef.current
    if (!container) return

    const scrollAmount = container.clientWidth * 0.8 // Scroll 80% of visible width
    container.scrollBy({
      left: -scrollAmount,
      behavior: 'smooth'
    })
  }, [])

  const scrollRight = useCallback(() => {
    const container = scrollContainerRef.current
    if (!container) return

    const scrollAmount = container.clientWidth * 0.8 // Scroll 80% of visible width
    container.scrollBy({
      left: scrollAmount,
      behavior: 'smooth'
    })
  }, [])

  // Update scroll buttons when container size or content changes
  useEffect(() => {
    const container = scrollContainerRef.current
    if (!container) return

    // Initial check
    updateScrollButtons()

    // Listen for scroll events
    container.addEventListener('scroll', updateScrollButtons)
    
    // Listen for resize events
    const resizeObserver = new ResizeObserver(updateScrollButtons)
    resizeObserver.observe(container)

    return () => {
      container.removeEventListener('scroll', updateScrollButtons)
      resizeObserver.disconnect()
    }
  }, [updateScrollButtons])

  return {
    // Refs
    scrollContainerRef,
    
    // State
    canScrollLeft,
    canScrollRight,
    
    // Actions
    scrollLeft,
    scrollRight,
    updateScrollButtons,
  }
}
