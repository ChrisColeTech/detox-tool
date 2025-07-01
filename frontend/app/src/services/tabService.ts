import type { Tab } from '../types/tab'

export interface TabCallbacks {
  onTabAdd: (tab: Tab) => void
  onTabRemove: (tabId: string) => void
  onTabActivate: (tabId: string) => void
}

export class TabService {
  private callbacks: TabCallbacks

  constructor(callbacks: TabCallbacks) {
    this.callbacks = callbacks
  }

  addTab(tab: Tab): void {
    this.callbacks.onTabAdd(tab)
  }

  removeTab(tabId: string): void {
    this.callbacks.onTabRemove(tabId)
  }

  activateTab(tabId: string): void {
    this.callbacks.onTabActivate(tabId)
  }

  handleTabClick = (tabId: string): void => {
    this.activateTab(tabId)
  }

  handleTabClose = (tabId: string): void => {
    this.removeTab(tabId)
  }
}

let tabServiceInstance: TabService | null = null
export const getTabService = (): TabService | null => tabServiceInstance
export const initializeTabService = (callbacks: TabCallbacks): TabService => {
  tabServiceInstance = new TabService(callbacks)
  return tabServiceInstance
}

