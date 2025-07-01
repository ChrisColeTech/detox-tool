import { useEffect, useCallback } from 'react'
import { initializeAppService, getAppService } from '@/services/appService'
import { getSearchService } from '@/services/searchService'
import type { Tab } from '@/types/tab'

interface UseLayoutServicesParams {
  addTab: (tab: Tab) => void
  removeTab: (tabId: string) => void
  setActiveTabInHook: (tabId: string) => void
  updateSetting: (key: string, value: any) => void
  success: (title: string, message?: string) => void
  reorderTabs: (newTabs: Tab[]) => void
}

/**
 * Custom hook for managing service initialization and coordination
 * Separates service logic from UI state management
 */
export const useLayoutServices = ({
  addTab,
  removeTab,
  setActiveTabInHook,
  updateSetting,
  success,
  reorderTabs,
}: UseLayoutServicesParams) => {

  // Initialize app service
  useEffect(() => {
    initializeAppService({
      onTabAdd: addTab,
      onTabRemove: removeTab,
      onTabActivate: setActiveTabInHook,
      onSidebarChange: (tabId: string) => updateSetting('activeSidebarTab', tabId),
    })
  }, [addTab, removeTab, setActiveTabInHook, updateSetting])

  // Show welcome notification on app launch
  useEffect(() => {
    const timer = setTimeout(() => {
      success('Welcome to Task Writer!', 'AI-powered development assistant ready to help')
    }, 1000) // Show after 1 second to let the app load

    return () => clearTimeout(timer)
  }, [success])

  // Service-delegated event handlers
  const handleTabChange = useCallback((tabId: string) => {
    const appService = getAppService()
    appService?.changeSidebarItem(tabId)
  }, [])

  const handleTabClick = useCallback((tabId: string) => {
    const appService = getAppService()
    appService?.handleTabClick(tabId)
  }, [])

  const handleTabClose = useCallback((tabId: string) => {
    const appService = getAppService()
    appService?.handleTabClose(tabId)
  }, [])

  const handleTabReorder = useCallback((newTabs: Tab[]) => {
    reorderTabs(newTabs)
  }, [reorderTabs])

  const handleSettingsClick = useCallback(() => {
    const appService = getAppService()
    appService?.openSettings()
  }, [])

  const handleSearchNavigate = useCallback((page: string, section?: string) => {
    const searchService = getSearchService()
    const navigationSuccess = searchService.navigateToResult(page, section)
    
    if (!navigationSuccess) {
      // Handle navigation failure - this shouldn't happen with our search data
      console.warn(`Failed to navigate to ${page}`)
    }
  }, [])

  return {
    handleTabChange,
    handleTabClick,
    handleTabClose,
    handleTabReorder,
    handleSettingsClick,
    handleSearchNavigate,
  }
}
