import type { FileQueueItem } from '@/types/electron-api'

export class BrowserService {
  private readonly SETTINGS_STORAGE_KEY = 'app-settings'
  private readonly FILE_QUEUE_STORAGE_KEY = 'app-file-queue'

  constructor() {
    // BrowserService initialized
  }

  async saveSettings(settings: Record<string, unknown>): Promise<void> {
    try {
      localStorage.setItem(this.SETTINGS_STORAGE_KEY, JSON.stringify(settings))
    } catch (error) {
      console.error('Failed to save settings to localStorage:', error)
      throw new Error('Failed to save settings')
    }
  }

  async loadSettings(): Promise<Record<string, unknown> | null> {
    try {
      const stored = localStorage.getItem(this.SETTINGS_STORAGE_KEY)
      if (stored) {
        const parsed = JSON.parse(stored)
        return parsed
      }
      return null
    } catch (error) {
      console.error('Failed to load settings from localStorage:', error)
      return null
    }
  }

  async openFile(): Promise<{ path: string; content: string } | null> {
    return new Promise((resolve) => {
      const input = document.createElement('input')
      input.type = 'file'
      input.accept = '*/*'

      input.onchange = (event) => {
        const file = (event.target as HTMLInputElement).files?.[0]
        if (file) {
          const reader = new FileReader()
          reader.onload = (e) => {
            const content = e.target?.result as string
            resolve({
              path: file.name,
              content: content,
            })
          }
          reader.onerror = () => {
            console.error('Failed to read file')
            resolve(null)
          }
          reader.readAsText(file)
        } else {
          resolve(null)
        }
      }

      input.oncancel = () => resolve(null)
      input.click()
    })
  }

