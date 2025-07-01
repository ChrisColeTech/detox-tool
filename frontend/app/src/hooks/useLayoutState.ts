import { useState, useCallback, useMemo } from 'react'
import { useSettings } from '@/hooks/useSettings'
import { useTabs } from '@/hooks/useTabs'
import { useToast } from '@/hooks/useToast'
import { getTabIcon, getPanelComponent } from '@/config/navigationConfig'
import type { Tab } from '@/types/tab'

/**
 * Custom hook for managing layout-specific state and derived values
 * Follows single responsibility principle by handling only layout state
 */
export const useLayoutState = () => {
  // Search modal state
  const [isSearchOpen, setIsSearchOpen] = useState(false)

  // External state hooks
  const {
    settings,
    updateSetting,
    toggleSidebarItemVisibility,
    isSidebarItemVisible,
    toggleSidebarItemPin,
  } = useSettings()
  
  const {
    tabs,
    activeTabId,
    addTab,
    removeTab,
    setActiveTab: setActiveTabInHook,
    reorderTabs,
  } = useTabs()
  
  const { toasts, dismissToast, success } = useToast()

  // Derived state values
  const activeTab = settings.activeSidebarTab
  const isExpanded = settings.sidebarExpanded
  
  // Check if current active tab has a panel
  const currentTabHasPanel = useMemo(
    () => activeTab ? !!getPanelComponent(activeTab) : false,
    [activeTab]
  )

  // Add icons to tabs since they can't be serialized to localStorage
  const tabsWithIcons: Tab[] = useMemo(() => 
    tabs.map((tab) => ({
      ...tab,
      icon: getTabIcon(tab.id),
      closable: tab.closable,
    }))
  , [tabs])

  // Generate CSS classes based on settings
  const cssClasses = useMemo(() => {
    const classes = ['h-screen', 'flex', 'flex-col', 'bg-background', 'text-text']

    // Color scheme class
    classes.push(`color-${settings.colorScheme}`)

    // Theme class
    if (settings.theme === 'dark') {
      classes.push('dark')
    }

    // High contrast class
    if (settings.highContrast) {
      classes.push('high-contrast')
    }

    // Font size class
    classes.push(`font-${settings.fontSize}`)

    // Icon size class
    classes.push(`icon-${settings.iconSize}`)

    // Border thickness class
    classes.push(`border-${settings.borderThickness}`)

    return classes.join(' ')
  }, [settings.theme, settings.highContrast, settings.fontSize, settings.iconSize, settings.borderThickness, settings.colorScheme])

  // Search handlers
  const handleOpenSearch = useCallback(() => {
    setIsSearchOpen(true)
  }, [])

  const handleCloseSearch = useCallback(() => {
    setIsSearchOpen(false)
  }, [])

  // Layout toggle handlers
  const handleToggleSidebarPosition = useCallback(() => {
    updateSetting('sidebarPosition', settings.sidebarPosition === 'left' ? 'right' : 'left')
  }, [updateSetting, settings.sidebarPosition])

  const handleToggleTheme = useCallback(() => {
    updateSetting('theme', settings.theme === 'dark' ? 'light' : 'dark')
  }, [updateSetting, settings.theme])

  const handleToggleExpanded = useCallback(() => {
    updateSetting('sidebarExpanded', !isExpanded)
  }, [updateSetting, isExpanded])

  return {
    // State values
    isSearchOpen,
    settings,
    activeTab,
    isExpanded,
    currentTabHasPanel,
    tabs,
    activeTabId,
    tabsWithIcons,
    toasts,
    cssClasses,

    // State setters and handlers
    handleOpenSearch,
    handleCloseSearch,
    handleToggleSidebarPosition,
    handleToggleTheme,
    handleToggleExpanded,
    updateSetting,
    toggleSidebarItemVisibility,
    isSidebarItemVisible,
    toggleSidebarItemPin,
    dismissToast,
    success,

    // Tab management
    addTab,
    removeTab,
    setActiveTabInHook,
    reorderTabs,
  }
}
