import { useState, useEffect } from 'react'
import { getPlatformService } from '@/services/platformService'

export type ColorScheme = 
  | 'onyx' 
  | 'ocean-blue' 
  | 'forest-green' 
  | 'royal-purple' 
  | 'sunset-orange' 
  | 'cyberpunk' 
  | 'office' 
  | 'terminal' 
  | 'midnight-blue' 
  | 'crimson-red' 
  | 'warm-sepia' 
  | 'rose-gold'

export interface AppSettings {
  theme: 'dark' | 'light'                    // Mode dimension
  colorScheme: ColorScheme                   // NEW: Color scheme dimension  
  sidebarPosition: 'left' | 'right'
  showStatusBar: boolean
  fontSize: 'small' | 'medium' | 'large'
  iconSize: 'small' | 'medium' | 'large'
  highContrast: boolean
  borderThickness: 'none' | 'thin' | 'medium' | 'thick'
  sidebarExpanded: boolean
  activeSidebarTab: string // ID of the currently active/selected sidebar navigation item
  sidebarItemVisibility: Record<string, boolean> // Stores user overrides for sidebar item visibility
  pinnedSidebarItems: string[] // Stores IDs of sidebar items pinned by the user
  [key: string]: unknown // Allows for additional, untyped settings
}

const defaultSettings: AppSettings = {
  theme: 'dark',
  colorScheme: 'onyx',                      // NEW: Default to onyx scheme for backward compatibility
  sidebarPosition: 'left',
  showStatusBar: true,
  fontSize: 'small',
  iconSize: 'small',
  highContrast: false,
  borderThickness: 'medium',
  sidebarExpanded: true,
  activeSidebarTab: '',
  sidebarItemVisibility: {},
  pinnedSidebarItems: [],
}

export const useSettings = () => {
  const [settings, setSettings] = useState<AppSettings>(defaultSettings)
  const [isLoaded, setIsLoaded] = useState(false)
  const platformService = getPlatformService()

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const stored = await platformService.loadSettings()
        if (stored) {
          // Migration: Ensure colorScheme exists for existing users (backward compatibility)
          const mergedSettings = { 
            ...defaultSettings, 
            ...stored,
            colorScheme: (stored.colorScheme as ColorScheme) || 'onyx'
          }
          setSettings(mergedSettings)
        }
      } catch (error) {
        console.error('Failed to load settings via platform service:', error)
      } finally {
        setIsLoaded(true)
      }
    }

    loadSettings()
  }, [platformService])

  // Save settings whenever they change (but only after initial load)
  useEffect(() => {
    if (isLoaded) {
      const saveSettings = async () => {
        try {
          await platformService.saveSettings(settings)
        } catch (error) {
          console.error('Failed to save settings via platform service:', error)
        }
      }
      saveSettings()
    }
  }, [settings, isLoaded, platformService])

  const updateSetting = <K extends keyof AppSettings>(key: K, value: AppSettings[K]) => {
    setSettings((prev) => ({
      ...prev,
      [key]: value,
    }))
  }

  // Helper functions for sidebar item visibility management
  const setSidebarItemVisibility = (itemId: string, visible: boolean) => {
    const newVisibility = { ...settings.sidebarItemVisibility }
    newVisibility[itemId] = visible
    updateSetting('sidebarItemVisibility', newVisibility)
  }

  const toggleSidebarItemVisibility = (itemId: string, defaultVisible: boolean = true) => {
    const currentlyVisible = settings.sidebarItemVisibility[itemId] ?? defaultVisible
    setSidebarItemVisibility(itemId, !currentlyVisible)
  }

  const isSidebarItemVisible = (itemId: string, defaultVisible: boolean = true) => {
    return settings.sidebarItemVisibility[itemId] ?? defaultVisible
  }

  const toggleSidebarItemPin = (itemId: string) => {
    const pinnedItems = [...settings.pinnedSidebarItems]
    const index = pinnedItems.indexOf(itemId)
    if (index > -1) {
      pinnedItems.splice(index, 1)
    } else {
      pinnedItems.push(itemId)
    }
    updateSetting('pinnedSidebarItems', pinnedItems)
  }

  return {
    settings,
    updateSetting,
    setSidebarItemVisibility,
    toggleSidebarItemVisibility,
    isSidebarItemVisible,
    toggleSidebarItemPin,
    isLoaded, // Added isLoaded to the return
  }
}

