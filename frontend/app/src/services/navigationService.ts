import { getNavigationItem, getTabIcon, getTabTitle } from '../config/navigationConfig'
import type { Tab } from '../types/tab'

export class NavigationService {
  private onTabAdd?: (tab: Tab) => void
  private onTabRemove?: (tabId: string) => void
  private onTabActivate?: (tabId: string) => void
  private onSidebarChange?: (tabId: string) => void

  constructor(callbacks?: {
    onTabAdd?: (tab: Tab) => void
    onTabRemove?: (tabId: string) => void
    onTabActivate?: (tabId: string) => void
    onSidebarChange?: (tabId: string) => void
  }) {
    this.onTabAdd = callbacks?.onTabAdd
    this.onTabRemove = callbacks?.onTabRemove
    this.onTabActivate = callbacks?.onTabActivate
    this.onSidebarChange = callbacks?.onSidebarChange
  }

  openTab(itemId: string, activateTab: boolean = true): boolean {
    const navigationItem = getNavigationItem(itemId)
    if (!navigationItem) return false

    const tab: Tab = {
      id: itemId,
      title: getTabTitle(itemId),
      label: getTabTitle(itemId),
      icon: getTabIcon(itemId),
      closable: navigationItem.closable !== undefined ? navigationItem.closable : true,
      isActive: activateTab,
    }
    this.onTabAdd?.(tab)
    if (activateTab) this.onTabActivate?.(itemId)
    return true
  }

  closeTab(tabId: string): void {
    this.onTabRemove?.(tabId)
  }

  activateTab(tabId: string): void {
    this.onTabActivate?.(tabId)
  }

  changeSidebarItem(itemId: string): boolean {
    const navigationItem = getNavigationItem(itemId)
    if (!navigationItem) return false
    this.onSidebarChange?.(itemId)
    return true
  }

  openSettings(): void {
    this.changeSidebarItem('settings')
    this.openTab('settings', true)
  }

  validateItemExists(itemId: string): boolean {
    const navigationItem = getNavigationItem(itemId)
    return navigationItem !== undefined
  }
}

let navigationServiceInstance: NavigationService | null = null
export const getNavigationService = (): NavigationService | null => navigationServiceInstance
export const initializeNavigationService = (callbacks: {
  onTabAdd?: (tab: Tab) => void
  onTabRemove?: (tabId: string) => void
  onTabActivate?: (tabId: string) => void
  onSidebarChange?: (tabId: string) => void
}): NavigationService => {
  navigationServiceInstance = new NavigationService(callbacks)
  return navigationServiceInstance
}

