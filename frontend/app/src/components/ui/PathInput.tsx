import React from 'react'
import { FolderOpen, Folder, Check, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/Button'

interface PathInputProps {
  label: string
  value?: string
  placeholder?: string
  onBrowse: () => void
  description?: string
  optional?: boolean
  variant?: 'input' | 'output'
  className?: string
}

/**
 * Simple professional path input field with browse button
 * Similar to what you'd see in installer dialogs or preferences panels
 */
const PathInput: React.FC<PathInputProps> = ({
  label,
  value,
  placeholder = "No path selected",
  onBrowse,
  description,
  optional = false,
  variant = 'input',
  className = ''
}) => {
  const hasValue = Boolean(value)
  const Icon = variant === 'output' ? FolderOpen : Folder

  return (
    <div className={`space-y-2 ${className}`}>
      {/* Label */}
      <label className="block">
        <div className="flex items-center gap-2 mb-2">
          <Icon className="w-4 h-4 text-accent" />
          <span className="text-sm font-medium text-text">{label}</span>
          {optional && (
            <span className="text-xs text-text-muted">(Optional)</span>
          )}
        </div>
        
        {/* Input Row */}
        <div className={`
          flex app-border rounded-md overflow-hidden transition-colors
          ${hasValue ? 'border-accent' : ''}
          ${variant === 'output' ? 'border-dashed' : ''}
        `}>
          {/* Path Display */}
          <div className="flex-1 flex items-center px-3 py-2 bg-background min-h-[36px]">
            {hasValue ? (
              <div className="flex items-center gap-2 w-full">
                <Check className="w-4 h-4 text-accent flex-shrink-0" />
                <span className="text-sm font-mono text-text truncate" title={value}>
                  {value}
                </span>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-text-muted" />
                <span className="text-sm text-text-muted italic">
                  {placeholder}
                </span>
              </div>
            )}
          </div>
          
          {/* Browse Button */}
          <Button
            onClick={onBrowse}
            variant="ghost"
            size="sm"
            className="px-4 py-2 border-l border-border rounded-none hover:bg-surface-hover"
          >
            <FolderOpen className="w-4 h-4 mr-2" />
            Browse
          </Button>
        </div>
        
        {/* Description */}
        {description && (
          <p className="text-xs text-text-muted mt-1">
            {description}
          </p>
        )}
      </label>
    </div>
  )
}

export default PathInput
