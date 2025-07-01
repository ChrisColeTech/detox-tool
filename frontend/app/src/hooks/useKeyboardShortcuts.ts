import { useEffect, useCallback } from 'react'
import { usePlatform } from './usePlatform'

interface KeyboardShortcuts {
  onOpenSearch: () => void
}

export const useKeyboardShortcuts = ({ onOpenSearch }: KeyboardShortcuts) => {
  const platformService = usePlatform()

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    // Check for search shortcut: Ctrl+F (Windows/Linux) or Cmd+F (Mac)
    const isSearchShortcut = platformService.isMac() 
      ? event.metaKey && event.key === 'f'
      : event.ctrlKey && event.key === 'f'

    if (isSearchShortcut) {
      // Prevent browser's default search behavior
      event.preventDefault()
      event.stopPropagation()
      onOpenSearch()
      return
    }

    // Additional shortcuts can be added here in the future
  }, [onOpenSearch, platformService])

  useEffect(() => {
    // Add event listener
    document.addEventListener('keydown', handleKeyDown, true)
    
    // Cleanup
    return () => {
      document.removeEventListener('keydown', handleKeyDown, true)
    }
  }, [handleKeyDown])
}

export default useKeyboardShortcuts
