import { initializeNavigationService, NavigationService } from './navigationService'
import { initializeTabService, TabService, type TabCallbacks } from './tabService'
import { getNavigationItem } from '../config/navigationConfig'

export interface AppServiceCallbacks extends TabCallbacks {
  onSidebarChange: (tabId: string) => void
}

export class AppService {
  private navigationService: NavigationService
  private tabService: TabService
  private sidebarActiveTab: string = ''

  constructor(callbacks: AppServiceCallbacks) {
    this.tabService = initializeTabService({
      onTabAdd: callbacks.onTabAdd,
      onTabRemove: callbacks.onTabRemove,
      onTabActivate: callbacks.onTabActivate,
    })
    this.navigationService = initializeNavigationService({
      onTabAdd: (tab) => this.tabService.addTab(tab),
      onTabRemove: (tabId) => this.tabService.removeTab(tabId),
      onTabActivate: (tabId) => this.tabService.activateTab(tabId),
      onSidebarChange: (tabId) => {
        this.sidebarActiveTab = tabId
        callbacks.onSidebarChange(tabId)
      },
    })
  }

  openTab(itemId: string, activateTab: boolean = true): boolean {
    return this.navigationService.openTab(itemId, activateTab)
  }

  changeSidebarItem(itemId: string): boolean {
    const changed = this.navigationService.changeSidebarItem(itemId)
    if (changed) {
      this.navigationService.openTab(itemId, true)
    }
    return changed
  }

  openSettings(): void {
    this.navigationService.openSettings()
  }

  handleTabClick(tabId: string): void {
    this.tabService.activateTab(tabId)
    const navigationItem = getNavigationItem(tabId)
    if (navigationItem) {
      this.navigationService.changeSidebarItem(tabId)
    }
  }

  handleTabClose(tabId: string): void {
    this.tabService.removeTab(tabId)
  }

  getSidebarActiveTab(): string {
    return this.sidebarActiveTab
  }
}

let appServiceInstance: AppService | null = null
export const getAppService = (): AppService | null => appServiceInstance
export const initializeAppService = (callbacks: AppServiceCallbacks): AppService => {
  if (appServiceInstance) {
    return appServiceInstance
  }
  appServiceInstance = new AppService(callbacks)
  return appServiceInstance
}

