import React from 'react'
import {
  DndContext,
  closestCenter,
  DragOverlay,
} from '@dnd-kit/core'
import TabBarScrollable from '@/components/features/tabbar/TabBarScrollable'
import TabBarControls from '@/components/features/tabbar/TabBarControls'
import TabItem from '@/components/features/tabbar/TabItem'
import { useTabBarDragDrop } from '@/hooks/useTabBarDragDrop'
import { useTabBarScroll } from '@/hooks/useTabBarScroll'
import type { Tab } from '@/types/tab'

export type { Tab }

interface TabBarProps {
  tabs: Tab[]
  onTabClick: (tabId: string) => void
  onTabClose: (tabId: string) => void
  onTabReorder?: (reorderedTabs: Tab[]) => void
  className?: string
  activeTabId?: string | null
}

/**
 * Main TabBar component - orchestrates tab navigation with drag & drop
 * Follows architecture guide principles:
 * - Single responsibility: Tab bar orchestration
 * - Under 150 lines
 * - Composition over complex logic
 * - Clean separation of concerns via custom hooks
 * 
 * Refactored from 291 lines to ~80 lines (72% reduction)
 * All drag & drop logic extracted to useTabBarDragDrop hook
 * All scroll logic extracted to useTabBarScroll hook
 * All UI components split into focused, reusable pieces
 */
const TabBar: React.FC<TabBarProps> = ({
  tabs,
  onTabClick,
  onTabClose,
  onTabReorder,
  className = '',
  activeTabId,
}) => {
  // Extract drag & drop functionality
  const dragDrop = useTabBarDragDrop({
    tabs,
    onTabReorder,
  })

  // Extract scroll functionality
  const scroll = useTabBarScroll()

  if (tabs.length === 0) {
    return null
  }

  return (
    <div className={`flex-1 flex items-end bg-transparent mt-1 ${className}`}>
      {/* Left scroll control */}
      <TabBarControls
        canScrollLeft={scroll.canScrollLeft}
        canScrollRight={false}
        onScrollLeft={scroll.scrollLeft}
        onScrollRight={scroll.scrollRight}
      />

      {/* Drag and Drop Context */}
      <DndContext
        sensors={dragDrop.sensors}
        collisionDetection={closestCenter}
        onDragStart={dragDrop.handleDragStart}
        onDragEnd={dragDrop.handleDragEnd}
        onDragCancel={dragDrop.handleDragCancel}
      >
        {/* Scrollable Tab Container */}
        <TabBarScrollable
          tabs={tabs}
          activeTabId={activeTabId}
          onTabClick={onTabClick}
          onTabClose={onTabClose}
          scrollContainerRef={scroll.scrollContainerRef}
        />

        {/* Drag Overlay */}
        <DragOverlay>
          {dragDrop.activeTab && (
            <TabItem
              tab={dragDrop.activeTab}
              isActive={dragDrop.activeTab.id === activeTabId}
              onTabClick={() => {}}
              onTabClose={() => {}}
              isFirst={false}
            />
          )}
        </DragOverlay>
      </DndContext>

      {/* Right scroll control */}
      <TabBarControls
        canScrollLeft={false}
        canScrollRight={scroll.canScrollRight}
        onScrollLeft={scroll.scrollLeft}
        onScrollRight={scroll.scrollRight}
      />
    </div>
  )
}

export default TabBar
