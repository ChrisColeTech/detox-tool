import type { QueueItem } from '@/components/ui/QueueList'
import type { TreeNode } from '@/components/ui/FileTree'
import type { PlatformService } from '@/services/platformService'

export interface TaskSettings {
  includeFileContents: boolean
  includeFolderStructure: boolean
  includeImplementationSteps: boolean
  groupByDirectory: boolean
  outputFormat: 'markdown' | 'text' | 'html'
  maxFileSize: number // MB
  filesPerTask: number
  customInstructions: string
}

export interface GeneratedTask {
  id: string
  name: string
  content: string
  directory: string
  fileCount: number
  size: number
  createdAt: Date
}

export interface GenerationStats {
  totalTasks: number
  completedTasks: number
  totalFiles: number
  processedFiles: number
  [key: string]: number // Add index signature for compatibility
}

export interface GenerationProgress {
  current: number
  total: number
}

export interface TaskGenerationResult {
  tasks: GeneratedTask[]
  stats: GenerationStats
}

export interface DirectoryResult {
  canceled: boolean
  filePaths: string[]
}

export interface ScanResult {
  tree: TreeNode[]
  stats: any
}

export interface ExportResult {
  success: boolean
  directory?: string
  filePath?: string
}

/**
 * Service class for handling task generation business logic
 * Follows architecture guide principles:
 * - Single responsibility: Task generation operations only
 * - No UI dependencies
 * - Pure business logic with error handling
 * - Platform service abstraction
 */
export class TaskGeneratorService {
  private platformService: PlatformService
  private toastService: {
    success: (title: string, message?: string) => void
    error: (title: string, message?: string) => void
    warning: (title: string, message?: string) => void
  }

  constructor(
    platformService: PlatformService,
    toastService: {
      success: (title: string, message?: string) => void
      error: (title: string, message?: string) => void
      warning: (title: string, message?: string) => void
    }
  ) {
    this.platformService = platformService
    this.toastService = toastService
  }

  /**
   * Select directory for task generation input
   */
  async selectDirectory(): Promise<string | null> {
    try {
      const result = await this.platformService.selectDirectory()
      if (result && !result.canceled) {
        const path = result.filePaths[0]
        this.toastService.success('Directory selected', path)
        return path
      }
      return null
    } catch (error) {
      this.toastService.error('Error selecting directory', 'Please try again')
      console.error('Directory selection error:', error)
      return null
    }
  }

  /**
   * Select output directory for exported tasks
   */
  async selectOutputDirectory(): Promise<string | null> {
    try {
      const result = await this.platformService.selectDirectory()
      if (result && !result.canceled) {
        const path = result.filePaths[0]
        this.toastService.success('Output directory selected', path)
        return path
      }
      return null
    } catch (error) {
      this.toastService.error('Error selecting output directory', 'Please try again')
      console.error('Output directory selection error:', error)
      return null
    }
  }

  /**
   * Scan directory and return file tree
   */
  async scanDirectory(path: string): Promise<TreeNode[] | null> {
    try {
      const scanResult = await this.platformService.scanDirectory(path, {
        excludeNodeModules: true,
        excludeGitIgnored: true,
        includeDotFiles: false,
        maxDepth: 10,
        maxFileSize: 50,
      })
      
      return scanResult?.tree || null
    } catch (error) {
      this.toastService.error('Directory scan failed', 'Could not analyze directory structure')
      console.error('Directory scan error:', error)
      return null
    }
  }

