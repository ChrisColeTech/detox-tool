import { BrowserService } from '@/services/browserService'
import { ElectronService } from '@/services/electronService'
import type { FileQueueItem } from '@/types/electron-api'

export interface PlatformService {
  saveSettings(settings: Record<string, unknown>): Promise<void>
  loadSettings(): Promise<Record<string, unknown> | null>

  openFile(): Promise<{ path: string; content: string } | null>
  saveFile(path: string, content: string): Promise<boolean>
  saveFileAs(content: string): Promise<{ path: string; success: boolean } | null>

  saveFileQueue(files: FileQueueItem[]): Promise<void>
  loadFileQueue(): Promise<FileQueueItem[] | null>
  exportFileQueue(files: FileQueueItem[]): Promise<string | null>
  importFileQueue(): Promise<FileQueueItem[] | null>

  minimizeWindow(): void
  maximizeWindow(): Promise<void>
  closeWindow(): void
  isMaximized(): Promise<boolean>
  onWindowStateChange(callback: (state: { isMaximized: boolean }) => void): () => void

  showSaveDialog(defaultPath?: string): Promise<string | null>
  showOpenDialog(): Promise<string[] | null>
  showMessageBox(message: string, type?: 'info' | 'warning' | 'error'): Promise<void>

  isElectron(): boolean
  isBrowser(): boolean
  isMac(): boolean
  getPlatform(): 'electron' | 'browser'

  // Task Writer specific methods
  selectDirectory(): Promise<{ canceled: boolean; filePaths: string[] } | null>
  scanDirectory(path: string, settings: any): Promise<{ tree: any[]; stats: any } | null>
  exportScanResults(tree: any[], stats: any): Promise<{ success: boolean; filePath: string } | null>
  generateTasks(path: string, settings: any): Promise<{ tasks: any[]; stats: any } | null>
  exportTasks(tasks: any[], format: string): Promise<{ success: boolean; directory: string } | null>
  exportSingleTask(task: any): Promise<{ success: boolean; filePath: string } | null>
  generateScaffold(path: string, settings: any): Promise<{ scaffolds: any[]; stats: any } | null>
  exportScaffolds(scaffolds: any[]): Promise<{ success: boolean; directory: string } | null>
  exportSingleScaffold(scaffold: any): Promise<{ success: boolean; filePath: string } | null>
}

class PlatformServiceImpl implements PlatformService {
  private electronService: ElectronService
  private browserService: BrowserService
  private _isElectron: boolean

  constructor() {
    this._isElectron =
      !!(window as Window & { electronAPI?: unknown }).electronAPI ||
      !!(window as Window & { require?: unknown }).require

    // Debug logging
    console.log('Platform detection:', {
      hasElectronAPI: !!(window as Window & { electronAPI?: unknown }).electronAPI,
      hasRequire: !!(window as Window & { require?: unknown }).require,
      isElectron: this._isElectron,
      userAgent: navigator.userAgent
    })

    this.electronService = new ElectronService()
    this.browserService = new BrowserService()
  }

  isElectron(): boolean {
    return this._isElectron
  }

  isBrowser(): boolean {
    return !this._isElectron
  }

  isMac(): boolean {
    return navigator.platform.toUpperCase().indexOf('MAC') >= 0
  }

  getPlatform(): 'electron' | 'browser' {
    return this._isElectron ? 'electron' : 'browser'
  }

  async saveSettings(settings: Record<string, unknown>): Promise<void> {
    if (this._isElectron) {
      return this.electronService.saveSettings(settings)
    } else {
      return this.browserService.saveSettings(settings)
    }
  }

  async loadSettings(): Promise<Record<string, unknown> | null> {
    if (this._isElectron) {
      return this.electronService.loadSettings()
    } else {
      return this.browserService.loadSettings()
    }
  }

  async openFile(): Promise<{ path: string; content: string } | null> {
    if (this._isElectron) {
      return this.electronService.openFile()
    } else {
      return this.browserService.openFile()
    }
  }

  async saveFile(path: string, content: string): Promise<boolean> {
    if (this._isElectron) {
      return this.electronService.saveFile(path, content)
    } else {
      return this.browserService.saveFile(path, content)
    }
  }

  async saveFileAs(content: string): Promise<{ path: string; success: boolean } | null> {
    if (this._isElectron) {
      return this.electronService.saveFileAs(content)
    } else {
      return this.browserService.saveFileAs(content)
    }
  }

  async saveFileQueue(files: FileQueueItem[]): Promise<void> {
    if (this._isElectron) {
      return this.electronService.saveFileQueue(files)
    } else {
      return this.browserService.saveFileQueue(files)
    }
  }

  async loadFileQueue(): Promise<FileQueueItem[] | null> {
    if (this._isElectron) {
      return this.electronService.loadFileQueue()
    } else {
      return this.browserService.loadFileQueue()
    }
  }

