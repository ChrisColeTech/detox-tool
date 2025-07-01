import { useMemo } from 'react'
import { getSidebarItems, getSidebarIcon } from '@/config/navigationConfig'
import type { NavigationItem } from '@/types/navigation'

export interface SidebarItem {
  id: string
  label: string
  icon: React.ReactElement | null
  visible: boolean
  pinned: boolean
  showInSidebar: boolean
}

interface UseSidebarManagementParams {
  isSidebarItemVisible: (itemId: string, defaultVisible: boolean) => boolean
  pinnedSidebarItems: string[]
  onToggleVisibility: (itemId: string) => void
  onTogglePin: (itemId: string) => void
}

/**
 * Custom hook for managing sidebar items state and operations
 * Follows architecture guide principles:
 * - Single responsibility: Sidebar management logic
 * - Clean separation from UI
 * - Computed values with proper memoization
 */
export const useSidebarManagement = ({
  isSidebarItemVisible,
  pinnedSidebarItems,
  onToggleVisibility,
  onTogglePin,
}: UseSidebarManagementParams) => {
  
  // Get only sidebar-enabled navigation items and transform for sidebar management
  const sidebarItems = useMemo(() => {
    const sidebarOnlyItems = getSidebarItems()
    
    return sidebarOnlyItems.map((item: NavigationItem): SidebarItem => {
      const visible = isSidebarItemVisible(item.id, item.showInSidebar)
      const pinned = pinnedSidebarItems.includes(item.id)
      
      return {
        id: item.id,
        label: item.label,
        icon: getSidebarIcon(item.id),
        visible,
        pinned,
        showInSidebar: item.showInSidebar,
      }
    })
  }, [isSidebarItemVisible, pinnedSidebarItems])

  // Separate items by their current state
  const visibleItems = useMemo(() => 
    sidebarItems.filter(item => item.visible)
  , [sidebarItems])

  const hiddenItems = useMemo(() => 
    sidebarItems.filter(item => !item.visible)
  , [sidebarItems])

  const pinnedItems = useMemo(() => 
    sidebarItems.filter(item => item.pinned)
  , [sidebarItems])

  const unpinnedItems = useMemo(() => 
    sidebarItems.filter(item => !item.pinned && item.visible)
  , [sidebarItems])

  // Statistics
  const stats = useMemo(() => ({
    total: sidebarItems.length,
    visible: visibleItems.length,
    hidden: hiddenItems.length,
    pinned: pinnedItems.length,
  }), [sidebarItems.length, visibleItems.length, hiddenItems.length, pinnedItems.length])

  return {
    // Data
    sidebarItems,
    visibleItems,
    hiddenItems,
    pinnedItems,
    unpinnedItems,
    stats,
    
    // Actions
    onToggleVisibility,
    onTogglePin,
  }
}
