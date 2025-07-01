import React from 'react'
import { clsx } from 'clsx'

interface ProgressBarProps {
  value: number
  max: number
  label?: string
  showPercentage?: boolean
  size?: 'sm' | 'md' | 'lg'
  variant?: 'default' | 'success' | 'warning' | 'error'
  className?: string
}

const progressVariants = {
  default: 'bg-accent',
  success: 'bg-status-success',
  warning: 'bg-status-warning',
  error: 'bg-status-error',
}

const progressSizes = {
  sm: 'h-1',
  md: 'h-2',
  lg: 'h-3',
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  max,
  label,
  showPercentage = true,
  size = 'md',
  variant = 'default',
  className,
}) => {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100))
  const isComplete = percentage === 100

  return (
    <div className={clsx('w-full', className)}>
      {(label || showPercentage) && (
        <div className="flex justify-between items-center mb-2">
          {label && (
            <span className="text-sm font-medium text-text">
              {label}
            </span>
          )}
          {showPercentage && (
            <span className="text-sm text-text-muted">
              {Math.round(percentage)}%
            </span>
          )}
        </div>
      )}
      
      <div className={clsx(
        'w-full bg-surface-hover rounded-full overflow-hidden',
        progressSizes[size]
      )}>
        <div
          className={clsx(
            'h-full transition-all duration-300 ease-out rounded-full',
            progressVariants[isComplete && variant === 'default' ? 'success' : variant]
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
      
      {label && (
        <div className="flex justify-between items-center mt-1">
          <span className="text-xs text-text-muted">
            {value} of {max}
          </span>
        </div>
      )}
    </div>
  )
}
