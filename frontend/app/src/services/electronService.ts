import type { ElectronAPI, FileQueueItem } from '@/types/electron-api'

export class ElectronService {
  private electronAPI: ElectronAPI | undefined

  constructor() {
    this.electronAPI = (window as Window).electronAPI
  }

  isAvailable(): boolean {
    return !!this.electronAPI
  }

  async saveSettings(settings: Record<string, unknown>): Promise<void> {
    try {
      if (this.isAvailable() && this.electronAPI?.storage) {
        await this.electronAPI.storage.saveSettings(settings)
      }
    } catch (error) {
      console.error('Failed to save settings via Electron:', error)
      throw new Error('Settings save failed')
    }
  }

  async loadSettings(): Promise<Record<string, unknown> | null> {
    try {
      if (this.isAvailable() && this.electronAPI?.storage) {
        return await this.electronAPI.storage.loadSettings()
      }
      return null
    } catch (error) {
      console.error('Failed to load settings via Electron:', error)
      return null
    }
  }

  async openFile(): Promise<{ path: string; content: string } | null> {
    try {
      if (this.isAvailable() && this.electronAPI?.file) {
        return await this.electronAPI.file.openFile()
      }
      return null
    } catch (error) {
      console.error('Failed to open file via Electron:', error)
      return null
    }
  }

  async saveFile(path: string, content: string): Promise<boolean> {
    try {
      if (this.isAvailable() && this.electronAPI?.file) {
        return await this.electronAPI.file.saveFile(path, content)
      }
      return false
    } catch (error) {
      console.error('Failed to save file via Electron:', error)
      return false
    }
  }

  async saveFileAs(content: string): Promise<{ path: string; success: boolean } | null> {
    try {
      if (this.isAvailable() && this.electronAPI?.file) {
        return await this.electronAPI.file.saveFileAs(content)
      }
      return null
    } catch (error) {
      console.error('Failed to save file as via Electron:', error)
      return null
    }
  }

  async saveFileQueue(queue: FileQueueItem[]): Promise<void> {
    try {
      if (this.isAvailable() && this.electronAPI?.fileQueue) {
        await this.electronAPI.fileQueue.saveFileQueue(queue)
      }
    } catch (error) {
      console.error('Failed to save file queue via Electron:', error)
      throw new Error('File queue save failed')
    }
  }

  async loadFileQueue(): Promise<FileQueueItem[] | null> {
    try {
      if (this.isAvailable() && this.electronAPI?.fileQueue) {
        return await this.electronAPI.fileQueue.loadFileQueue()
      }
      return null
    } catch (error) {
      console.error('Failed to load file queue via Electron:', error)
      return null
    }
  }

  async exportFileQueue(queue: FileQueueItem[]): Promise<string | null> {
    try {
      if (this.isAvailable() && this.electronAPI?.fileQueue) {
        return await this.electronAPI.fileQueue.exportFileQueue(queue)
      }
      return null
    } catch (error) {
      console.error('Failed to export file queue via Electron:', error)
      return null
    }
  }

  async importFileQueue(): Promise<FileQueueItem[] | null> {
    try {
      if (this.isAvailable() && this.electronAPI?.fileQueue) {
        return await this.electronAPI.fileQueue.importFileQueue()
      }
      return null
    } catch (error) {
      console.error('Failed to import file queue via Electron:', error)
      return null
    }
  }

  async minimizeWindow(): Promise<void> {
    if (this.isAvailable() && this.electronAPI?.window) {
      this.electronAPI.window.minimize()
    }
  }

  async maximizeWindow(): Promise<void> {
    if (this.isAvailable() && this.electronAPI?.window) {
      this.electronAPI.window.maximize()
    }
  }

  closeWindow(): void {
    if (this.isAvailable() && this.electronAPI?.window) {
      this.electronAPI.window.close()
    }
  }

  async isMaximized(): Promise<boolean> {
    if (this.isAvailable() && this.electronAPI?.window) {
      return this.electronAPI.window.isMaximized()
    }
    return false
  }

  async showSaveDialog(defaultPath?: string): Promise<string | null> {
    if (this.isAvailable() && this.electronAPI?.dialog) {
      return await this.electronAPI.dialog.showSaveDialog(defaultPath)
    }
    return null
  }

  async showOpenDialog(): Promise<string[] | null> {
    if (this.isAvailable() && this.electronAPI?.dialog) {
      return await this.electronAPI.dialog.showOpenDialog()
    }
    return null
  }