  /**
   * Generate tasks from directory with settings
   */
  async generateTasks(
    selectedPath: string, 
    settings: TaskSettings,
    onProgress?: (progress: GenerationProgress) => void,
    onQueueUpdate?: (items: QueueItem[]) => void
  ): Promise<TaskGenerationResult | null> {
    try {
      // Validate inputs
      if (!selectedPath) {
        this.toastService.warning('No directory selected', 'Please select an input directory first')
        return null
      }

      // Create initial queue item
      const genItem: QueueItem = {
        id: 'gen-root',
        name: 'Analyzing directory structure...',
        status: 'processing',
        type: 'task',
        path: selectedPath,
        progress: 0,
        timestamp: new Date(),
      }

      onQueueUpdate?.([genItem])
      onProgress?.({ current: 0, total: 1 })

      // Start generation process
      const result = await this.platformService.generateTasks(selectedPath, settings)
      
      if (!result) {
        throw new Error('No result from generation service')
      }

      // Update queue with completed status
      const completedGenItem = { ...genItem, status: 'completed' as const, progress: 100 }
      
      // Add task items to queue
      const taskQueueItems: QueueItem[] = result.tasks.map((task) => ({
        id: `task-${task.id}`,
        name: task.name,
        status: 'completed' as const,
        type: 'task',
        path: task.directory,
        timestamp: new Date(),
      }))
      
      onQueueUpdate?.([completedGenItem, ...taskQueueItems])
      onProgress?.(({ current: result.tasks.length, total: result.tasks.length }))
      
      this.toastService.success('Generation completed', `Created ${result.tasks.length} task files`)
      
      return result
    } catch (error) {
      // Update queue with error status
      const errorItem: QueueItem = {
        id: 'gen-root',
        name: 'Analyzing directory structure...',
        status: 'error',
        type: 'task',
        path: selectedPath,
        error: 'Failed to generate tasks',
        timestamp: new Date(),
      }
      
      onQueueUpdate?.([errorItem])
      this.toastService.error('Generation failed', 'Please check the directory and try again')
      console.error('Generation error:', error)
      return null
    }
  }

  /**
   * Export generated tasks to files
   */
  async exportTasks(
    tasks: GeneratedTask[], 
    outputFormat: TaskSettings['outputFormat']
  ): Promise<ExportResult | null> {
    try {
      if (tasks.length === 0) {
        this.toastService.warning('No tasks generated', 'Please generate tasks first')
        return null
      }

      const result = await this.platformService.exportTasks(tasks, outputFormat)
      
      if (result?.success) {
        this.toastService.success('Tasks exported', `Saved ${tasks.length} files to ${result.directory}`)
        return result
      }
      
      throw new Error('Export operation failed')
    } catch (error) {
      this.toastService.error('Export failed', 'Could not save task files')
      console.error('Export error:', error)
      return null
    }
  }

  /**
   * Export single task to file
   */
  async exportSingleTask(task: GeneratedTask): Promise<ExportResult | null> {
    try {
      const result = await this.platformService.exportSingleTask(task)
      
      if (result?.success) {
        this.toastService.success('Task exported', `Saved to ${result.filePath}`)
        return result
      }
      
      throw new Error('Single task export failed')
    } catch (error) {
      this.toastService.error('Export failed', 'Could not save task file')
      console.error('Single task export error:', error)
      return null
    }
  }

  /**
   * Validate task generation settings
   */
  validateSettings(settings: TaskSettings): string[] {
    const errors: string[] = []

    if (settings.maxFileSize <= 0) {
      errors.push('Max file size must be greater than 0')
    }

    if (settings.filesPerTask <= 0) {
      errors.push('Files per task must be greater than 0')
    }

    if (settings.maxFileSize > 100) {
      errors.push('Max file size should not exceed 100MB for performance')
    }

    if (settings.filesPerTask > 50) {
      errors.push('Files per task should not exceed 50 for manageable task sizes')
    }

    return errors
  }

  /**
   * Get default task generation settings
   */
  getDefaultSettings(): TaskSettings {
    return {
      includeFileContents: true,
      includeFolderStructure: true,
      includeImplementationSteps: true,
      groupByDirectory: true,
      outputFormat: 'markdown',
      maxFileSize: 10,
      filesPerTask: 5,
      customInstructions: '',
    }
  }
}
