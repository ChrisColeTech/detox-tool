import React from 'react'
import {
  SortableContext,
  horizontalListSortingStrategy,
} from '@dnd-kit/sortable'
import TabItem from './TabItem'
import type { Tab } from '@/types/tab'

interface TabBarScrollableProps {
  tabs: Tab[]
  activeTabId?: string | null
  onTabClick: (tabId: string) => void
  onTabClose: (tabId: string) => void
  scrollContainerRef: React.RefObject<HTMLDivElement | null>
}

/**
 * Component for scrollable tab container with sortable support
 * Follows architecture guide principles:
 * - Single responsibility: Scrollable tab container
 * - Under 150 lines
 * - Clean props interface
 * - Encapsulates dnd-kit sortable context
 */
const TabBarScrollable: React.FC<TabBarScrollableProps> = ({
  tabs,
  activeTabId,
  onTabClick,
  onTabClose,
  scrollContainerRef,
}) => {
  return (
    <div
      ref={scrollContainerRef}
      className="flex-1 overflow-x-auto overflow-y-hidden scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent"
      style={{ scrollbarWidth: 'thin' }}
    >
      <SortableContext items={tabs.map(tab => tab.id)} strategy={horizontalListSortingStrategy}>
        <div className="flex h-full min-w-max">
          {tabs.map((tab, index) => (
            <TabItem
              key={tab.id}
              tab={tab}
              isActive={tab.id === activeTabId}
              onTabClick={onTabClick}
              onTabClose={onTabClose}
              isFirst={index === 0}
            />
          ))}
        </div>
      </SortableContext>
    </div>
  )
}

export default TabBarScrollable