  async showMessageBox(message: string, type?: 'info' | 'warning' | 'error'): Promise<void> {
    if (this.isAvailable() && this.electronAPI?.dialog) {
      await this.electronAPI.dialog.showMessageBox(message, type)
    }
  }

  async startApiProcess(): Promise<boolean> {
    if (this.isAvailable() && this.electronAPI?.startApiProcess) {
      return await this.electronAPI.startApiProcess()
    }
    return false
  }

  async stopApiProcess(): Promise<boolean> {
    if (this.isAvailable() && this.electronAPI?.stopApiProcess) {
      return await this.electronAPI.stopApiProcess()
    }
    return false
  }

  async restartApiProcess(): Promise<boolean> {
    if (this.isAvailable() && this.electronAPI?.restartApiProcess) {
      return await this.electronAPI.restartApiProcess()
    }
    return false
  }

  async getApiStatus(): Promise<{ isRunning: boolean; pid: number | null }> {
    if (this.isAvailable() && this.electronAPI?.getApiStatus) {
      return await this.electronAPI.getApiStatus()
    }
    return { isRunning: false, pid: null }
  }

  onWindowStateChange(callback: (state: { isMaximized: boolean }) => void): () => void {
    if (this.isAvailable() && this.electronAPI?.onWindowStateChange) {
      return this.electronAPI.onWindowStateChange(callback)
    }
    return () => {} // Return no-op function
  }

  getVersion(): string {
    if (this.isAvailable() && this.electronAPI?.app) {
      return this.electronAPI.app.getVersion()
    }
    return '1.0.0'
  }

  getPath(): string {
    if (this.isAvailable() && this.electronAPI?.app) {
      return this.electronAPI.app.getPath()
    }
    return ''
  }

  openDevTools(): void {
    if (this.isAvailable() && this.electronAPI?.dev) {
      this.electronAPI.dev.openDevTools()
    }
  }

  reload(): void {
    if (this.isAvailable() && this.electronAPI?.dev) {
      this.electronAPI.dev.reload()
    }
  }

  // Task Writer specific methods
  async selectDirectory(): Promise<{ canceled: boolean; filePaths: string[] } | null> {
    if (this.isAvailable() && this.electronAPI?.selectDirectory) {
      return await this.electronAPI.selectDirectory()
    }
    return null
  }

  async scanDirectory(path: string, settings: any): Promise<{ tree: any[]; stats: any } | null> {
    if (this.isAvailable() && this.electronAPI?.scanDirectory) {
      return await this.electronAPI.scanDirectory(path, settings)
    }
    return null
  }

  async exportScanResults(tree: any[], stats: any): Promise<{ success: boolean; filePath: string } | null> {
    if (this.isAvailable() && this.electronAPI?.exportScanResults) {
      return await this.electronAPI.exportScanResults(tree, stats)
    }
    return null
  }

  async generateTasks(path: string, settings: any): Promise<{ tasks: any[]; stats: any } | null> {
    if (this.isAvailable() && this.electronAPI?.generateTasks) {
      return await this.electronAPI.generateTasks(path, settings)
    }
    return null
  }

  async exportTasks(tasks: any[], format: string): Promise<{ success: boolean; directory: string } | null> {
    if (this.isAvailable() && this.electronAPI?.exportTasks) {
      return await this.electronAPI.exportTasks(tasks, format)
    }
    return null
  }

  async exportSingleTask(task: any): Promise<{ success: boolean; filePath: string } | null> {
    if (this.isAvailable() && this.electronAPI?.exportSingleTask) {
      return await this.electronAPI.exportSingleTask(task)
    }
    return null
  }

  async generateScaffold(path: string, settings: any): Promise<{ scaffolds: any[]; stats: any } | null> {
    if (this.isAvailable() && this.electronAPI?.generateScaffold) {
      return await this.electronAPI.generateScaffold(path, settings)
    }
    return null
  }

  async exportScaffolds(scaffolds: any[]): Promise<{ success: boolean; directory: string } | null> {
    if (this.isAvailable() && this.electronAPI?.exportScaffolds) {
      return await this.electronAPI.exportScaffolds(scaffolds)
    }
    return null
  }

  async exportSingleScaffold(scaffold: any): Promise<{ success: boolean; filePath: string } | null> {
    if (this.isAvailable() && this.electronAPI?.exportSingleScaffold) {
      return await this.electronAPI.exportSingleScaffold(scaffold)
    }
    return null
  }
}

