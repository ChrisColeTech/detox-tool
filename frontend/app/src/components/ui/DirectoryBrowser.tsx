import React, { useState } from 'react'
import {
  Folder,
  FolderOpen,
  File,
  ChevronRight,
  ChevronDown,
  Home,
  Search,
  ArrowLeft,
  ArrowUp,
  MoreHorizontal
} from 'lucide-react'
import { Button } from '@/components/ui/Button'

interface DirectoryItem {
  name: string
  path: string
  type: 'folder' | 'file'
  children?: DirectoryItem[]
  expanded?: boolean
}

interface DirectoryBrowserProps {
  selectedPath?: string
  onSelectDirectory: () => void
  className?: string
}

/**
 * Professional directory browser that mimics VS Code file explorer
 * Shows hierarchical folder structure with navigation
 */
const DirectoryBrowser: React.FC<DirectoryBrowserProps> = ({
  selectedPath,
  onSelectDirectory,
  className = ''
}) => {
  const [currentPath, setCurrentPath] = useState('/')
  const [searchTerm, setSearchTerm] = useState('')
  
  // Mock directory structure
  const mockDirectories: DirectoryItem[] = [
    {
      name: 'Users',
      path: '/Users',
      type: 'folder',
      expanded: true,
      children: [
        {
          name: 'username',
          path: '/Users/username',
          type: 'folder',
          expanded: true,
          children: [
            { name: 'Desktop', path: '/Users/username/Desktop', type: 'folder' },
            { name: 'Documents', path: '/Users/username/Documents', type: 'folder' },
            { name: 'Downloads', path: '/Users/username/Downloads', type: 'folder' },
            { name: 'Projects', path: '/Users/username/Projects', type: 'folder' }
          ]
        }
      ]
    },
    {
      name: 'Applications',
      path: '/Applications',
      type: 'folder'
    },
    {
      name: 'System',
      path: '/System', 
      type: 'folder'
    }
  ]

  const quickAccess = [
    { name: 'Desktop', path: '/Users/username/Desktop', icon: Folder },
    { name: 'Documents', path: '/Users/username/Documents', icon: Folder },
    { name: 'Downloads', path: '/Users/username/Downloads', icon: Folder },
    { name: 'Projects', path: '/Users/username/Projects', icon: Folder }
  ]

  const breadcrumbParts = currentPath.split('/').filter(Boolean)

  const renderDirectoryTree = (items: DirectoryItem[], level = 0) => {
    return items.map((item, index) => (
      <div key={index} className="select-none">
        <div 
          className={`flex items-center gap-1 py-1 px-2 hover:bg-surface-hover cursor-pointer rounded group ${
            selectedPath === item.path ? 'bg-accent/20 text-accent' : 'text-text'
          }`}
          style={{ paddingLeft: `${8 + level * 16}px` }}
          onClick={() => item.type === 'folder' && setCurrentPath(item.path)}
        >
          {item.type === 'folder' && (
            <button className="p-0.5 hover:bg-surface rounded">
              {item.expanded ? (
                <ChevronDown className="w-3 h-3" />
              ) : (
                <ChevronRight className="w-3 h-3" />
              )}
            </button>
          )}
          {item.type === 'folder' ? (
            item.expanded ? (
              <FolderOpen className="w-4 h-4 text-accent" />
            ) : (
              <Folder className="w-4 h-4 text-accent" />
            )
          ) : (
            <File className="w-4 h-4 text-text-muted" />
          )}
          <span className="text-sm truncate">{item.name}</span>
        </div>
        {item.expanded && item.children && (
          <div>
            {renderDirectoryTree(item.children, level + 1)}
          </div>
        )}
      </div>
    ))
  }

  return (
    <div className={`flex h-80 app-border rounded-lg overflow-hidden bg-surface ${className}`}>
      {/* Sidebar */}
      <div className="w-48 bg-background app-border-r flex flex-col">
        {/* Quick Access */}
        <div className="p-3 app-border-b">
          <p className="text-xs font-medium text-text-muted uppercase tracking-wide mb-2">
            Quick Access
          </p>
          <div className="space-y-1">
            {quickAccess.map((item, index) => (
              <button
                key={index}
                className="flex items-center gap-2 w-full p-1.5 rounded hover:bg-surface text-left"
                onClick={() => setCurrentPath(item.path)}
              >
                <item.icon className="w-4 h-4 text-accent" />
                <span className="text-sm text-text truncate">{item.name}</span>
              </button>
            ))}
          </div>
        </div>
        
        {/* Directory Tree */}
        <div className="flex-1 overflow-auto p-2">
          <div className="space-y-0.5">
            {renderDirectoryTree(mockDirectories)}
          </div>
        </div>
      </div>

      {/* Main Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-surface to-background p-3 app-border-b">
          {/* Navigation */}
          <div className="flex items-center gap-2 mb-2">
            <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
              <ArrowLeft className="w-3 h-3" />
            </Button>
            <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
              <ArrowUp className="w-3 h-3" />
            </Button>
            <div className="h-4 w-px bg-border mx-1" />
            
            {/* Breadcrumb */}
            <div className="flex items-center gap-1 flex-1 text-sm">
              <Home className="w-4 h-4 text-text-muted" />
              {breadcrumbParts.map((part, index) => (
                <React.Fragment key={index}>
                  <ChevronRight className="w-3 h-3 text-text-muted" />
                  <button 
                    className="text-text hover:text-accent"
                    onClick={() => setCurrentPath('/' + breadcrumbParts.slice(0, index + 1).join('/'))}
                  >
                    {part}
                  </button>
                </React.Fragment>
              ))}
            </div>
            
            <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
              <MoreHorizontal className="w-3 h-3" />
            </Button>
          </div>
          
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-3 h-3 text-text-muted" />
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full h-7 pl-7 pr-3 text-sm bg-background app-border rounded focus:outline-none focus:ring-1 focus:ring-accent"
            />
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 p-3">
          {selectedPath ? (
            <div className="text-center space-y-3">
              <div className="p-4 bg-accent/10 app-border rounded-lg">
                <FolderOpen className="w-8 h-8 text-accent mx-auto mb-2" />
                <p className="text-sm font-medium text-text">Directory Selected</p>
                <p className="text-xs text-text-muted font-mono">{selectedPath}</p>
              </div>
              <Button onClick={onSelectDirectory} variant="primary" size="sm">
                Use This Directory
              </Button>
            </div>
          ) : (
            <div className="text-center text-text-muted py-8">
              <Folder className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p className="text-sm">Navigate to a directory and click to select</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default DirectoryBrowser
