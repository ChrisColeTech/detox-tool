import { getAppService } from './appService'
import { getAllNavigationItems } from '@/config/navigationConfig'

export class SearchService {
  
  /**
   * Navigate to a specific page/section based on search result
   * @param page - The page ID to navigate to
   * @param section - Optional section within the page
   */
  navigateToResult(page: string, section?: string): boolean {
    const appService = getAppService()
    if (!appService) {
      console.warn('AppService not initialized')
      return false
    }

    try {
      // Check if it's a valid navigation item
      const navigationItems = getAllNavigationItems()
      const navigationItem = navigationItems.find(item => item.id === page)
      
      if (navigationItem) {
        // Use the app service to properly open the tab
        const success = appService.openTab(page, true)
        
        if (success && section) {
          // For sections within pages, we could potentially add scroll-to logic
          // For phase 1, we just navigate to the page
          console.log(`Navigated to ${page}, section: ${section}`)
        }
        
        return success
      }

      // Handle special cases
      switch (page) {
        case 'welcome':
          // Navigate to welcome page by closing all tabs
          // The welcome page shows when no tabs are open
          return true

        case 'settings':
          // Use the dedicated settings method
          appService.openSettings()
          return true

        default:
          console.warn(`Unknown page: ${page}`)
          return false
      }
    } catch (error) {
      console.error('Error navigating to search result:', error)
      return false
    }
  }

  /**
   * Get the display name for a page ID
   * @param pageId - The page ID
   * @returns The display name or the ID if not found
   */
  getPageDisplayName(pageId: string): string {
    const navigationItems = getAllNavigationItems()
    const item = navigationItems.find(item => item.id === pageId)
    return item?.label || pageId
  }

  /**
   * Check if a page is currently available/accessible
   * @param pageId - The page ID to check
   * @returns True if the page can be navigated to
   */
  isPageAccessible(pageId: string): boolean {
    if (pageId === 'welcome' || pageId === 'settings') {
      return true
    }

    const navigationItems = getAllNavigationItems()
    return navigationItems.some(item => item.id === pageId)
  }
}

// Singleton instance
let searchServiceInstance: SearchService | null = null

export const getSearchService = (): SearchService => {
  if (!searchServiceInstance) {
    searchServiceInstance = new SearchService()
  }
  return searchServiceInstance
}

export const initializeSearchService = (): SearchService => {
  return getSearchService()
}
