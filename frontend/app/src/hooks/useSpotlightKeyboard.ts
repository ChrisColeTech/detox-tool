import { useCallback } from 'react'
import type { SearchResult } from '@/data/searchData'

interface UseSpotlightKeyboardParams {
  results: SearchResult[]
  selectedIndex: number
  setSelectedIndex: (index: number) => void
  onClose: () => void
  onSelect: (result: SearchResult) => void
}

/**
 * Custom hook for managing spotlight search keyboard navigation
 * Follows architecture guide principles:
 * - Single responsibility: Keyboard interaction logic
 * - Clean separation from UI logic
 * - Reusable across search components
 */
export const useSpotlightKeyboard = ({
  results,
  selectedIndex,
  setSelectedIndex,
  onClose,
  onSelect,
}: UseSpotlightKeyboardParams) => {

  const handleKeyDown = useCallback((event: React.KeyboardEvent) => {
    switch (event.key) {
      case 'Escape':
        event.preventDefault()
        onClose()
        break
        
      case 'ArrowDown':
        event.preventDefault()
        if (results.length > 0) {
          setSelectedIndex((selectedIndex + 1) % results.length)
        }
        break
        
      case 'ArrowUp':
        event.preventDefault()
        if (results.length > 0) {
          setSelectedIndex(selectedIndex === 0 ? results.length - 1 : selectedIndex - 1)
        }
        break
        
      case 'Enter':
        event.preventDefault()
        if (results.length > 0 && selectedIndex < results.length) {
          onSelect(results[selectedIndex])
        }
        break
        
      case 'Home':
        event.preventDefault()
        if (results.length > 0) {
          setSelectedIndex(0)
        }
        break
        
      case 'End':
        event.preventDefault()
        if (results.length > 0) {
          setSelectedIndex(results.length - 1)
        }
        break
    }
  }, [results, selectedIndex, setSelectedIndex, onClose, onSelect])

  return {
    handleKeyDown,
  }
}

export default useSpotlightKeyboard
