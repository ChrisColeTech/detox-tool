import { useState, useEffect, useCallback } from 'react'
import type { Tab } from '../types/tab' // Using the Tab type from types folder

const STORAGE_KEY_PREFIX = 'app' // App-specific prefix
const TABS_STORAGE_KEY = `${STORAGE_KEY_PREFIX}-tabs`

// Helper to strip non-serializable parts (like icons) for storage
const sanitizeTabsForStorage = (tabs: Tab[]): Omit<Tab, 'icon'>[] => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  return tabs.map(({ icon, ...rest }) => rest)
}

export const useTabs = () => {
  const [tabs, setTabs] = useState<Tab[]>([])
  const [activeTabId, setActiveTabId] = useState<string | null>(null)
  const [isTabsLoaded, setIsTabsLoaded] = useState(false)

  // Load tabs from localStorage on initial mount
  useEffect(() => {
    try {
      const storedTabsData = localStorage.getItem(TABS_STORAGE_KEY)
      if (storedTabsData) {
        const { tabs: storedSanitizedTabs, activeTabId: storedActiveTabId } = JSON.parse(
          storedTabsData,
        ) as { tabs: Omit<Tab, 'icon'>[]; activeTabId: string | null }

        // Restore tabs without icons; icons will be added by Layout/navigationConfig
        const restoredTabs = storedSanitizedTabs.map((tab) => ({
          ...tab,
          icon: undefined, // Icons are not stored
          closable: tab.closable ?? true, // Ensure closable property is set for restored tabs
        }))

        setTabs(restoredTabs)
        setActiveTabId(storedActiveTabId)
      }
    } catch (error) {
      console.error('useTabs: Failed to load tabs from localStorage, initializing empty.', error)
      setTabs([])
      setActiveTabId(null)
    } finally {
      setIsTabsLoaded(true)
    }
  }, [])

  // Save tabs to localStorage whenever they change (and after initial load)
  useEffect(() => {
    if (isTabsLoaded) {
      try {
        if (tabs.length > 0 || activeTabId !== null) {
          const dataToStore = {
            tabs: sanitizeTabsForStorage(tabs),
            activeTabId,
          }
          localStorage.setItem(TABS_STORAGE_KEY, JSON.stringify(dataToStore))
        } else {
          localStorage.removeItem(TABS_STORAGE_KEY) // Clean up if no tabs
        }
      } catch (error) {
        console.error('useTabs: Failed to save tabs to localStorage.', error)
      }
    }
  }, [tabs, activeTabId, isTabsLoaded])

  const addTab = useCallback(
    (newTabInfo: Omit<Tab, 'isActive' | 'icon'> & { icon?: React.ReactNode }) => {
      setTabs((prevTabs) => {
        const existingTab = prevTabs.find((t) => t.id === newTabInfo.id)
        if (existingTab) {
          // If tab exists, just make it active
          setActiveTabId(existingTab.id)
          return prevTabs.map((t) => ({ ...t, isActive: t.id === existingTab.id }))
        }
        // Add new tab and make it active
        const fullNewTab: Tab = {
          ...newTabInfo,
          isActive: true,
          closable: newTabInfo.closable ?? true, // Ensure closable property is set
        }
        setActiveTabId(fullNewTab.id)
        return [...prevTabs.map((t) => ({ ...t, isActive: false })), fullNewTab]
      })
    },
    [],
  )

  const removeTab = useCallback(
    (tabIdToRemove: string) => {
      setTabs((prevTabs) => {
        // Check if tab exists in the current state
        const tabExists = prevTabs.some(t => t.id === tabIdToRemove)
        
        if (!tabExists) {
          return prevTabs // Tab doesn't exist, no change needed
        }

        // Find the currently active tab from the prevTabs array
        const currentActiveTab = prevTabs.find(t => t.isActive)
        const currentActiveTabId = currentActiveTab?.id || null
        
        const isRemovingActiveTab = currentActiveTabId === tabIdToRemove
        const newTabs = prevTabs.filter((t) => t.id !== tabIdToRemove)
        
        // Calculate new active tab if we're removing the active one
        if (isRemovingActiveTab && newTabs.length > 0) {
          // Find the index of the tab being removed in the original array
          const removedTabIndex = prevTabs.findIndex(t => t.id === tabIdToRemove)
          
          let newActiveTabId: string | null = null
          
          // Try to activate the tab to the right (same index after removal)
          if (removedTabIndex < newTabs.length) {
            newActiveTabId = newTabs[removedTabIndex].id
          }
          // If no tab to the right, activate the tab to the left (previous index)
          else if (removedTabIndex > 0) {
            newActiveTabId = newTabs[removedTabIndex - 1].id
          }
          // Fallback to first tab
          else {
            newActiveTabId = newTabs[0].id
          }
          
          // Update activeTabId state
          setActiveTabId(newActiveTabId)
          
          // Return new tabs with correct isActive state
          return newTabs.map((t) => ({ ...t, isActive: t.id === newActiveTabId }))
        } else if (isRemovingActiveTab && newTabs.length === 0) {
          setActiveTabId(null)
          return newTabs
        } else {
          // Just remove the tab, keep the same active tab
          return newTabs.map((t) => ({ ...t, isActive: t.id === currentActiveTabId }))
        }
      })
    },
    [],
  )

  const setActiveTab = useCallback((tabIdToActivate: string) => {
    setTabs((prevTabs) => prevTabs.map((t) => ({ ...t, isActive: t.id === tabIdToActivate })))
    setActiveTabId(tabIdToActivate)
  }, [])

  const reorderTabs = useCallback((newOrderedTabs: Tab[]) => {
    // Assumes newOrderedTabs contains all current tabs, just in a new order.
    // The activeTabId should remain the same unless explicitly changed.
    // The isActive property within newOrderedTabs should reflect the current active tab.
    setTabs(newOrderedTabs)
  }, [])

  return {
    tabs,
    activeTabId,
    addTab,
    removeTab,
    setActiveTab,
    reorderTabs,
    isTabsLoaded, // Expose loading state if needed
  }
}

