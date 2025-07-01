import React, { useState } from 'react'
import { ChevronRight, ChevronDown, Folder, FolderOpen, File } from 'lucide-react'
import { clsx } from 'clsx'
import { getFileIcon, formatFileSize, type TreeNode } from '@/utils/fileTreeUtils'

interface TreeNodeComponentProps {
  node: TreeNode
  level: number
  onNodeSelect: (node: TreeNode) => void
  onNodeToggle: (node: TreeNode) => void
  selectedNodeId?: string | null
  showFileIcons?: boolean
}

/**
 * Component for individual tree node rendering
 * Follows architecture guide principles:
 * - Single responsibility: Individual tree node display
 * - Under 150 lines
 * - Clean props interface
 * - Recursive rendering for nested structure
 */
const TreeNodeComponent: React.FC<TreeNodeComponentProps> = ({
  node,
  level,
  onNodeSelect,
  onNodeToggle,
  selectedNodeId,
  showFileIcons = true,
}) => {
  const [localExpanded, setLocalExpanded] = useState(node.expanded ?? false)
  const isExpanded = node.expanded ?? localExpanded
  const isSelected = selectedNodeId === node.id
  const hasChildren = node.children && node.children.length > 0
  
  const handleToggle = () => {
    const newExpanded = !isExpanded
    setLocalExpanded(newExpanded)
    onNodeToggle({ ...node, expanded: newExpanded })
  }
  
  const handleSelect = () => {
    onNodeSelect(node)
  }
  
  const NodeIcon = showFileIcons 
    ? getFileIcon(node.name, node.type === 'folder' ? isExpanded : undefined)
    : (node.type === 'folder' ? (isExpanded ? FolderOpen : Folder) : File)
  
  return (
    <div>
      <div
        className={clsx(
          'flex items-center gap-2 px-2 py-1 cursor-pointer rounded hover:bg-surface-hover transition-colors',
          isSelected && 'bg-accent/10 text-accent',
          'group'
        )}
        style={{ paddingLeft: `${level * 16 + 8}px` }}
        onClick={handleSelect}
      >
        {/* Expand/Collapse Button */}
        <div className="flex-shrink-0 w-4 h-4 flex items-center justify-center">
          {hasChildren && (
            <button
              onClick={(e) => {
                e.stopPropagation()
                handleToggle()
              }}
              className="hover:bg-surface-active rounded p-0.5 transition-colors"
              aria-label={isExpanded ? 'Collapse folder' : 'Expand folder'}
            >
              {isExpanded ? (
                <ChevronDown className="w-3 h-3" />
              ) : (
                <ChevronRight className="w-3 h-3" />
              )}
            </button>
          )}
        </div>
        
        {/* Icon */}
        <NodeIcon className={clsx(
          'w-4 h-4 flex-shrink-0',
          node.type === 'folder' ? 'text-accent' : 'text-text-muted'
        )} />
        
        {/* Name and Info */}
        <div className="flex-1 min-w-0 flex items-center justify-between">
          <span className={clsx(
            'text-sm font-medium truncate',
            isSelected ? 'text-accent' : 'text-text'
          )}>
            {node.name}
          </span>
          
          <div className="flex items-center gap-2 text-xs text-text-muted">
            {node.type === 'folder' && node.fileCount !== undefined && (
              <span>{node.fileCount} files</span>
            )}
            {node.type === 'file' && node.size !== undefined && (
              <span>{formatFileSize(node.size)}</span>
            )}
          </div>
        </div>
      </div>
      
      {/* Children */}
      {hasChildren && isExpanded && (
        <div>
          {node.children!.map((child) => (
            <TreeNodeComponent
              key={child.id}
              node={child}
              level={level + 1}
              onNodeSelect={onNodeSelect}
              onNodeToggle={onNodeToggle}
              selectedNodeId={selectedNodeId}
              showFileIcons={showFileIcons}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default TreeNodeComponent
