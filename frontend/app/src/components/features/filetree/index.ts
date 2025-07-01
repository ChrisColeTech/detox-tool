// FileTree feature components
export { default as TreeNodeComponent } from './TreeNodeComponent'
export { default as FileTreeEmptyState } from './FileTreeEmptyState'

// Re-export main FileTree from ui for convenience
export { FileTree, type TreeNode } from '@/components/ui/FileTree'

// Re-export utilities
export * from '@/utils/fileTreeUtils'
