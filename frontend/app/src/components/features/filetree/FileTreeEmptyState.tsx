import React from 'react'
import { Folder } from 'lucide-react'
import { clsx } from 'clsx'

interface FileTreeEmptyStateProps {
  className?: string
  message?: string
}

/**
 * Component for FileTree empty state
 * Follows architecture guide principles:
 * - Single responsibility: Empty state display
 * - Under 50 lines
 * - Clean props interface
 * - Consistent styling
 */
const FileTreeEmptyState: React.FC<FileTreeEmptyStateProps> = ({
  className,
  message = "No files or folders to display",
}) => {
  return (
    <div className={clsx(
      'bg-surface border border-border rounded-lg p-6 text-center',
      className
    )}>
      <Folder className="w-12 h-12 text-text-muted mx-auto mb-3" />
      <p className="text-text-muted">{message}</p>
    </div>
  )
}

export default FileTreeEmptyState
