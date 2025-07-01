import React, { useEffect } from 'react'
import { clsx } from 'clsx'
import { useFileTreeState } from '@/hooks/useFileTreeState'
import TreeNodeComponent from '@/components/features/filetree/TreeNodeComponent'
import FileTreeEmptyState from '@/components/features/filetree/FileTreeEmptyState'
import { type TreeNode } from '@/utils/fileTreeUtils'

// Re-export TreeNode type for backward compatibility
export type { TreeNode }

interface FileTreeProps {
  data: TreeNode[]
  onSelectNode?: (node: TreeNode | null) => void
  onToggleNode?: (node: TreeNode) => void
  selectedNode?: TreeNode | null
  className?: string
  maxHeight?: string
  maxDepth?: number
  showFileIcons?: boolean
  emptyMessage?: string
}

/**
 * Refactored FileTree component
 * Follows architecture guide principles:
 * - Single responsibility: File tree orchestration
 * - Under 150 lines (reduced from 214 lines)
 * - Clean separation of concerns via hooks and components
 * - Composition over complex logic
 */
export const FileTree: React.FC<FileTreeProps> = ({
  data,
  onSelectNode,
  onToggleNode,
  selectedNode,
  className,
  maxHeight = '400px',
  maxDepth,
  showFileIcons = true,
  emptyMessage,
}) => {
  const {
    nodes,
    selectedNodeId,
    handleNodeSelect,
    handleNodeToggle,
    updateNodes,
  } = useFileTreeState({
    initialNodes: data,
    onNodeSelect: onSelectNode,
    onNodeToggle: onToggleNode,
  })

  // Update nodes when data prop changes
  useEffect(() => {
    updateNodes(data)
  }, [data, updateNodes])

  // Handle external selectedNode prop
  useEffect(() => {
    if (selectedNode && selectedNode.id !== selectedNodeId) {
      handleNodeSelect(selectedNode)
    }
  }, [selectedNode, selectedNodeId, handleNodeSelect])

  // Filter nodes by maxDepth if specified
  const processedNodes = maxDepth !== undefined 
    ? filterNodesByDepth(nodes, maxDepth)
    : nodes

  if (processedNodes.length === 0) {
    return <FileTreeEmptyState className={className} message={emptyMessage} />
  }

  return (
    <div className={clsx('bg-surface app-border rounded-md overflow-hidden', className)}>
      <div 
        className="overflow-auto p-2"
        style={{ maxHeight }}
      >
        {processedNodes.map((node) => (
          <TreeNodeComponent
            key={node.id}
            node={node}
            level={0}
            onNodeSelect={handleNodeSelect}
            onNodeToggle={handleNodeToggle}
            selectedNodeId={selectedNodeId}
            showFileIcons={showFileIcons}
          />
        ))}
      </div>
    </div>
  )
}

/**
 * Helper function to filter nodes by maximum depth
 */
function filterNodesByDepth(nodes: TreeNode[], maxDepth: number, currentDepth = 0): TreeNode[] {
  if (currentDepth >= maxDepth) {
    return []
  }

  return nodes.map(node => {
    if (node.children && currentDepth < maxDepth - 1) {
      return {
        ...node,
        children: filterNodesByDepth(node.children, maxDepth, currentDepth + 1)
      }
    }
    
    // Remove children if we've reached max depth
    return currentDepth >= maxDepth - 1 ? { ...node, children: undefined } : node
  })
}
