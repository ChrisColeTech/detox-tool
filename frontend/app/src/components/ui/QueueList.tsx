import React from 'react'
import { CheckCircle, Clock, XCircle, FileText, Folder, AlertCircle, Wrench } from 'lucide-react'
import { clsx } from 'clsx'

export interface QueueItem {
  id: string
  name: string
  status: 'pending' | 'processing' | 'completed' | 'error'
  type: 'file' | 'folder' | 'task' | 'scaffold'
  path?: string
  progress?: number
  error?: string
  timestamp?: Date
}

interface QueueListProps {
  items: QueueItem[]
  title?: string
  onRetry?: (itemId: string) => void
  onRemove?: (itemId: string) => void
  className?: string
  maxHeight?: string
}

const statusIcons = {
  pending: Clock,
  processing: Clock,
  completed: CheckCircle,
  error: XCircle,
}

const statusColors = {
  pending: 'text-text-muted',
  processing: 'text-accent animate-pulse',
  completed: 'text-status-success',
  error: 'text-status-error',
}

const typeIcons = {
  file: FileText,
  folder: Folder,
  task: AlertCircle,
  scaffold: Wrench,
}

export const QueueList: React.FC<QueueListProps> = ({
  items,
  title,
  onRetry,
  onRemove,
  className,
  maxHeight = '400px',
}) => {
  const pendingCount = items.filter(item => item.status === 'pending').length
  const processingCount = items.filter(item => item.status === 'processing').length
  const completedCount = items.filter(item => item.status === 'completed').length
  const errorCount = items.filter(item => item.status === 'error').length

  if (items.length === 0) {
    return (
      <div className={clsx(
        'bg-surface border border-border rounded-lg p-6 text-center',
        className
      )}>
        <FileText className="w-12 h-12 text-text-muted mx-auto mb-3" />
        <p className="text-text-muted">No items in queue</p>
      </div>
    )
  }

  return (
    <div className={clsx('bg-surface border border-border rounded-lg', className)}>
      {title && (
        <div className="px-4 py-3 border-b border-border">
          <h3 className="font-semibold text-text">{title}</h3>
          <div className="flex gap-4 mt-1 text-sm text-text-muted">
            {pendingCount > 0 && <span>Pending: {pendingCount}</span>}
            {processingCount > 0 && <span>Processing: {processingCount}</span>}
            {completedCount > 0 && <span>Completed: {completedCount}</span>}
            {errorCount > 0 && <span>Errors: {errorCount}</span>}
          </div>
        </div>
      )}
      
      <div 
        className="overflow-auto"
        style={{ maxHeight }}
      >
        {items.map((item) => {
          const StatusIcon = statusIcons[item.status]
          const TypeIcon = typeIcons[item.type]
          
          return (
            <div
              key={item.id}
              className={clsx(
                'flex items-center gap-3 px-4 py-3 border-b border-border last:border-b-0',
                'hover:bg-surface-hover transition-colors'
              )}
            >
              <div className="flex-shrink-0">
                <TypeIcon className="w-4 h-4 text-text-muted" />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h4 className="font-medium text-text truncate">
                    {item.name}
                  </h4>
                  <StatusIcon className={clsx('w-4 h-4', statusColors[item.status])} />
                </div>
                
                {item.path && (
                  <p className="text-sm text-text-muted truncate mt-1">
                    {item.path}
                  </p>
                )}
                
                {item.error && (
                  <p className="text-sm text-status-error mt-1">
                    {item.error}
                  </p>
                )}
                
                {item.status === 'processing' && item.progress !== undefined && (
                  <div className="w-full bg-surface-hover rounded-full h-1 mt-2">
                    <div
                      className="bg-accent h-1 rounded-full transition-all duration-300"
                      style={{ width: `${item.progress}%` }}
                    />
                  </div>
                )}
                
                {item.timestamp && (
                  <p className="text-xs text-text-muted mt-1">
                    {item.timestamp.toLocaleTimeString()}
                  </p>
                )}
              </div>
              
              <div className="flex items-center gap-2">
                {item.status === 'error' && onRetry && (
                  <button
                    onClick={() => onRetry(item.id)}
                    className="text-xs px-2 py-1 rounded bg-surface-hover hover:bg-surface-active text-text transition-colors"
                  >
                    Retry
                  </button>
                )}
                
                {onRemove && (
                  <button
                    onClick={() => onRemove(item.id)}
                    className="text-xs px-2 py-1 rounded bg-surface-hover hover:bg-surface-active text-text transition-colors"
                  >
                    Remove
                  </button>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
