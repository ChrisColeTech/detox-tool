import React from 'react'
import { AlertTriangle, Info, AlertCircle, X } from 'lucide-react'
import { useError } from '@/contexts/ErrorContext'
import type { ErrorType } from '@/contexts/ErrorContext'

interface ErrorBannerProps {
  className?: string
}

/**
 * Simple error banner following the design system
 * Shows one persistent error at a time in a clean, minimal way
 */
export const ErrorBanner: React.FC<ErrorBannerProps> = ({ className = '' }) => {
  const { getPersistentErrors, removeError } = useError()
  const persistentErrors = getPersistentErrors()

  // Show only the most recent error
  if (persistentErrors.length === 0) {
    return null
  }

  const error = persistentErrors[persistentErrors.length - 1]

  const getIcon = (type: ErrorType) => {
    switch (type) {
      case 'error': return AlertCircle
      case 'warning': return AlertTriangle  
      case 'info': return Info
      default: return AlertTriangle
    }
  }

  const getStyles = (type: ErrorType) => {
    switch (type) {
      case 'error':
        return 'bg-status-error-bg text-text border-status-error'
      case 'warning':
        return 'bg-status-warning-bg text-text border-status-warning'
      case 'info':
        return 'bg-status-info-bg text-text border-status-info'
      default:
        return 'bg-surface text-text border-border'
    }
  }

  const getIconStyles = (type: ErrorType) => {
    switch (type) {
      case 'error':
        return 'text-status-error'
      case 'warning':
        return 'text-status-warning'
      case 'info':
        return 'text-status-info'
      default:
        return 'text-text-muted'
    }
  }

  const Icon = getIcon(error.type)

  return (
    <div className={`${getStyles(error.type)} border-b px-4 py-3 ${className}`}>
      <div className="flex items-start gap-3">
        <Icon className={`w-5 h-5 mt-0.5 flex-shrink-0 ${getIconStyles(error.type)}`} />
        <div className="flex-1 min-w-0">
          <div className="font-medium text-sm">{error.title}</div>
          {error.message && (
            <div className="text-sm mt-1 opacity-90">{error.message}</div>
          )}
        </div>
        {error.dismissible && (
          <button
            onClick={() => removeError(error.id)}
            className={`flex-shrink-0 p-1 hover:opacity-70 transition-opacity ${getIconStyles(error.type)}`}
            aria-label="Dismiss"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  )
}

export default ErrorBanner
