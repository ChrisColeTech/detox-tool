import React, { useState } from 'react'
import { FolderOpen, Folder, ChevronRight, HardDrive, Home, FileText } from 'lucide-react'
import { motion, useReducedMotion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface DirectoryPickerProps {
  selectedPath?: string
  placeholder?: string
  onSelectDirectory: () => void
  disabled?: boolean
  className?: string
  variant?: 'primary' | 'secondary'
  showPreview?: boolean
  label?: string
  description?: string
}

/**
 * Professional directory picker component for desktop applications
 * Features:
 * - Modern desktop-like file browser appearance
 * - Breadcrumb-style path display
 * - Hover animations and visual feedback
 * - Professional typography and spacing
 * - Theme-aware styling
 */
export const DirectoryPicker: React.FC<DirectoryPickerProps> = ({
  selectedPath,
  placeholder = "No directory selected",
  onSelectDirectory,
  disabled = false,
  className,
  variant = 'primary',
  showPreview = true,
  label,
  description,
}) => {
  const [isHovered, setIsHovered] = useState(false)
  const prefersReducedMotion = useReducedMotion()

  // Parse path into breadcrumb segments
  const pathSegments = selectedPath ? selectedPath.split(/[/\\]/).filter(Boolean) : []
  
  // Determine icon based on path
  const getPathIcon = (segment: string, index: number) => {
    if (index === 0 && (segment.endsWith(':') || segment === '')) {
      return <HardDrive className="w-4 h-4" />
    }
    if (segment === 'Users' || segment === 'home') {
      return <Home className="w-4 h-4" />
    }
    return <Folder className="w-4 h-4" />
  }

  const buttonVariants = {
    primary: cn(
      'bg-surface border-2 border-border text-text',
      'hover:border-accent hover:bg-surface-hover',
      'focus:border-accent focus:ring-2 focus:ring-accent/20',
      'disabled:bg-surface disabled:border-border disabled:text-text-muted disabled:cursor-not-allowed'
    ),
    secondary: cn(
      'bg-background border-2 border-dashed border-border text-text-muted',
      'hover:border-accent hover:text-text hover:bg-surface',
      'focus:border-accent focus:ring-2 focus:ring-accent/20',
      'disabled:bg-background disabled:border-border disabled:text-text-muted disabled:cursor-not-allowed'
    )
  }

  const animationVariants = {
    initial: { scale: 1 },
    hover: prefersReducedMotion ? {} : { scale: 1.02 },
    tap: prefersReducedMotion ? {} : { scale: 0.98 }
  }

  return (
    <div className={cn('space-y-3', className)}>
      {/* Label */}
      {label && (
        <div className="space-y-1">
          <label className="text-sm font-medium text-text">{label}</label>
          {description && (
            <p className="text-xs text-text-muted">{description}</p>
          )}
        </div>
      )}

      {/* Directory Picker Button */}
      <motion.button
        variants={animationVariants}
        initial="initial"
        whileHover={!disabled ? "hover" : undefined}
        whileTap={!disabled ? "tap" : undefined}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        onClick={onSelectDirectory}
        disabled={disabled}
        className={cn(
          'relative w-full p-4 rounded-lg transition-all duration-200',
          'focus:outline-none focus:ring-offset-2 focus:ring-offset-background',
          'group',
          buttonVariants[variant]
        )}
        aria-label={selectedPath ? `Selected directory: ${selectedPath}` : "Choose directory"}
      >
        {/* Main Content */}
        <div className="flex items-center gap-3">
          {/* Icon */}
          <div className={cn(
            'p-2 rounded-md transition-all duration-200',
            selectedPath ? 'bg-accent/10 text-accent' : 'bg-surface text-text-muted',
            'group-hover:bg-accent/20 group-hover:text-accent'
          )}>
            <FolderOpen className={cn(
              'w-5 h-5 transition-transform duration-200',
              isHovered && !disabled && 'scale-110'
            )} />
          </div>

          {/* Content */}
          <div className="flex-1 text-left">
            {selectedPath ? (
              <div className="space-y-1">
                {/* Path Breadcrumbs */}
                <div className="flex items-center gap-1 text-sm font-medium text-text">
                  {pathSegments.length > 3 ? (
                    <>
                      {getPathIcon(pathSegments[0], 0)}
                      <span className="truncate">{pathSegments[0]}</span>
                      <ChevronRight className="w-3 h-3 text-text-muted flex-shrink-0" />
                      <span className="text-text-muted">...</span>
                      <ChevronRight className="w-3 h-3 text-text-muted flex-shrink-0" />
                      {pathSegments.slice(-2).map((segment, index) => (
                        <React.Fragment key={index}>
                          {getPathIcon(segment, pathSegments.length - 2 + index)}
                          <span className="truncate">{segment}</span>
                          {index < 1 && <ChevronRight className="w-3 h-3 text-text-muted flex-shrink-0" />}
                        </React.Fragment>
                      ))}
                    </>
                  ) : (
                    pathSegments.map((segment, index) => (
                      <React.Fragment key={index}>
                        {getPathIcon(segment, index)}
                        <span className="truncate">{segment}</span>
                        {index < pathSegments.length - 1 && (
                          <ChevronRight className="w-3 h-3 text-text-muted flex-shrink-0" />
                        )}
                      </React.Fragment>
                    ))
                  )}
                </div>
                
                {/* Full Path */}
                <div className="text-xs text-text-muted font-mono truncate">
                  {selectedPath}
                </div>
              </div>
            ) : (
              <div className="space-y-1">
                <div className="text-sm font-medium text-text-muted">
                  {placeholder}
                </div>
                <div className="text-xs text-text-muted">
                  Click to browse and select a directory
                </div>
              </div>
            )}
          </div>

          {/* Arrow Indicator */}
          <div className={cn(
            'p-1 rounded transition-all duration-200',
            'group-hover:bg-accent/10',
            disabled && 'opacity-50'
          )}>
            <ChevronRight className={cn(
              'w-4 h-4 text-text-muted transition-transform duration-200',
              'group-hover:text-accent group-hover:translate-x-0.5'
            )} />
          </div>
        </div>

        {/* Hover Overlay */}
        <div className={cn(
          'absolute inset-0 rounded-lg bg-accent/5 opacity-0 transition-opacity duration-200',
          'group-hover:opacity-100 pointer-events-none'
        )} />
      </motion.button>

      {/* Directory Info Preview */}
      {showPreview && selectedPath && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="p-3 bg-surface/50 border border-border rounded-md"
        >
          <div className="flex items-center gap-2 text-sm text-text-muted">
            <FileText className="w-4 h-4" />
            <span>Directory selected and ready for analysis</span>
          </div>
        </motion.div>
      )}
    </div>
  )
}

export default DirectoryPicker
