import React from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { X } from 'lucide-react'
import type { Tab } from '@/types/tab'

interface TabItemProps {
  tab: Tab
  isActive: boolean
  onTabClick: (tabId: string) => void
  onTabClose: (tabId: string) => void
  isFirst?: boolean
}

/**
 * Component for individual tab item with drag and drop support
 * Follows architecture guide principles:
 * - Single responsibility: Individual tab rendering
 * - Under 150 lines
 * - Clean props interface
 * - Encapsulates dnd-kit sortable logic
 */
const TabItem: React.FC<TabItemProps> = ({
  tab,
  isActive,
  onTabClick,
  onTabClose,
  isFirst = false,
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: tab.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    borderTop: isActive ? '2px solid var(--accent)' : '2px solid transparent',
  }

  const handleTabClose = (e: React.MouseEvent) => {
    e.stopPropagation()
    onTabClose(tab.id)
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`flex items-center gap-2 px-4 py-1 min-w-0 max-w-48 app-border-r cursor-pointer group relative transition-colors h-full ${
        !isFirst ? 'app-border-l' : ''
      } ${
        isActive
          ? 'bg-background text-text active-tab-break'
          : 'bg-surface-hover text-text-muted hover:bg-surface hover:text-text'
      }`}
      onClick={() => onTabClick(tab.id)}
      role="tab"
      aria-selected={isActive}
      tabIndex={isActive ? 0 : -1}
    >
      {/* Tab Icon */}
      {tab.icon && (
        <div className="w-4 h-4 flex-shrink-0">
          {tab.icon}
        </div>
      )}
      
      {/* Tab Label */}
      <span className="truncate text-sm font-medium">
        {tab.label}
      </span>
      
      {/* Close Button */}
      {tab.closable && (
        <button
          onClick={handleTabClose}
          className={`flex-shrink-0 w-4 h-4 flex items-center justify-center rounded hover:bg-black/10 dark:hover:bg-white/10 transition-colors ${
            isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
          }`}
          aria-label={`Close ${tab.label} tab`}
          tabIndex={-1}
        >
          <X className="w-3 h-3" />
        </button>
      )}
    </div>
  )
}

export default TabItem
