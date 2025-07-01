import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react'

export type ErrorType = 'error' | 'warning' | 'info'
export type ErrorPersistence = 'temporary' | 'persistent' | 'session'

export interface AppError {
  id: string
  type: ErrorType
  title: string
  message?: string
  persistence: ErrorPersistence
  timestamp: Date
  dismissible?: boolean
  action?: {
    label: string
    onClick: () => void
  }
}

interface ErrorContextValue {
  errors: AppError[]
  addError: (error: Omit<AppError, 'id' | 'timestamp'>) => string
  removeError: (id: string) => void
  clearErrors: (type?: ErrorType) => void
  clearTemporaryErrors: () => void
  hasErrors: (type?: ErrorType) => boolean
  getPersistentErrors: () => AppError[]
}

const ErrorContext = createContext<ErrorContextValue | null>(null)

interface ErrorProviderProps {
  children: ReactNode
}

/**
 * Global error state management
 * Supports different error types and persistence levels:
 * - temporary: Auto-dismiss after timeout (handled by consuming components)
 * - persistent: Stays until manually dismissed or condition resolved
 * - session: Stays for the entire session
 */
export const ErrorProvider: React.FC<ErrorProviderProps> = ({ children }) => {
  const [errors, setErrors] = useState<AppError[]>([])

  const addError = useCallback((errorData: Omit<AppError, 'id' | 'timestamp'>) => {
    const id = `error-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    const newError: AppError = {
      ...errorData,
      id,
      timestamp: new Date(),
      dismissible: errorData.dismissible ?? true,
    }

    setErrors(prev => {
      // Remove duplicate errors based on title and type
      const filtered = prev.filter(
        err => !(err.title === newError.title && err.type === newError.type)
      )
      return [...filtered, newError]
    })

    return id
  }, [])

  const removeError = useCallback((id: string) => {
    setErrors(prev => prev.filter(err => err.id !== id))
  }, [])

  const clearErrors = useCallback((type?: ErrorType) => {
    setErrors(prev => {
      if (type) {
        return prev.filter(err => err.type !== type)
      }
      return []
    })
  }, [])

  const clearTemporaryErrors = useCallback(() => {
    setErrors(prev => prev.filter(err => err.persistence !== 'temporary'))
  }, [])

  const hasErrors = useCallback((type?: ErrorType) => {
    if (type) {
      return errors.some(err => err.type === type)
    }
    return errors.length > 0
  }, [errors])

  const getPersistentErrors = useCallback(() => {
    return errors.filter(err => err.persistence === 'persistent' || err.persistence === 'session')
  }, [errors])

  const value: ErrorContextValue = {
    errors,
    addError,
    removeError,
    clearErrors,
    clearTemporaryErrors,
    hasErrors,
    getPersistentErrors,
  }

  return (
    <ErrorContext.Provider value={value}>
      {children}
    </ErrorContext.Provider>
  )
}

export const useError = (): ErrorContextValue => {
  const context = useContext(ErrorContext)
  if (!context) {
    throw new Error('useError must be used within an ErrorProvider')
  }
  return context
}
