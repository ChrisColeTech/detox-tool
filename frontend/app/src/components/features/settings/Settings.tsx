import React from 'react'
import AppearanceSettings from './AppearanceSettings'
import SidebarManagement from './SidebarManagement'
import type { AppSettings } from '@/hooks/useSettings'

interface SettingsProps {
  settings: AppSettings
  onSettingChange: <K extends keyof AppSettings>(key: K, value: AppSettings[K]) => void
  isSidebarItemVisible: (itemId: string, defaultVisible: boolean) => boolean
  onToggleVisibility: (itemId: string) => void
  onTogglePin: (itemId: string) => void
}

/**
 * Main Settings component - orchestrates the settings feature
 * Follows architecture guide principles:
 * - Single responsibility: Settings feature orchestration
 * - Under 150 lines
 * - Composition over complex logic
 * - Clean separation of concerns
 */
const Settings: React.FC<SettingsProps> = ({
  settings,
  onSettingChange,
  isSidebarItemVisible,
  onToggleVisibility,
  onTogglePin,
}) => {
  return (
    <div className="space-y-8">
      {/* Appearance Section */}
      <AppearanceSettings
        settings={settings}
        onSettingChange={onSettingChange}
      />

      {/* Sidebar Management Section */}
      <SidebarManagement
        isSidebarItemVisible={isSidebarItemVisible}
        pinnedSidebarItems={settings.pinnedSidebarItems}
        onToggleVisibility={onToggleVisibility}
        onTogglePin={onTogglePin}
      />
    </div>
  )
}

export default Settings
