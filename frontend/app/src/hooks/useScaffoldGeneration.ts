import { useState, useCallback, useMemo, useEffect } from 'react'
import { ScaffoldGeneratorService } from '@/services/ScaffoldGeneratorService'
import { getPlatformService } from '@/services/platformService'
import { useToast } from '@/hooks/useToast'
import type { TreeNode } from '@/components/ui/FileTree'
import type { QueueItem } from '@/components/ui/QueueList'
import type { 
  ScaffoldSettings, 
  GeneratedScaffold, 
  ScaffoldGenerationStats, 
  ScaffoldGenerationProgress 
} from '@/services/ScaffoldGeneratorService'

/**
 * Custom hook for managing scaffold generation state and operations
 * Follows architecture guide principles:
 * - Single responsibility: Scaffold generation state management
 * - Service integration via dependency injection
 * - Clean separation from UI logic
 */
export const useScaffoldGeneration = () => {
  // State management
  const [selectedPath, setSelectedPath] = useState<string>('')
  const [outputPath, setOutputPath] = useState<string>('')
  const [isLoaded, setIsLoaded] = useState(false)
  const [generating, setGenerating] = useState(false)
  const [progress, setProgress] = useState<ScaffoldGenerationProgress>({ current: 0, total: 0 })
  const [treeData, setTreeData] = useState<TreeNode[]>([])
  const [selectedNode, setSelectedNode] = useState<TreeNode | null>(null)
  const [queueItems, setQueueItems] = useState<QueueItem[]>([])
  const [settings, setSettings] = useState<ScaffoldSettings>(() => {
    // Use service to get default settings
    const service = new ScaffoldGeneratorService(getPlatformService(), { 
      success: () => {}, 
      error: () => {}, 
      warning: () => {} 
    })
    return service.getDefaultSettings()
  })
  const [generatedScaffolds, setGeneratedScaffolds] = useState<GeneratedScaffold[]>([])
  const [previewScaffold, setPreviewScaffold] = useState<GeneratedScaffold | null>(null)
  const [generationStats, setGenerationStats] = useState<ScaffoldGenerationStats>({
    totalScripts: 0,
    completedScripts: 0,
    totalFiles: 0,
    totalDirectories: 0,
  })

  // Service integration
  const toast = useToast()
  const platformService = useMemo(() => getPlatformService(), [])
  const scaffoldGeneratorService = useMemo(() => 
    new ScaffoldGeneratorService(platformService, {
      success: toast.success,
      error: toast.error,
      warning: toast.warning,
    })
  , [platformService, toast])

  // Load persisted paths on mount
  useEffect(() => {
    const loadPersistedPaths = async () => {
      try {
        const settings = await platformService.loadSettings()
        if (settings?.scaffoldPaths) {
          const { selectedPath: savedSelectedPath, outputPath: savedOutputPath } = settings.scaffoldPaths as any
          if (savedSelectedPath) setSelectedPath(savedSelectedPath)
          if (savedOutputPath) setOutputPath(savedOutputPath)
        }
      } catch (error) {
        console.error('Failed to load persisted scaffold paths:', error)
      } finally {
        setIsLoaded(true)
      }
    }
    
    loadPersistedPaths()
  }, [platformService])

  // Persist paths when they change
  useEffect(() => {
    if (!isLoaded) return // Don't persist until initial load is complete
    
    const persistPaths = async () => {
      try {
        const currentSettings = await platformService.loadSettings() || {}
        await platformService.saveSettings({
          ...currentSettings,
          scaffoldPaths: {
            selectedPath,
            outputPath
          }
        })
      } catch (error) {
        console.error('Failed to persist scaffold paths:', error)
      }
    }
    
    persistPaths()
  }, [selectedPath, outputPath, isLoaded, platformService])

  // Directory selection operations
  const selectDirectory = useCallback(async () => {
    const path = await scaffoldGeneratorService.selectDirectory()
    if (path) {
      setSelectedPath(path)
      
      // Auto-scan the directory for preview
      const treeData = await scaffoldGeneratorService.scanDirectory(path)
      if (treeData) {
        setTreeData(treeData)
      }
    }
  }, [scaffoldGeneratorService])

  const selectOutputDirectory = useCallback(async () => {
    const path = await scaffoldGeneratorService.selectOutputDirectory()
    if (path) {
      setOutputPath(path)
    }
  }, [scaffoldGeneratorService])

  // Scaffold generation operations
  const startGeneration = useCallback(async () => {
    // Validate settings
    const validationErrors = scaffoldGeneratorService.validateSettings(settings)
    if (validationErrors.length > 0) {
      toast.error('Invalid settings', validationErrors.join(', '))
      return
    }

    setGenerating(true)
    setProgress({ current: 0, total: 0 })
    setQueueItems([])
    setGeneratedScaffolds([])
    setGenerationStats({ totalScripts: 0, completedScripts: 0, totalFiles: 0, totalDirectories: 0 })

    try {
      const result = await scaffoldGeneratorService.generateScaffolds(
        selectedPath,
        settings,
        setProgress,
        setQueueItems
      )
      
      if (result) {
        setGeneratedScaffolds(result.scaffolds)
        setGenerationStats(result.stats)
      }
    } finally {
      setGenerating(false)
    }
  }, [selectedPath, settings, scaffoldGeneratorService, toast])

  // Export operations
  const exportScaffolds = useCallback(async () => {
    const result = await scaffoldGeneratorService.exportScaffolds(generatedScaffolds)
    if (result?.directory) {
      setOutputPath(result.directory)
    }
  }, [generatedScaffolds, scaffoldGeneratorService])

  const exportSingleScaffold = useCallback(async (scaffold: GeneratedScaffold) => {
    await scaffoldGeneratorService.exportSingleScaffold(scaffold)
  }, [scaffoldGeneratorService])

  // Settings management
  const updateSettings = useCallback((newSettings: Partial<ScaffoldSettings>) => {
    setSettings(prev => {
      const updated = { ...prev, ...newSettings }
      
      // Auto-update output format when target OS changes
      if (newSettings.targetOS && newSettings.targetOS !== prev.targetOS) {
        const supportedFormats = scaffoldGeneratorService.getSupportedFormats(newSettings.targetOS)
        if (!supportedFormats.includes(updated.outputFormat)) {
          updated.outputFormat = scaffoldGeneratorService.getDefaultFormat(newSettings.targetOS)
        }
      }
      
      return updated
    })
  }, [scaffoldGeneratorService])

  const resetSettings = useCallback(() => {
    setSettings(scaffoldGeneratorService.getDefaultSettings())
  }, [scaffoldGeneratorService])

  // Template variable management
  const addTemplateVariable = useCallback((key: string, value: string) => {
    setSettings(prev => ({
      ...prev,
      templateVariables: {
        ...prev.templateVariables,
        [key]: value
      }
    }))
  }, [])

  const removeTemplateVariable = useCallback((key: string) => {
    setSettings(prev => {
      const newVars = { ...prev.templateVariables }
      delete newVars[key]
      return {
        ...prev,
        templateVariables: newVars
      }
    })
  }, [])

  // File type management
  const addFileType = useCallback((fileType: string) => {
    if (!fileType.startsWith('.')) {
      fileType = '.' + fileType
    }
    
    setSettings(prev => ({
      ...prev,
      supportedFileTypes: [...new Set([...prev.supportedFileTypes, fileType])]
    }))
  }, [])

  const removeFileType = useCallback((fileType: string) => {
    setSettings(prev => ({
      ...prev,
      supportedFileTypes: prev.supportedFileTypes.filter(type => type !== fileType)
    }))
  }, [])

  // Preview management
  const setScaffoldPreview = useCallback((scaffold: GeneratedScaffold | null) => {
    setPreviewScaffold(scaffold)
  }, [])

  // Tree node selection
  const selectTreeNode = useCallback((node: TreeNode | null) => {
    setSelectedNode(node)
  }, [])

  // Clear paths only
  const clearPaths = useCallback(() => {
    setSelectedPath('')
    setOutputPath('')
    setTreeData([])
    setSelectedNode(null)
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
    setGeneratedScaffolds([])
    setPreviewScaffold(null)
    setGenerationStats({ totalScripts: 0, completedScripts: 0, totalFiles: 0, totalDirectories: 0 })
  }, [])

  // Computed values
  const hasSelectedDirectory = selectedPath.length > 0
  const hasGeneratedScaffolds = generatedScaffolds.length > 0
  const canGenerate = hasSelectedDirectory && !generating
  const canExport = hasGeneratedScaffolds && !generating
  const supportedFormats = useMemo(() => 
    scaffoldGeneratorService.getSupportedFormats(settings.targetOS)
  , [scaffoldGeneratorService, settings.targetOS])

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
    generatedScaffolds,
    previewScaffold,
    generationStats,

    // Computed values
    hasSelectedDirectory,
    hasGeneratedScaffolds,
    canGenerate,
    canExport,
    supportedFormats,

    // Operations
    selectDirectory,
    selectOutputDirectory,
    startGeneration,
    exportScaffolds,
    exportSingleScaffold,
    updateSettings,
    resetSettings,
    addTemplateVariable,
    removeTemplateVariable,
    addFileType,
    removeFileType,
    setScaffoldPreview,
    selectTreeNode,
    clearPaths,
    resetState,
  }
}
