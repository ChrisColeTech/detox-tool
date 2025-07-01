import React, { useState, useCallback } from 'react'
import { GripVertical, Folder, File } from 'lucide-react'

export interface DragDropItem {
  id: string
  name: string
  type: 'file' | 'directory'
  path: string
  children?: DragDropItem[]
  isExpanded?: boolean
  order: number
  groupId?: string
}

export interface DragDropGroup {
  id: string
  name: string
  items: DragDropItem[]
  order: number
  enabled: boolean
}

interface DragDropListProps {
  items: DragDropItem[]
  groups: DragDropGroup[]
  onItemsReorder: (items: DragDropItem[]) => void
  onGroupsReorder: (groups: DragDropGroup[]) => void
  onGroupToggle: (groupId: string, enabled: boolean) => void
  onGroupRename: (groupId: string, name: string) => void
  maxHeight?: string
  className?: string
}

export const DragDropList: React.FC<DragDropListProps> = ({
  items,
  groups,
  onItemsReorder,
  onGroupsReorder,
  onGroupToggle,
  onGroupRename,
  maxHeight = '400px',
  className = '',
}) => {
  const [draggedItem, setDraggedItem] = useState<string | null>(null)
  const [draggedGroup, setDraggedGroup] = useState<string | null>(null)
  const [dragOverTarget, setDragOverTarget] = useState<string | null>(null)
  const [editingGroup, setEditingGroup] = useState<string | null>(null)
  const [editingName, setEditingName] = useState('')

  const handleItemDragStart = useCallback((e: React.DragEvent, itemId: string) => {
    setDraggedItem(itemId)
    e.dataTransfer.effectAllowed = 'move'
  }, [])

  const handleGroupDragStart = useCallback((e: React.DragEvent, groupId: string) => {
    setDraggedGroup(groupId)
    e.dataTransfer.effectAllowed = 'move'
  }, [])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }, [])

  const handleItemDragEnter = useCallback((e: React.DragEvent, targetId: string) => {
    e.preventDefault()
    if (draggedItem && draggedItem !== targetId) {
      setDragOverTarget(targetId)
    }
  }, [draggedItem])

  const handleGroupDragEnter = useCallback((e: React.DragEvent, targetId: string) => {
    e.preventDefault()
    if (draggedGroup && draggedGroup !== targetId) {
      setDragOverTarget(targetId)
    }
  }, [draggedGroup])

  const handleItemDrop = useCallback((e: React.DragEvent, targetId: string) => {
    e.preventDefault()
    if (!draggedItem || draggedItem === targetId) return

    const newItems = [...items]
    const draggedIndex = newItems.findIndex(item => item.id === draggedItem)
    const targetIndex = newItems.findIndex(item => item.id === targetId)

    if (draggedIndex !== -1 && targetIndex !== -1) {
      const [draggedItemObj] = newItems.splice(draggedIndex, 1)
      newItems.splice(targetIndex, 0, draggedItemObj)
      
      // Update order values
      newItems.forEach((item, index) => {
        item.order = index
      })
      
      onItemsReorder(newItems)
    }

    setDraggedItem(null)
    setDragOverTarget(null)
  }, [items, draggedItem, onItemsReorder])

  const handleGroupDrop = useCallback((e: React.DragEvent, targetId: string) => {
    e.preventDefault()
    if (!draggedGroup || draggedGroup === targetId) return

    const newGroups = [...groups]
    const draggedIndex = newGroups.findIndex(group => group.id === draggedGroup)
    const targetIndex = newGroups.findIndex(group => group.id === targetId)

    if (draggedIndex !== -1 && targetIndex !== -1) {
      const [draggedGroupObj] = newGroups.splice(draggedIndex, 1)
      newGroups.splice(targetIndex, 0, draggedGroupObj)
      
      // Update order values
      newGroups.forEach((group, index) => {
        group.order = index
      })
      
      onGroupsReorder(newGroups)
    }

    setDraggedGroup(null)
    setDragOverTarget(null)
  }, [groups, draggedGroup, onGroupsReorder])

  const handleDragEnd = useCallback(() => {
    setDraggedItem(null)
    setDraggedGroup(null)
    setDragOverTarget(null)
  }, [])

  const startGroupEdit = useCallback((group: DragDropGroup) => {
    setEditingGroup(group.id)
    setEditingName(group.name)
  }, [])

  const handleGroupNameSubmit = useCallback(() => {
    if (editingGroup && editingName.trim()) {
      onGroupRename(editingGroup, editingName.trim())
    }
    setEditingGroup(null)
    setEditingName('')
  }, [editingGroup, editingName, onGroupRename])

  const handleGroupNameKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleGroupNameSubmit()
    } else if (e.key === 'Escape') {
      setEditingGroup(null)
      setEditingName('')
    }
  }, [handleGroupNameSubmit])

  const renderItem = (item: DragDropItem) => (
    <div
      key={item.id}
      draggable
      onDragStart={(e) => handleItemDragStart(e, item.id)}
      onDragOver={handleDragOver}
      onDragEnter={(e) => handleItemDragEnter(e, item.id)}
      onDrop={(e) => handleItemDrop(e, item.id)}
      onDragEnd={handleDragEnd}
      className={`
        flex items-center gap-2 p-2 rounded border transition-colors cursor-move
        ${draggedItem === item.id ? 'opacity-50' : ''}
        ${dragOverTarget === item.id ? 'border-accent bg-accent/10' : 'border-border hover:bg-surface-hover'}
      `}
    >
      <GripVertical className="w-4 h-4 text-text-muted" />
      {item.type === 'directory' ? (
        <Folder className="w-4 h-4 text-accent" />
      ) : (
        <File className="w-4 h-4 text-text-muted" />
      )}
      <span className="text-sm text-text flex-1 min-w-0 truncate">{item.name}</span>
    </div>
  )

  const renderGroup = (group: DragDropGroup) => (
    <div
      key={group.id}
      className={`border border-border rounded-lg ${group.enabled ? 'bg-surface' : 'bg-surface-hover opacity-60'}`}
    >
      <div
        draggable
        onDragStart={(e) => handleGroupDragStart(e, group.id)}
        onDragOver={handleDragOver}
        onDragEnter={(e) => handleGroupDragEnter(e, group.id)}
        onDrop={(e) => handleGroupDrop(e, group.id)}
        onDragEnd={handleDragEnd}
        className={`
          flex items-center gap-2 p-3 rounded-t-lg cursor-move transition-colors
          ${draggedGroup === group.id ? 'opacity-50' : ''}
          ${dragOverTarget === group.id ? 'border-accent bg-accent/10' : 'hover:bg-surface-hover'}
        `}
      >
        <GripVertical className="w-4 h-4 text-text-muted" />
        <input
          type="checkbox"
          checked={group.enabled}
          onChange={(e) => onGroupToggle(group.id, e.target.checked)}
          className="rounded border-border"
        />
        
        {editingGroup === group.id ? (
          <input
            type="text"
            value={editingName}
            onChange={(e) => setEditingName(e.target.value)}
            onBlur={handleGroupNameSubmit}
            onKeyDown={handleGroupNameKeyDown}
            className="flex-1 px-2 py-1 text-sm bg-input-bg border border-border rounded text-text"
            autoFocus
          />
        ) : (
          <span
            className="flex-1 text-sm font-medium text-text cursor-pointer"
            onDoubleClick={() => startGroupEdit(group)}
          >
            {group.name}
          </span>
        )}
        
        <span className="text-xs text-text-muted">
          {group.items.length} items
        </span>
      </div>
      
      {group.enabled && (
        <div className="p-2 space-y-1">
          {group.items.map(renderItem)}
        </div>
      )}
    </div>
  )

  return (
    <div className={`space-y-4 ${className}`} style={{ maxHeight, overflowY: 'auto' }}>
      {/* Ungrouped Items */}
      {items.filter(item => !item.groupId).length > 0 && (
        <div>
          <h4 className="text-sm font-medium text-text-muted mb-2">Ungrouped Files</h4>
          <div className="space-y-1">
            {items
              .filter(item => !item.groupId)
              .sort((a, b) => a.order - b.order)
              .map(renderItem)}
          </div>
        </div>
      )}

      {/* Groups */}
      {groups
        .sort((a, b) => a.order - b.order)
        .map(renderGroup)}
    </div>
  )
}

export default DragDropList
