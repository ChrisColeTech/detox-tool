import { useState, useEffect, useCallback } from 'react'
import { useToast } from '@/hooks/useToast'
import { getAppService } from '@/services/appService'

/**
 * Custom hook for managing Welcome page state and interactions
 * Follows architecture guide principles:
 * - Single responsibility: Welcome page state management
 * - Clean separation from UI logic
 * - Reusable interaction handlers
 */
export const useWelcomeState = () => {
  const toast = useToast()
  const appService = getAppService()
  
  // State for keyboard navigation
  const [focusedCardIndex, setFocusedCardIndex] = useState<number | null>(null)
  
  // Announcement for screen readers
  const [announcement, setAnnouncement] = useState('')

  const handleOpenTab = useCallback((tabId: string, tabName: string) => {
    try {
      if (!appService) {
        const errorMessage = 'App service not available. Please refresh the page.'
        toast.error('Application Error', errorMessage)
        setAnnouncement(`Error: ${errorMessage}`)
        return
      }
      
      const success = appService.openTab(tabId)
      if (!success) {
        const errorMessage = `Could not open ${tabName}. Please try again.`
        toast.error('Failed to open tab', errorMessage)
        setAnnouncement(`Error: ${errorMessage}`)
      } else {
        setAnnouncement(`Opening ${tabName}`)
      }
    } catch (error) {
      console.error('Error opening tab:', error)
      const errorMessage = `Failed to open ${tabName} due to an unexpected error.`
      toast.error('Unexpected Error', errorMessage)
      setAnnouncement(`Error: ${errorMessage}`)
    }
  }, [appService, toast])

  // Keyboard navigation handler
  const handleKeyDown = useCallback((event: React.KeyboardEvent) => {
    if (event.key === 'Escape') {
      setFocusedCardIndex(null)
    }
  }, [])

  // Focus management
  const handleFocus = useCallback((index: number) => {
    setFocusedCardIndex(index)
  }, [])

  const handleBlur = useCallback(() => {
    setFocusedCardIndex(null)
  }, [])

  // Clear announcements after they're read
  useEffect(() => {
    if (announcement) {
      const timer = setTimeout(() => setAnnouncement(''), 3000)
      return () => clearTimeout(timer)
    }
  }, [announcement])

  return {
    focusedCardIndex,
    announcement,
    handleOpenTab,
    handleKeyDown,
    handleFocus,
    handleBlur,
  }
}
