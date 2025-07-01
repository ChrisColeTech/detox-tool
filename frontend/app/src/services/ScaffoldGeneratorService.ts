import type { QueueItem } from '@/components/ui/QueueList'
import type { TreeNode } from '@/components/ui/FileTree'
import type { PlatformService } from '@/services/platformService'

export interface ScaffoldSettings {
  targetOS: 'windows' | 'macos' | 'linux' | 'cross-platform'
  includeContent: boolean
  createDirectoriesOnly: boolean
  addComments: boolean
  scriptName: string
  outputFormat: 'powershell' | 'bash' | 'batch' | 'python' | 'nodejs' | 'ruby' | 'perl' | 'fish' | 'zsh'
  templateVariables: { [key: string]: string }
  supportedFileTypes: string[]
}

export interface GeneratedScaffold {
  id: string
  name: string
  content: string
  os: string
  fileCount: number
  directoryCount: number
  size: number
  createdAt: Date
  scriptPath?: string
  format: string
}

export interface ScaffoldGenerationStats {
  totalScripts: number
  completedScripts: number
  totalFiles: number
  totalDirectories: number
  [key: string]: number // Add index signature for compatibility
}

export interface ScaffoldGenerationProgress {
  current: number
  total: number
}

export interface ScaffoldGenerationResult {
  scaffolds: GeneratedScaffold[]
  stats: ScaffoldGenerationStats
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
 * Service class for handling scaffold generation business logic
 * Follows architecture guide principles:
 * - Single responsibility: Scaffold generation operations only
 * - No UI dependencies
 * - Pure business logic with error handling
 * - Platform service abstraction
 */
export class ScaffoldGeneratorService {
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
   * Select directory for scaffold generation input
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
   * Select output directory for exported scaffolds
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
   * Generate scaffolds from directory with settings
   */
  async generateScaffolds(
    selectedPath: string, 
    settings: ScaffoldSettings,
    onProgress?: (progress: ScaffoldGenerationProgress) => void,
    onQueueUpdate?: (items: QueueItem[]) => void
  ): Promise<ScaffoldGenerationResult | null> {
    try {
      // Validate inputs
      if (!selectedPath) {
        this.toastService.warning('No directory selected', 'Please select an input directory first')
        return null
      }

      const validationErrors = this.validateSettings(settings)
      if (validationErrors.length > 0) {
        this.toastService.error('Invalid settings', validationErrors.join(', '))
        return null
      }

      // Create initial queue item
      const genItem: QueueItem = {
        id: 'gen-scaffold',
        name: 'Analyzing directory structure...',
        status: 'processing',
        type: 'scaffold',
        path: selectedPath,
        progress: 0,
        timestamp: new Date(),
      }

      onQueueUpdate?.([genItem])
      onProgress?.({ current: 0, total: 1 })

      // Start generation process
      const result = await this.platformService.generateScaffold(selectedPath, settings)
      
      if (!result) {
        throw new Error('No result from scaffold generation service')
      }

      // Update queue with completed status
      const completedGenItem = { ...genItem, status: 'completed' as const, progress: 100 }
      
      // Add scaffold items to queue
      const scaffoldQueueItems: QueueItem[] = result.scaffolds.map((scaffold) => ({
        id: `scaffold-${scaffold.id}`,
        name: scaffold.name,
        status: 'completed' as const,
        type: 'scaffold',
        path: scaffold.scriptPath || selectedPath,
        timestamp: new Date(),
      }))
      
      onQueueUpdate?.([completedGenItem, ...scaffoldQueueItems])
      onProgress?.(({ current: result.scaffolds.length, total: result.scaffolds.length }))
      
      this.toastService.success('Scaffold generation completed', `Created ${result.scaffolds.length} scaffold script(s)`)
      
      return result
    } catch (error) {
      // Update queue with error status
      const errorItem: QueueItem = {
        id: 'gen-scaffold',
        name: 'Analyzing directory structure...',
        status: 'error',
        type: 'scaffold',
        path: selectedPath,
        error: 'Failed to generate scaffolds',
        timestamp: new Date(),
      }
      
      onQueueUpdate?.([errorItem])
      this.toastService.error('Scaffold generation failed', 'Please check the directory and try again')
      console.error('Scaffold generation error:', error)
      return null
    }
  }

