import { useState, useCallback } from 'react'
import {
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  type DragStartEvent,
  type DragEndEvent,
} from '@dnd-kit/core'
import { arrayMove } from '@dnd-kit/sortable'
import type { Tab } from '@/types/tab'

interface UseTabBarDragDropParams {
  tabs: Tab[]
  onTabReorder?: (reorderedTabs: Tab[]) => void
}

/**
 * Custom hook for managing TabBar drag and drop functionality
 * Follows architecture guide principles:
 * - Single responsibility: Drag & drop state management
 * - Clean separation from UI logic
 * - Encapsulates complex dnd-kit integration
 */
export const useTabBarDragDrop = ({
  tabs,
  onTabReorder,
}: UseTabBarDragDropParams) => {
  const [activeTab, setActiveTab] = useState<Tab | null>(null)

  // Configure sensors for drag & drop
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor)
  )

  const handleDragStart = useCallback((event: DragStartEvent) => {
    const { active } = event
    const activeTabData = tabs.find(tab => tab.id === active.id)
    setActiveTab(activeTabData || null)
  }, [tabs])

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event

    if (active.id !== over?.id) {
      const oldIndex = tabs.findIndex(tab => tab.id === active.id)
      const newIndex = tabs.findIndex(tab => tab.id === over?.id)

      if (oldIndex !== -1 && newIndex !== -1) {
        const reorderedTabs = arrayMove(tabs, oldIndex, newIndex)
        onTabReorder?.(reorderedTabs)
      }
    }

    setActiveTab(null)
  }, [tabs, onTabReorder])

  const handleDragCancel = useCallback(() => {
    setActiveTab(null)
  }, [])

  return {
    // State
    activeTab,
    
    // Sensors and handlers
    sensors,
    handleDragStart,
    handleDragEnd,
    handleDragCancel,
    
    // Derived state
    isDragging: !!activeTab,
  }
}
