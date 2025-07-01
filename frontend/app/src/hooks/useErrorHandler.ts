import { useCallback } from 'react'
import { useError } from '@/contexts/ErrorContext'
import { useToast } from '@/hooks/useToast'
import type { ErrorType, ErrorPersistence } from '@/contexts/ErrorContext'

interface ErrorHandlerOptions {
  title: string
  message?: string
  type?: ErrorType
  persistence?: ErrorPersistence
  dismissible?: boolean
  action?: {
    label: string
    onClick: () => void
  }
  showToast?: boolean // If true, also show as toast notification
}

interface ValidationError {
  field: string
  message: string
}

interface ServerError {
  code?: string | number
  message: string
  details?: unknown
}

/**
 * Standardized error handling hook
 * Provides consistent error handling across the application
 * Supports both banner errors and toast notifications
 */
export const useErrorHandler = () => {
  const { addError, removeError, clearErrors } = useError()
  const toast = useToast()

  // Generic error handler
  const handleError = useCallback((options: ErrorHandlerOptions) => {
    const errorId = addError({
      title: options.title,
      message: options.message,
      type: options.type || 'error',
      persistence: options.persistence || 'temporary',
      dismissible: options.dismissible ?? true,
      action: options.action,
    })

    // Also show as toast if requested
    if (options.showToast) {
      const toastType = options.type === 'info' ? 'success' : options.type || 'error'
      toast[toastType](options.title, options.message)
    }

    return errorId
  }, [addError, toast])

  // Validation error handler
  const handleValidationError = useCallback((
    field: string, 
    message: string,
    showPersistent = false
  ) => {
    return handleError({
      title: `Validation Error: ${field}`,
      message,
      type: 'warning',
      persistence: showPersistent ? 'persistent' : 'temporary',
      showToast: !showPersistent,
    })
  }, [handleError])

  // Multiple validation errors handler
  const handleValidationErrors = useCallback((
    errors: ValidationError[],
    showPersistent = false
  ) => {
    if (errors.length === 0) return []

    // For multiple errors, show the first one prominently
    const firstError = errors[0]
    const remainingCount = errors.length - 1

    const title = `Validation Error: ${firstError.field}`
    const message = remainingCount > 0 
      ? `${firstError.message} (and ${remainingCount} more error${remainingCount !== 1 ? 's' : ''})`
      : firstError.message

    return [handleError({
      title,
      message,
      type: 'warning',
      persistence: showPersistent ? 'persistent' : 'temporary',
      showToast: !showPersistent,
    })]
  }, [handleError])

  // Server error handler
  const handleServerError = useCallback((
    error: ServerError,
    context = 'Server Error'
  ) => {
    const title = error.code ? `${context} (${error.code})` : context
    
    return handleError({
      title,
      message: error.message,
      type: 'error',
      persistence: 'persistent',
      dismissible: true,
    })
  }, [handleError])

  // Network error handler
  const handleNetworkError = useCallback((
    message = 'Unable to connect to server. Please check your internet connection.',
    showRetryAction = true
  ) => {
    return handleError({
      title: 'Network Error',
      message,
      type: 'error',
      persistence: 'persistent',
      action: showRetryAction ? {
        label: 'Retry',
        onClick: () => window.location.reload()
      } : undefined,
    })
  }, [handleError])

  // Browser limitation warning
  const handleBrowserLimitation = useCallback((
    feature: string,
    workaround?: string
  ) => {
    const message = workaround 
      ? `${feature} is not available in browser mode. ${workaround}`
      : `${feature} is not available in browser mode. Please use the desktop application for full functionality.`

    return handleError({
      title: 'Browser Limitation',
      message,
      type: 'warning',
      persistence: 'session',
      action: {
        label: 'Learn More',
        onClick: () => {
          // Could open documentation or help
          console.info('Browser limitations help requested')
        }
      }
    })
  }, [handleError])

  // Permission error handler
  const handlePermissionError = useCallback((
    resource: string,
    required: string
  ) => {
    return handleError({
      title: 'Permission Denied',
      message: `Access to ${resource} requires ${required} permission.`,
      type: 'error',
      persistence: 'persistent',
    })
  }, [handleError])

  // Clear specific error types
  const clearErrorsByType = useCallback((type: ErrorType) => {
    clearErrors(type)
  }, [clearErrors])

  // Clear all temporary errors (useful for page transitions)
  const clearTemporaryErrors = useCallback(() => {
    clearErrors('error') // Assuming temporary errors are mostly 'error' type
  }, [clearErrors])

  return {
    // Generic handlers
    handleError,
    
    // Specific error handlers
    handleValidationError,
    handleValidationErrors,
    handleServerError,
    handleNetworkError,
    handleBrowserLimitation,
    handlePermissionError,
    
    // Error management
    removeError,
    clearErrorsByType,
    clearTemporaryErrors,
  }
}
