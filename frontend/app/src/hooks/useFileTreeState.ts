import { useState, useCallback } from 'react'
import { updateNodeExpanded, type TreeNode } from '@/utils/fileTreeUtils'

interface UseFileTreeStateProps {
  initialNodes: TreeNode[]
  onNodeSelect?: (node: TreeNode) => void
  onNodeToggle?: (node: TreeNode) => void
}

/**
 * Custom hook for managing FileTree state
 * Follows architecture guide principles:
 * - Single responsibility: File tree state management
 * - Clean separation from UI logic
 * - Reusable state logic
 */
export const useFileTreeState = ({
  initialNodes,
  onNodeSelect,
  onNodeToggle,
}: UseFileTreeStateProps) => {
  const [nodes, setNodes] = useState<TreeNode[]>(initialNodes)
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null)

  const handleNodeSelect = useCallback((node: TreeNode) => {
    setSelectedNodeId(node.id)
    onNodeSelect?.(node)
  }, [onNodeSelect])

  const handleNodeToggle = useCallback((node: TreeNode) => {
    const newExpanded = !node.expanded
    
    // Update local state
    setNodes(prevNodes => updateNodeExpanded(prevNodes, node.id, newExpanded))
    
    // Notify parent component
    onNodeToggle?.({ ...node, expanded: newExpanded })
  }, [onNodeToggle])

  const updateNodes = useCallback((newNodes: TreeNode[]) => {
    setNodes(newNodes)
  }, [])

  const resetSelection = useCallback(() => {
    setSelectedNodeId(null)
  }, [])

  return {
    nodes,
    selectedNodeId,
    handleNodeSelect,
    handleNodeToggle,
    updateNodes,
    resetSelection,
  }
}
