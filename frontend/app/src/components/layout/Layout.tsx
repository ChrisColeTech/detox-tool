import React from 'react'
import TitleBar from '@/components/layout/TitleBar'
import StatusBar from '@/components/layout/StatusBar'
import LayoutMainContent from '@/components/layout/LayoutMainContent'
import LayoutSidebar from '@/components/layout/LayoutSidebar'
import SpotlightSearch from '@/components/search/SpotlightSearch'
import { ToastContainer } from '@/components/ui/Toast'
import ErrorBanner from '@/components/ui/ErrorBanner'
import { useLayoutState } from '@/hooks/useLayoutState'
import { useLayoutServices } from '@/hooks/useLayoutServices'
import { useLayoutKeyboard } from '@/hooks/useLayoutKeyboard'
import { useLayoutEffects } from '@/hooks/useLayoutEffects'

/**
 * Main Layout component - orchestrates the application layout
 * Follows architecture guide principles:
 * - Single responsibility: Layout orchestration only
 * - Composition over complex logic
 * - Separation of concerns via custom hooks
 * - Under 100 lines as per page component guidelines
 */
const Layout = (): React.ReactElement => {
  // Extract all state management to custom hook
  const layoutState = useLayoutState()
  
  // Extract service coordination to custom hook
  const layoutServices = useLayoutServices({
    addTab: layoutState.addTab,
    removeTab: layoutState.removeTab,
    setActiveTabInHook: layoutState.setActiveTabInHook,
    updateSetting: layoutState.updateSetting,
    success: layoutState.success,
    reorderTabs: layoutState.reorderTabs,
  })

  // Extract keyboard shortcuts to custom hook
  useLayoutKeyboard({
    onOpenSearch: layoutState.handleOpenSearch,
  })

  // Extract layout effects to custom hook
  useLayoutEffects({
    activeTabId: layoutState.activeTabId,
    activeTab: layoutState.activeTab,
    updateSetting: layoutState.updateSetting,
    currentTabHasPanel: layoutState.currentTabHasPanel,
    isExpanded: layoutState.isExpanded,
  })

  return (
    <div className={layoutState.cssClasses}>
      <TitleBar
        sidebarPosition={layoutState.settings.sidebarPosition}
        onToggleSidebarPosition={layoutState.handleToggleSidebarPosition}
        theme={layoutState.settings.theme}
        onToggleTheme={layoutState.handleToggleTheme}
        onOpenSearch={layoutState.handleOpenSearch}
        tabs={layoutState.tabsWithIcons}
        onTabClick={layoutServices.handleTabClick}
        onTabClose={layoutServices.handleTabClose}
        onTabReorder={layoutServices.handleTabReorder}
        activeTabId={layoutState.activeTabId}
      />

      <div className="flex-1 flex min-h-0">
        {layoutState.settings.sidebarPosition === 'left' && (
          <LayoutSidebar
            settings={layoutState.settings}
            activeTab={layoutState.activeTab}
            activeTabId={layoutState.activeTabId}
            isExpanded={layoutState.isExpanded}
            currentTabHasPanel={layoutState.currentTabHasPanel}
            pinnedItems={layoutState.settings.pinnedSidebarItems}
            onTabChange={layoutServices.handleTabChange}
            onToggleExpanded={layoutState.handleToggleExpanded}
            onSettingsClick={layoutServices.handleSettingsClick}
            isSidebarItemVisible={layoutState.isSidebarItemVisible}
            onToggleVisibility={layoutState.toggleSidebarItemVisibility}
            onTogglePin={layoutState.toggleSidebarItemPin}
          />
        )}

        <main className="flex-1 bg-background overflow-hidden">
          <div className="h-full flex flex-col">
            <ErrorBanner />
            <div className="flex-1 overflow-hidden">
              <LayoutMainContent
                tabs={layoutState.tabs}
                activeTabId={layoutState.activeTabId}
                settings={layoutState.settings}
                updateSetting={layoutState.updateSetting}
                isSidebarItemVisible={layoutState.isSidebarItemVisible}
              />
            </div>
          </div>
        </main>

        {layoutState.settings.sidebarPosition === 'right' && (
          <LayoutSidebar
            settings={layoutState.settings}
            activeTab={layoutState.activeTab}
            activeTabId={layoutState.activeTabId}
            isExpanded={layoutState.isExpanded}
            currentTabHasPanel={layoutState.currentTabHasPanel}
            pinnedItems={layoutState.settings.pinnedSidebarItems}
            onTabChange={layoutServices.handleTabChange}
            onToggleExpanded={layoutState.handleToggleExpanded}
            onSettingsClick={layoutServices.handleSettingsClick}
            isSidebarItemVisible={layoutState.isSidebarItemVisible}
            onToggleVisibility={layoutState.toggleSidebarItemVisibility}
            onTogglePin={layoutState.toggleSidebarItemPin}
          />
        )}
      </div>

      {layoutState.settings.showStatusBar && <StatusBar />}
      
      {/* Spotlight Search */}
      <SpotlightSearch 
        isOpen={layoutState.isSearchOpen}
        onClose={layoutState.handleCloseSearch}
        onNavigate={layoutServices.handleSearchNavigate}
      />
      
      {/* Toast notifications */}
      <ToastContainer 
        toasts={layoutState.toasts} 
        onDismiss={layoutState.dismissToast}
        position="bottom-right"
        bottomOffset={layoutState.settings.showStatusBar ? "bottom-10" : "bottom-4"}
      />
    </div>
  )
}

export default Layout