  async saveFile(path: string, content: string): Promise<boolean> {
    try {
      const blob = new Blob([content], { type: 'text/plain' })
      const url = URL.createObjectURL(blob)

      const a = document.createElement('a')
      a.href = url
      a.download = path.split('/').pop() || 'file.txt'
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)

      URL.revokeObjectURL(url)
      return true
    } catch (error) {
      console.error('Failed to save file:', error)
      return false
    }
  }

  async saveFileAs(content: string): Promise<{ path: string; success: boolean } | null> {
    try {
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
      const defaultFilename = `file-${timestamp}.txt`

      const blob = new Blob([content], { type: 'text/plain' })
      const url = URL.createObjectURL(blob)

      const a = document.createElement('a')
      a.href = url
      a.download = defaultFilename
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)

      URL.revokeObjectURL(url)

      return {
        path: defaultFilename,
        success: true,
      }
    } catch (error) {
      console.error('Failed to save file as:', error)
      return null
    }
  }

  minimizeWindow(): void {
    console.log('Mock: Window minimize requested (not supported in browser)')
  }

  async maximizeWindow(): Promise<void> {
    console.log('Mock: Window maximize requested')
    if (document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen().catch((err) => {
        console.log('Failed to enter fullscreen:', err)
      })
    }
  }

  closeWindow(): void {
    console.log('Mock: Window close requested')
    if (confirm('Are you sure you want to close this tab?')) {
      window.close()
    }
  }

  async isMaximized(): Promise<boolean> {
    return !!document.fullscreenElement
  }

  async showSaveDialog(defaultPath?: string): Promise<string | null> {
    console.log('Mock: Save dialog requested with default path:', defaultPath)

    const filename = prompt('Enter filename to save:', defaultPath || 'file.txt')
    return filename
  }

  async showOpenDialog(): Promise<string[] | null> {
    console.log('Mock: Open dialog requested')

    return new Promise((resolve) => {
      const input = document.createElement('input')
      input.type = 'file'
      input.multiple = true
      input.accept = '*/*'

      input.onchange = (event) => {
        const files = Array.from((event.target as HTMLInputElement).files || [])
        const filenames = files.map((file) => file.name)
        resolve(filenames.length > 0 ? filenames : null)
      }

      input.oncancel = () => resolve(null)
      input.click()
    })
  }

  async showMessageBox(
    message: string,
    type: 'info' | 'warning' | 'error' = 'info',
  ): Promise<void> {
    console.log(`Mock: Message box (${type}):`, message)

    switch (type) {
      case 'error':
        alert(`Error: ${message}`)
        break
      case 'warning':
        alert(`Warning: ${message}`)
        break
      case 'info':
      default:
        alert(message)
        break
    }
  }

  async saveFileQueue(queue: FileQueueItem[]): Promise<void> {
    try {
      localStorage.setItem(this.FILE_QUEUE_STORAGE_KEY, JSON.stringify(queue))
    } catch (error) {
      console.error('Failed to save file queue to localStorage:', error)
      throw new Error('Failed to save file queue')
    }
  }

  async loadFileQueue(): Promise<FileQueueItem[] | null> {
    try {
      const stored = localStorage.getItem(this.FILE_QUEUE_STORAGE_KEY)
      if (stored) {
        const parsed = JSON.parse(stored)
        return parsed
      }
      return null
    } catch (error) {
      console.error('Failed to load file queue from localStorage:', error)
      return null
    }
  }

  async exportFileQueue(queue: FileQueueItem[]): Promise<string | null> {
    try {
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
      const filename = `file-queue-${timestamp}.json`
      const content = JSON.stringify(queue, null, 2)

      const blob = new Blob([content], { type: 'application/json' })
      const url = URL.createObjectURL(blob)

      const a = document.createElement('a')
      a.href = url
      a.download = filename
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)

      URL.revokeObjectURL(url)
      return filename
    } catch (error) {
      console.error('Failed to export file queue:', error)
      return null
    }
  }

  async importFileQueue(): Promise<FileQueueItem[] | null> {
    return new Promise((resolve) => {
      const input = document.createElement('input')
      input.type = 'file'
      input.accept = '.json'

      input.onchange = (event) => {
        const file = (event.target as HTMLInputElement).files?.[0]
        if (file) {
          const reader = new FileReader()
          reader.onload = (e) => {
            try {
              const content = e.target?.result as string
              const queue = JSON.parse(content)
              resolve(queue)
            } catch (error) {
              console.error('Failed to parse imported file queue:', error)
              resolve(null)
            }
          }
          reader.onerror = () => {
            console.error('Failed to read file queue file')
            resolve(null)
          }
          reader.readAsText(file)
        } else {
          resolve(null)
        }
      }

      input.oncancel = () => resolve(null)
      input.click()
    })
  }

  // Task Writer specific methods - Browser implementation
  async selectDirectory(): Promise<{ canceled: boolean; filePaths: string[] } | null> {
    return new Promise((resolve) => {
      const input = document.createElement('input')
      input.type = 'file'
      input.webkitdirectory = true
      input.multiple = true

      input.onchange = (event) => {
        const files = (event.target as HTMLInputElement).files
        if (files && files.length > 0) {
          // Get the folder name from the first file's path
          const firstFile = files[0]
          const pathParts = firstFile.webkitRelativePath.split('/')
          const folderName = pathParts[0]
          
          resolve({
            canceled: false,
            filePaths: [folderName]
          })
        } else {
          resolve({ canceled: true, filePaths: [] })
        }
      }

      input.oncancel = () => resolve({ canceled: true, filePaths: [] })
      input.click()
    })
  }

  async scanDirectory(_path: string, _settings: any): Promise<{ tree: any[]; stats: any } | null> {
    // Browser fallback: return mock data or error
    console.warn('Directory scanning is not available in browser mode')
    void _path; void _settings;
    return null
  }

  async exportScanResults(tree: any[], stats: any): Promise<{ success: boolean; filePath: string } | null> {
    // Browser fallback: download as JSON
    try {
      const data = { tree, stats }
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      
      const a = document.createElement('a')
      a.href = url
      a.download = 'scan-results.json'
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      
      URL.revokeObjectURL(url)
      return { success: true, filePath: 'scan-results.json' }
    } catch {
      return null
    }
  }

  async generateTasks(_path: string, _settings: any): Promise<{ tasks: any[]; stats: any } | null> {
    // Browser fallback: not available
    console.warn('Task generation is not available in browser mode')
    void _path; void _settings;
    return null
  }

  async exportTasks(tasks: any[], format: string): Promise<{ success: boolean; directory: string } | null> {
    // Browser fallback: download as files
    try {
      for (const task of tasks) {
        const blob = new Blob([task.content], { type: 'text/plain' })
        const url = URL.createObjectURL(blob)
        
        const a = document.createElement('a')
        a.href = url
        a.download = `${task.name}.${format}`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        
        URL.revokeObjectURL(url)
      }
      return { success: true, directory: 'Downloads' }
    } catch {
      return null
    }
  }

  async exportSingleTask(task: any): Promise<{ success: boolean; filePath: string } | null> {
    // Browser fallback: download single file
    try {
      const blob = new Blob([task.content], { type: 'text/plain' })
      const url = URL.createObjectURL(blob)
      
      const a = document.createElement('a')
      a.href = url
      a.download = `${task.name}.txt`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      
      URL.revokeObjectURL(url)
      return { success: true, filePath: `${task.name}.txt` }
    } catch {
      return null
    }
  }

  async generateScaffold(_path: string, _settings: any): Promise<{ scaffolds: any[]; stats: any } | null> {
    // Browser fallback: not available
    console.warn('Scaffold generation is not available in browser mode')
    void _path; void _settings;
    return null
  }

  async exportScaffolds(scaffolds: any[]): Promise<{ success: boolean; directory: string } | null> {
    // Browser fallback: download as files
    try {
      for (const scaffold of scaffolds) {
        const blob = new Blob([scaffold.content], { type: 'text/plain' })
        const url = URL.createObjectURL(blob)
        
        const a = document.createElement('a')
        a.href = url
        a.download = `${scaffold.name}.${scaffold.format}`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        
        URL.revokeObjectURL(url)
      }
      return { success: true, directory: 'Downloads' }
    } catch {
      return null
    }
  }

  async exportSingleScaffold(scaffold: any): Promise<{ success: boolean; filePath: string } | null> {
    // Browser fallback: download single file
    try {
      const blob = new Blob([scaffold.content], { type: 'text/plain' })
      const url = URL.createObjectURL(blob)
      
      const a = document.createElement('a')
      a.href = url
      a.download = `${scaffold.name}.${scaffold.format}`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      
      URL.revokeObjectURL(url)
      return { success: true, filePath: `${scaffold.name}.${scaffold.format}` }
    } catch {
      return null
    }
  }
}

