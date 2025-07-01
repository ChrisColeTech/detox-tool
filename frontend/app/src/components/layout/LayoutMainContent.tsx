import React from 'react'
import WelcomePage from '@/pages/WelcomePage'
import SettingsPage from '@/pages/settings/SettingsPage'
import { getPageComponent } from '@/config/navigationConfig'
import type { Tab } from '@/types/tab'
import type { AppSettings } from '@/hooks/useSettings'

interface LayoutMainContentProps {
  tabs: Tab[]
  activeTabId: string | null
  settings: AppSettings
  updateSetting: (key: string, value: any) => void
  isSidebarItemVisible: (id: string, defaultVisible?: boolean) => boolean
}

/**
 * Component responsible for rendering the main content area
 * Handles page routing and special cases
 */
const LayoutMainContent: React.FC<LayoutMainContentProps> = ({
  tabs,
  activeTabId,
  settings,
  updateSetting,
  isSidebarItemVisible,
}) => {
  const renderContent = () => {
    // Show welcome page if no tabs are open
    if (tabs.length === 0) {
      return <WelcomePage />
    }

    // If no active tab or active tab no longer exists
    if (!activeTabId || !tabs.some(t => t.id === activeTabId)) {
      return null
    }

    // Special case for settings (needs props)
    if (activeTabId === 'settings') {
      return (
        <SettingsPage
          settings={settings}
          onSettingChange={updateSetting as any}
          isSidebarItemVisible={(id: string) => isSidebarItemVisible(id, true)}
        />
      )
    }

    // Auto-discover page component
    const PageComponent = getPageComponent(activeTabId)
    return PageComponent ? <PageComponent /> : null
  }

  return renderContent()
}

export default LayoutMainContent
