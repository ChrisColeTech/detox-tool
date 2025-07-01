import React, { useMemo } from 'react'
import Sidebar from '@/components/layout/Sidebar'
import SidePanel from '@/components/layout/SidePanel'
import type { AppSettings } from '@/hooks/useSettings'

interface LayoutSidebarProps {
  settings: AppSettings
  activeTab: string
  activeTabId: string | null
  isExpanded: boolean
  currentTabHasPanel: boolean
  pinnedItems: string[]
  onTabChange: (tabId: string) => void
  onToggleExpanded: () => void
  onSettingsClick: () => void
  isSidebarItemVisible: (id: string, defaultVisible?: boolean) => boolean
  onToggleVisibility: (id: string) => void
  onTogglePin: (id: string) => void
}

/**
 * Component responsible for rendering the sidebar and side panel
 * Handles positioning and composition of sidebar elements
 */
const LayoutSidebar: React.FC<LayoutSidebarProps> = ({
  settings,
  activeTab,
  activeTabId,
  isExpanded,
  currentTabHasPanel,
  pinnedItems,
  onTabChange,
  onToggleExpanded,
  onSettingsClick,
  isSidebarItemVisible,
  onToggleVisibility,
  onTogglePin,
}) => {
  const sidebarElements = useMemo(() => {
    const sidebarComponent = (
      <Sidebar
        activeTab={activeTab}
        onTabChange={onTabChange}
        isExpanded={isExpanded}
        onToggleExpanded={onToggleExpanded}
        position={settings.sidebarPosition}
        onSettingsClick={onSettingsClick}
        activeTabId={activeTabId}
        showToggleButton={currentTabHasPanel}
        isSidebarItemVisible={isSidebarItemVisible}
        pinnedItems={pinnedItems}
        onToggleVisibility={onToggleVisibility}
        onTogglePin={onTogglePin}
      />
    )

    const panelComponent = (
      <SidePanel
        activeTab={activeTab}
        isVisible={isExpanded}
        theme={settings.theme}
        sidebarPosition={settings.sidebarPosition}
      />
    )

    return settings.sidebarPosition === 'left' ? (
      <>
        {sidebarComponent}
        {panelComponent}
      </>
    ) : (
      <>
        {panelComponent}
        {sidebarComponent}
      </>
    )
  }, [
    settings.sidebarPosition,
    settings.theme,
    activeTab,
    onTabChange,
    isExpanded,
    onToggleExpanded,
    onSettingsClick,
    activeTabId,
    currentTabHasPanel,
    isSidebarItemVisible,
    pinnedItems,
    onToggleVisibility,
    onTogglePin,
  ])

  return <>{sidebarElements}</>
}

export default LayoutSidebar
