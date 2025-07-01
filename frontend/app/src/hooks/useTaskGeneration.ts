import { useState, useCallback, useMemo } from 'react'
import { TaskGeneratorService } from '@/services/TaskGeneratorService'
import { getPlatformService } from '@/services/platformService'
import { useToast } from '@/hooks/useToast'
import type { TreeNode } from '@/components/ui/FileTree'
import type { QueueItem } from '@/components/ui/QueueList'
import type { 
  TaskSettings, 
  GeneratedTask, 
  GenerationStats, 
  GenerationProgress 
} from '@/services/TaskGeneratorService'

/**
 * Custom hook for managing task generation state and operations
 * Follows architecture guide principles:
 * - Single responsibility: Task generation state management
 * - Service integration via dependency injection
 * - Clean separation from UI logic
 */
export const useTaskGeneration = () => {
  // State management
  const [selectedPath, setSelectedPath] = useState<string>('')
  const [outputPath, setOutputPath] = useState<string>('')
  const [generating, setGenerating] = useState(false)
  const [progress, setProgress] = useState<GenerationProgress>({ current: 0, total: 0 })
  const [treeData, setTreeData] = useState<TreeNode[]>([])
  const [selectedNode, setSelectedNode] = useState<TreeNode | null>(null)
  const [queueItems, setQueueItems] = useState<QueueItem[]>([])
  const [settings, setSettings] = useState<TaskSettings>(() => {
    // Use service to get default settings
    const platformService = getPlatformService()
    const service = new TaskGeneratorService(platformService, { 
      success: () => {}, 
      error: () => {}, 
      warning: () => {} 
    })
    return service.getDefaultSettings()
  })
  const [generatedTasks, setGeneratedTasks] = useState<GeneratedTask[]>([])
  const [previewTask, setPreviewTask] = useState<GeneratedTask | null>(null)
  const [generationStats, setGenerationStats] = useState<GenerationStats>({
    totalTasks: 0,
    completedTasks: 0,
    totalFiles: 0,
    processedFiles: 0,
  })

  // Service integration
  const toast = useToast()
  const platformService = getPlatformService()
  const taskGeneratorService = useMemo(() => 
    new TaskGeneratorService(platformService, {
      success: toast.success,
      error: toast.error,
      warning: toast.warning,
    })
  , [toast, platformService])

  // Directory selection operations
  const selectDirectory = useCallback(async () => {
    const path = await taskGeneratorService.selectDirectory()
    if (path) {
      setSelectedPath(path)
      
      // Auto-scan the directory for preview
      const treeData = await taskGeneratorService.scanDirectory(path)
      if (treeData) {
        setTreeData(treeData)
      }
    }
  }, [taskGeneratorService])

  const selectOutputDirectory = useCallback(async () => {
    const path = await taskGeneratorService.selectOutputDirectory()
    if (path) {
      setOutputPath(path)
    }
  }, [taskGeneratorService])

  // Task generation operations
  const startGeneration = useCallback(async () => {
    // Validate settings
    const validationErrors = taskGeneratorService.validateSettings(settings)
    if (validationErrors.length > 0) {
      toast.error('Invalid settings', validationErrors.join(', '))
      return
    }

    setGenerating(true)
    setProgress({ current: 0, total: 0 })
    setQueueItems([])
    setGeneratedTasks([])
    setGenerationStats({ totalTasks: 0, completedTasks: 0, totalFiles: 0, processedFiles: 0 })

    try {
      const result = await taskGeneratorService.generateTasks(
        selectedPath,
        settings,
        setProgress,
        setQueueItems
      )
      
      if (result) {
        setGeneratedTasks(result.tasks)
        setGenerationStats(result.stats)
      }
    } finally {
      setGenerating(false)
    }
  }, [selectedPath, settings, taskGeneratorService, toast])

  // Export operations
  const exportTasks = useCallback(async () => {
    const result = await taskGeneratorService.exportTasks(generatedTasks, settings.outputFormat)
    if (result?.directory) {
      setOutputPath(result.directory)
    }
  }, [generatedTasks, settings.outputFormat, taskGeneratorService])

  const exportSingleTask = useCallback(async (task: GeneratedTask) => {
    await taskGeneratorService.exportSingleTask(task)
  }, [taskGeneratorService])

  // Settings management
  const updateSettings = useCallback((newSettings: Partial<TaskSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }))
  }, [])

  const resetSettings = useCallback(() => {
    setSettings(taskGeneratorService.getDefaultSettings())
  }, [taskGeneratorService])

  // Preview management
  const setTaskPreview = useCallback((task: GeneratedTask | null) => {
    setPreviewTask(task)
  }, [])

  // Tree node selection
  const selectTreeNode = useCallback((node: TreeNode | null) => {
    setSelectedNode(node)
  }, [])

  // Reset state
  const resetState = useCallback(() => {
    setSelectedPath('')
    setOutputPath('')
    setGenerating(false)
    setProgress({ current: 0, total: 0 })
    setTreeData([])
    setSelectedNode(null)
    setQueueItems([])
    setGeneratedTasks([])
    setPreviewTask(null)
    setGenerationStats({ totalTasks: 0, completedTasks: 0, totalFiles: 0, processedFiles: 0 })
  }, [])

  // Computed values
  const hasSelectedDirectory = selectedPath.length > 0
  const hasGeneratedTasks = generatedTasks.length > 0
  const canGenerate = hasSelectedDirectory && !generating
  const canExport = hasGeneratedTasks && !generating

  return {
    // State values
    selectedPath,
    outputPath,
    generating,
    progress,
    treeData,
    selectedNode,
    queueItems,
    settings,
    generatedTasks,
    previewTask,
    generationStats,

    // Computed values
    hasSelectedDirectory,
    hasGeneratedTasks,
    canGenerate,
    canExport,

    // Operations
    selectDirectory,
    selectOutputDirectory,
    startGeneration,
    exportTasks,
    exportSingleTask,
    updateSettings,
    resetSettings,
    setTaskPreview,
    selectTreeNode,
    resetState,
  }
}
