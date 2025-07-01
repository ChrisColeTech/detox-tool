import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react'

export type ToastType = 'success' | 'error' | 'warning' | 'info'

export interface Toast {
  id: string
  type: ToastType
  title: string
  message?: string
  duration?: number
  action?: {
    label: string
    onClick: () => void
  }
}

interface ToastComponentProps {
  toast: Toast
  onDismiss: (id: string) => void
}

const icons = {
  success: CheckCircle,
  error: XCircle,
  warning: AlertCircle,
  info: Info,
}

const styles = {
  success: 'bg-surface border-border text-text shadow-lg',
  error: 'bg-surface border-red-300 text-text shadow-lg',
  warning: 'bg-surface border-yellow-300 text-text shadow-lg',
  info: 'bg-surface border-accent text-text shadow-lg',
}

const iconStyles = {
  success: 'text-accent',
  error: 'text-red-400',
  warning: 'text-yellow-400',
  info: 'text-accent',
}

export const ToastComponent: React.FC<ToastComponentProps> = ({ toast, onDismiss }) => {
  const Icon = icons[toast.type]

  React.useEffect(() => {
    if (toast.duration && toast.duration > 0) {
      const timer = setTimeout(() => {
        onDismiss(toast.id)
      }, toast.duration)
      return () => clearTimeout(timer)
    }
  }, [toast.id, toast.duration, onDismiss])

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.3 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
      className={`
        relative w-full max-w-sm p-4 border rounded-lg shadow-lg backdrop-blur-sm
        ${styles[toast.type]}
      `}
    >
      <div className="flex items-start">
        <Icon className={`w-5 h-5 mt-0.5 mr-3 flex-shrink-0 ${iconStyles[toast.type]}`} />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold">{toast.title}</p>
          {toast.message && (
            <p className="mt-1 text-sm opacity-90">{toast.message}</p>
          )}
          {toast.action && (
            <button
              onClick={toast.action.onClick}
              className="mt-2 text-sm font-medium underline hover:no-underline"
            >
              {toast.action.label}
            </button>
          )}
        </div>
        <button
          onClick={() => onDismiss(toast.id)}
          className="flex-shrink-0 ml-2 p-1 rounded hover:bg-black/5 dark:hover:bg-white/5"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  )
}

interface ToastContainerProps {
  toasts: Toast[]
  onDismiss: (id: string) => void
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left'
  bottomOffset?: string
}

export const ToastContainer: React.FC<ToastContainerProps> = ({
  toasts,
  onDismiss,
  position = 'top-right',
  bottomOffset
}) => {
  const getPositionClasses = () => {
    const baseClasses = {
      'top-right': 'top-4 right-4',
      'top-left': 'top-4 left-4',
      'bottom-right': 'right-4',
      'bottom-left': 'left-4',
    }
    
    if (position.startsWith('bottom') && bottomOffset) {
      return `${baseClasses[position]} ${bottomOffset}`
    }
    
    return position.startsWith('bottom') 
      ? `${baseClasses[position]} bottom-4`
      : baseClasses[position]
  }

  return (
    <div className={`fixed z-50 space-y-2 ${getPositionClasses()}`}>
      <AnimatePresence>
        {toasts.map((toast) => (
          <ToastComponent
            key={toast.id}
            toast={toast}
            onDismiss={onDismiss}
          />
        ))}
      </AnimatePresence>
    </div>
  )
}