  async exportFileQueue(files: FileQueueItem[]): Promise<string | null> {
    if (this._isElectron) {
      return this.electronService.exportFileQueue(files)
    } else {
      return this.browserService.exportFileQueue(files)
    }
  }

  async importFileQueue(): Promise<FileQueueItem[] | null> {
    if (this._isElectron) {
      return this.electronService.importFileQueue()
    } else {
      return this.browserService.importFileQueue()
    }
  }

  minimizeWindow(): void {
    if (this._isElectron) {
      this.electronService.minimizeWindow()
    } else {
      this.browserService.minimizeWindow()
    }
  }

  async maximizeWindow(): Promise<void> {
    if (this._isElectron) {
      await this.electronService.maximizeWindow()
    } else {
      await this.browserService.maximizeWindow()
    }
  }

  closeWindow(): void {
    if (this._isElectron) {
      this.electronService.closeWindow()
    } else {
      this.browserService.closeWindow()
    }
  }

  async isMaximized(): Promise<boolean> {
    if (this._isElectron) {
      return await this.electronService.isMaximized()
    } else {
      return await this.browserService.isMaximized()
    }
  }

  onWindowStateChange(callback: (state: { isMaximized: boolean }) => void): () => void {
    if (this._isElectron) {
      return this.electronService.onWindowStateChange(callback)
    } else {
      return () => {} // No-op unsubscribe for browser
    }
  }

  async showSaveDialog(defaultPath?: string): Promise<string | null> {
    if (this._isElectron) {
      return this.electronService.showSaveDialog(defaultPath)
    } else {
      return this.browserService.showSaveDialog(defaultPath)
    }
  }

  async showOpenDialog(): Promise<string[] | null> {
    if (this._isElectron) {
      return this.electronService.showOpenDialog()
    } else {
      return this.browserService.showOpenDialog()
    }
  }

  async showMessageBox(
    message: string,
    type: 'info' | 'warning' | 'error' = 'info',
  ): Promise<void> {
    if (this._isElectron) {
      return this.electronService.showMessageBox(message, type)
    } else {
      return this.browserService.showMessageBox(message, type)
    }
  }

  // Task Writer specific implementations
  async selectDirectory(): Promise<{ canceled: boolean; filePaths: string[] } | null> {
    if (this._isElectron) {
      return this.electronService.selectDirectory()
    } else {
      return this.browserService.selectDirectory()
    }
  }

  async scanDirectory(path: string, settings: any): Promise<{ tree: any[]; stats: any } | null> {
    if (this._isElectron) {
      return this.electronService.scanDirectory(path, settings)
    } else {
      return this.browserService.scanDirectory(path, settings)
    }
  }

  async exportScanResults(tree: any[], stats: any): Promise<{ success: boolean; filePath: string } | null> {
    if (this._isElectron) {
      return this.electronService.exportScanResults(tree, stats)
    } else {
      return this.browserService.exportScanResults(tree, stats)
    }
  }

  async generateTasks(path: string, settings: any): Promise<{ tasks: any[]; stats: any } | null> {
    if (this._isElectron) {
      return this.electronService.generateTasks(path, settings)
    } else {
      return this.browserService.generateTasks(path, settings)
    }
  }

  async exportTasks(tasks: any[], format: string): Promise<{ success: boolean; directory: string } | null> {
    if (this._isElectron) {
      return this.electronService.exportTasks(tasks, format)
    } else {
      return this.browserService.exportTasks(tasks, format)
    }
  }

  async exportSingleTask(task: any): Promise<{ success: boolean; filePath: string } | null> {
    if (this._isElectron) {
      return this.electronService.exportSingleTask(task)
    } else {
      return this.browserService.exportSingleTask(task)
    }
  }

  async generateScaffold(path: string, settings: any): Promise<{ scaffolds: any[]; stats: any } | null> {
    if (this._isElectron) {
      return this.electronService.generateScaffold(path, settings)
    } else {
      return this.browserService.generateScaffold(path, settings)
    }
  }

  async exportScaffolds(scaffolds: any[]): Promise<{ success: boolean; directory: string } | null> {
    if (this._isElectron) {
      return this.electronService.exportScaffolds(scaffolds)
    } else {
      return this.browserService.exportScaffolds(scaffolds)
    }
  }

  async exportSingleScaffold(scaffold: any): Promise<{ success: boolean; filePath: string } | null> {
    if (this._isElectron) {
      return this.electronService.exportSingleScaffold(scaffold)
    } else {
      return this.browserService.exportSingleScaffold(scaffold)
    }
  }
}

// Singleton instance
let platformServiceInstance: PlatformServiceImpl | null = null

export const getPlatformService = (): PlatformService => {
  if (!platformServiceInstance) {
    platformServiceInstance = new PlatformServiceImpl()
  }
  return platformServiceInstance
}

export const initializePlatformService = (): PlatformService => {
  platformServiceInstance = new PlatformServiceImpl()
  return platformServiceInstance
}

