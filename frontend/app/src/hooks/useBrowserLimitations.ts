import { useEffect, useCallback } from 'react'
import { useErrorHandler } from '@/hooks/useErrorHandler'
import { getPlatformService } from '@/services/platformService'

interface BrowserLimitationConfig {
  showOnMount?: boolean
  features?: string[]
}

/**
 * Hook for managing browser limitation warnings
 * Automatically shows warnings for limited functionality in browser mode
 */
export const useBrowserLimitations = (config: BrowserLimitationConfig = {}) => {
  const { handleBrowserLimitation } = useErrorHandler()
  const platformService = getPlatformService()

  // Show initial browser limitation warning
  useEffect(() => {
    if (config.showOnMount && platformService.isBrowser()) {
      const features = config.features || [
        'Directory scanning and analysis',
        'Task generation',
        'File system operations',
        'Advanced export options'
      ]

      // Add a small delay to ensure the context is ready
      setTimeout(() => {
        handleBrowserLimitation(
          'Browser Mode - Limited Functionality',
          `${features.join(', ')} are not available in browser mode. Download the desktop application for full functionality.`
        )
      }, 100)
    }
  }, [config.showOnMount, config.features, handleBrowserLimitation, platformService])

  // Function to warn about specific feature limitations
  const warnFeatureLimitation = useCallback((
    feature: string,
    workaround?: string
  ) => {
    if (platformService.isBrowser()) {
      return handleBrowserLimitation(feature, workaround)
    }
    return null
  }, [handleBrowserLimitation, platformService])

  // Check if a feature is available
  const isFeatureAvailable = useCallback((feature: 'directory-scan' | 'task-generation' | 'file-system') => {
    if (platformService.isElectron()) {
      return true
    }

    // Some features might be partially available in browser
    switch (feature) {
      case 'directory-scan':
      case 'task-generation':
        return false
      case 'file-system':
        return 'showDirectoryPicker' in window // Modern browsers with File System Access API
      default:
        return false
    }
  }, [platformService])

  return {
    isBrowser: platformService.isBrowser(),
    isElectron: platformService.isElectron(),
    warnFeatureLimitation,
    isFeatureAvailable,
  }
}

// Specific hooks for different pages/features
export const useTaskGeneratorLimitations = () => {
  return useBrowserLimitations({
    showOnMount: true,
    features: [
      'Directory scanning',
      'Automated task generation',
      'Bulk file operations'
    ]
  })
}

export const useScaffoldGeneratorLimitations = () => {
  return useBrowserLimitations({
    showOnMount: true,
    features: [
      'Scaffold generation',
      'Template processing',
      'File structure creation'
    ]
  })
}
