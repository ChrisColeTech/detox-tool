export interface FileQueueItem {
  id: string
  name: string
  content: string
  path?: string
  timestamp: number
  type?: string
}

export interface ElectronAPI {
  storage: {
    saveSettings: (settings: Record<string, unknown>) => Promise<void>
    loadSettings: () => Promise<Record<string, unknown> | null>
  }
  file: {
    openFile: () => Promise<{ path: string; content: string } | null>
    saveFile: (path: string, content: string) => Promise<boolean>
    saveFileAs: (content: string) => Promise<{ path: string; success: boolean } | null>
  }
  fileQueue: {
    saveFileQueue: (queue: FileQueueItem[]) => Promise<void>
    loadFileQueue: () => Promise<FileQueueItem[] | null>
    exportFileQueue: (queue: FileQueueItem[]) => Promise<string | null>
    importFileQueue: () => Promise<FileQueueItem[] | null>
  }
  window: {
    minimize: () => void
    maximize: () => void // Should toggle maximize/unmaximize
    unmaximize: () => void // Specific unmaximize
    close: () => void
    isMaximized: () => boolean // Changed to Promise in service
  }
  dialog: {
    showSaveDialog: (defaultPath?: string) => Promise<string | null>
    showOpenDialog: () => Promise<string[] | null> // Assuming can return multiple paths
    showMessageBox: (message: string, type?: 'info' | 'warning' | 'error') => Promise<void> // 'type' is optional
  }
  app: {
    getVersion: () => string
    getPath: () => string // e.g., app path, userData path
  }
  dev: {
    openDevTools: () => void
    reload: () => void
  }
  // Added based on preload.js for API process control
  startApiProcess: () => Promise<boolean>
  stopApiProcess: () => Promise<boolean>
  restartApiProcess: () => Promise<boolean>
  getApiStatus: () => Promise<{ isRunning: boolean; pid: number | null }>
  // Added based on preload.js for window state changes
  onWindowStateChange: (callback: (state: { isMaximized: boolean }) => void) => () => void
  
  // Task Writer specific APIs
  selectDirectory: () => Promise<{ canceled: boolean; filePaths: string[] } | null>
  scanDirectory: (path: string, settings: any) => Promise<{ tree: any[]; stats: any } | null>
  exportScanResults: (tree: any[], stats: any) => Promise<{ success: boolean; filePath: string } | null>
  generateTasks: (path: string, settings: any) => Promise<{ tasks: any[]; stats: any } | null>
  exportTasks: (tasks: any[], format: string) => Promise<{ success: boolean; directory: string } | null>
  exportSingleTask: (task: any) => Promise<{ success: boolean; filePath: string } | null>
  generateScaffold: (path: string, settings: any) => Promise<{ scaffolds: any[]; stats: any } | null>
  exportScaffolds: (scaffolds: any[]) => Promise<{ success: boolean; directory: string } | null>
  exportSingleScaffold: (scaffold: any) => Promise<{ success: boolean; filePath: string } | null>
}

declare global {
  interface Window {
    electronAPI?: ElectronAPI
  }
}