  /**
   * Export generated scaffolds to files
   */
  async exportScaffolds(scaffolds: GeneratedScaffold[]): Promise<ExportResult | null> {
    try {
      if (scaffolds.length === 0) {
        this.toastService.warning('No scaffolds generated', 'Please generate scaffolds first')
        return null
      }

      const result = await this.platformService.exportScaffolds(scaffolds)
      
      if (result?.success) {
        this.toastService.success('Scaffolds exported', `Saved ${scaffolds.length} script(s) to ${result.directory}`)
        return result
      }
      
      throw new Error('Export operation failed')
    } catch (error) {
      this.toastService.error('Export failed', 'Could not save scaffold files')
      console.error('Scaffold export error:', error)
      return null
    }
  }

  /**
   * Export single scaffold to file
   */
  async exportSingleScaffold(scaffold: GeneratedScaffold): Promise<ExportResult | null> {
    try {
      const result = await this.platformService.exportSingleScaffold(scaffold)
      
      if (result?.success) {
        this.toastService.success('Scaffold exported', `Saved to ${result.filePath}`)
        return result
      }
      
      throw new Error('Single scaffold export failed')
    } catch (error) {
      this.toastService.error('Export failed', 'Could not save scaffold file')
      console.error('Single scaffold export error:', error)
      return null
    }
  }

  /**
   * Validate scaffold generation settings
   */
  validateSettings(settings: ScaffoldSettings): string[] {
    const errors: string[] = []

    if (!settings.scriptName || settings.scriptName.trim().length === 0) {
      errors.push('Script name is required')
    }

    if (settings.scriptName && settings.scriptName.length > 100) {
      errors.push('Script name should not exceed 100 characters')
    }

    // Validate script name contains only safe characters
    if (settings.scriptName && !/^[a-zA-Z0-9_-]+$/.test(settings.scriptName)) {
      errors.push('Script name should only contain letters, numbers, underscores, and hyphens')
    }

    if (settings.supportedFileTypes && settings.supportedFileTypes.length === 0) {
      errors.push('At least one file type should be supported')
    }

    return errors
  }

  /**
   * Get default scaffold generation settings
   */
  getDefaultSettings(): ScaffoldSettings {
    return {
      targetOS: 'cross-platform',
      includeContent: false,
      createDirectoriesOnly: false,
      addComments: true,
      scriptName: 'scaffold',
      outputFormat: 'bash',
      templateVariables: {},
      supportedFileTypes: ['.js', '.ts', '.tsx', '.jsx', '.py', '.java', '.c', '.cpp', '.h', '.cs', '.rb', '.php', '.go', '.rs', '.swift', '.kt', '.scala', '.clj', '.hs', '.ml', '.f90', '.pl', '.sh', '.ps1', '.bat', '.cmd', '.fish', '.zsh']
    }
  }

  /**
   * Get supported output formats for target OS
   */
  getSupportedFormats(targetOS: ScaffoldSettings['targetOS']): ScaffoldSettings['outputFormat'][] {
    switch (targetOS) {
      case 'windows':
        return ['powershell', 'batch', 'python', 'nodejs']
      case 'macos':
        return ['bash', 'zsh', 'fish', 'python', 'nodejs', 'ruby', 'perl']
      case 'linux':
        return ['bash', 'fish', 'zsh', 'python', 'nodejs', 'ruby', 'perl']
      case 'cross-platform':
        return ['python', 'nodejs', 'ruby', 'perl']
      default:
        return ['bash']
    }
  }

  /**
   * Get default output format for target OS
   */
  getDefaultFormat(targetOS: ScaffoldSettings['targetOS']): ScaffoldSettings['outputFormat'] {
    switch (targetOS) {
      case 'windows':
        return 'powershell'
      case 'macos':
        return 'zsh'
      case 'linux':
        return 'bash'
      case 'cross-platform':
        return 'python'
      default:
        return 'bash'
    }
  }
}
