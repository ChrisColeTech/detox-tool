import { File, FileText, Image, Code, Folder, FolderOpen } from 'lucide-react'

/**
 * Utility functions for FileTree component
 * Follows architecture guide principles:
 * - Single responsibility: File tree utility functions
 * - Pure functions for testability
 * - No React dependencies
 */

export const getFileIcon = (filename: string, isOpen?: boolean) => {
  if (isOpen !== undefined) {
    return isOpen ? FolderOpen : Folder
  }
  
  const ext = filename.split('.').pop()?.toLowerCase()
  
  if (['jpg', 'jpeg', 'png', 'gif', 'svg', 'webp'].includes(ext || '')) {
    return Image
  }
  
  if (['js', 'ts', 'tsx', 'jsx', 'py', 'java', 'cs', 'cpp', 'c', 'h', 'php', 'rb', 'go', 'rs', 'swift', 'kt'].includes(ext || '')) {
    return Code
  }
  
  if (['txt', 'md', 'json', 'yaml', 'yml', 'xml', 'html', 'css', 'scss'].includes(ext || '')) {
    return FileText
  }
  
  return File
}

export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i]
}

export const findNodeById = (nodes: TreeNode[], id: string): TreeNode | null => {
  for (const node of nodes) {
    if (node.id === id) {
      return node
    }
    if (node.children) {
      const found = findNodeById(node.children, id)
      if (found) return found
    }
  }
  return null
}

export const updateNodeExpanded = (nodes: TreeNode[], id: string, expanded: boolean): TreeNode[] => {
  return nodes.map(node => {
    if (node.id === id) {
      return { ...node, expanded }
    }
    if (node.children) {
      return { ...node, children: updateNodeExpanded(node.children, id, expanded) }
    }
    return node
  })
}

export interface TreeNode {
  id: string
  name: string
  type: 'file' | 'folder'
  path: string
  children?: TreeNode[]
  size?: number
  fileCount?: number
  selected?: boolean
  expanded?: boolean
}
