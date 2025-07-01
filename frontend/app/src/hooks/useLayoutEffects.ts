import { useEffect } from 'react'

interface UseLayoutEffectsParams {
  activeTabId: string | null
  activeTab: string
  updateSetting: (key: string, value: any) => void
  currentTabHasPanel: boolean
  isExpanded: boolean
}

/**
 * Custom hook for managing layout-specific side effects
 * Handles synchronization and auto-behaviors
 */
export const useLayoutEffects = ({
  activeTabId,
  activeTab,
  updateSetting,
  currentTabHasPanel,
  isExpanded,
}: UseLayoutEffectsParams) => {

  // Sync sidebar active tab with actual active tab
  useEffect(() => {
    if (activeTabId && activeTabId !== activeTab) {
      updateSetting('activeSidebarTab', activeTabId)
    }
    // Clear sidebar active tab when no tabs are open
    if (!activeTabId && activeTab) {
      updateSetting('activeSidebarTab', '')
    }
  }, [activeTabId, activeTab, updateSetting])

  // Auto-collapse panel when switching to a tab that doesn't have a panel or when no active tab
  useEffect(() => {
    if ((!currentTabHasPanel || !activeTabId) && isExpanded) {
      updateSetting('sidebarExpanded', false)
    }
  }, [activeTab, currentTabHasPanel, isExpanded, updateSetting, activeTabId])
}
