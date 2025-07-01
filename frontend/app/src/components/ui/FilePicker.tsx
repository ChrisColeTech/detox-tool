import React from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { FolderOpen, FileText, Monitor, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/Button'

interface FilePickerProps {
  type: 'directory' | 'file'
  label: string
  description?: string
  selectedPath?: string
  onSelect: () => void
  optional?: boolean
  variant?: 'input' | 'output'
  className?: string
}

/**
 * Professional file picker component for desktop applications
 * Features modern design with hover states, animations, and clear visual feedback
 */
const FilePicker: React.FC<FilePickerProps> = ({
  type,
  label,
  description,
  selectedPath,
  onSelect,
  optional = false,
  variant = 'input',
  className = '',
}) => {
  const prefersReducedMotion = useReducedMotion()
  
  const getIcon = () => {
    if (type === 'directory') {
      return variant === 'output' ? Monitor : FolderOpen
    }
    return FileText
  }
  
  const getVariantStyles = () => {
    if (variant === 'output') {
      return 'border-dashed border-accent/30 bg-accent/5'
    }
    return 'border-solid border-border bg-surface'
  }
  
  const hasSelection = Boolean(selectedPath)
  const Icon = getIcon()
  
  const containerVariants = {
    initial: prefersReducedMotion ? {} : { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    transition: prefersReducedMotion ? { duration: 0 } : { duration: 0.2 }
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="initial"
      animate="animate"
      className={`group relative ${className}`}
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-3">
        <div className="page-icon">
          <Icon className="w-5 h-5 text-accent" />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-text flex items-center gap-2">
            {label}
            {optional && (
              <span className="text-sm font-normal text-text-muted">(Optional)</span>
            )}
          </h3>
          {description && (
            <p className="text-sm text-text-muted mt-1">{description}</p>
          )}
        </div>
      </div>

      {/* File Picker Area */}
      <div
        className={`
          relative app-border rounded-lg transition-all duration-200 overflow-hidden
          ${getVariantStyles()}
          ${hasSelection ? 'border-accent' : ''}
          motion-safe:group-hover:shadow-theme motion-safe:group-hover:scale-[1.01]
        `}
      >
        {/* Selection Button */}
        <Button
          onClick={onSelect}
          variant={variant === 'output' ? 'secondary' : 'ghost'}
          size="lg"
          className="w-full h-auto p-6 justify-start gap-4 text-left rounded-lg border-0"
        >
          <div className="flex-shrink-0">
            <div className={`
              w-12 h-12 rounded-lg flex items-center justify-center transition-all duration-200
              ${hasSelection 
                ? 'bg-accent text-white' 
                : 'bg-surface-hover text-accent group-hover:bg-accent group-hover:text-white'
              }
            `}>
              {hasSelection ? (
                <CheckCircle2 className="w-6 h-6" />
              ) : (
                <Icon className="w-6 h-6" />
              )}
            </div>
          </div>
          
          <div className="flex-1 min-w-0">
            {hasSelection ? (
              <div className="space-y-1">
                <p className="font-medium text-text">
                  {type === 'directory' ? 'Directory Selected' : 'File Selected'}
                </p>
                <p className="text-sm text-text-muted font-mono truncate">
                  {selectedPath}
                </p>
              </div>
            ) : (
              <div className="space-y-1">
                <p className="font-medium text-text">
                  Choose {type === 'directory' ? 'Directory' : 'File'}
                </p>
                <p className="text-sm text-text-muted">
                  Click to browse and select a {type}
                </p>
              </div>
            )}
          </div>
          
          <div className="flex-shrink-0">
            <div className={`
              w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200
              ${hasSelection 
                ? 'bg-accent/20 text-accent' 
                : 'bg-transparent text-text-muted group-hover:bg-accent/20 group-hover:text-accent'
              }
            `}>
              <FolderOpen className="w-4 h-4" />
            </div>
          </div>
        </Button>

        {/* Hover Effect Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none" />
      </div>

      {/* Selection Details (when selected) */}
      {hasSelection && (
        <motion.div
          initial={prefersReducedMotion ? {} : { opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="mt-3 p-3 bg-accent/10 app-border rounded-md"
        >
          <div className="flex items-center gap-2 text-sm">
            <CheckCircle2 className="w-4 h-4 text-accent flex-shrink-0" />
            <span className="text-text-muted">
              {type === 'directory' ? 'Directory' : 'File'} ready for processing
            </span>
          </div>
        </motion.div>
      )}
    </motion.div>
  )
}

export default FilePicker
