import React from 'react'
import MenuButton from '@/components/menu/MenuButton'
import AppControls from '@/components/titlebar/AppControls'
import WindowControls from '@/components/titlebar/WindowControls'
import TabBar from '@/components/titlebar/TabBar'
import { usePlatform } from '@/hooks/usePlatform'
import type { AppSettings } from '@/hooks/useSettings'
import type { Tab } from '@/types/tab'

interface TitleBarProps {
  sidebarPosition: AppSettings['sidebarPosition']
  onToggleSidebarPosition: () => void
  theme: AppSettings['theme']
  onToggleTheme: () => void
  onOpenSearch: () => void
  tabs: Tab[]
  onTabClick: (tabId: string) => void
  onTabClose: (tabId: string) => void
  onTabReorder: (newTabs: Tab[]) => void // Made required
  activeTabId?: string | null
  className?: string
}

const TitleBar = ({
  sidebarPosition,
  onToggleSidebarPosition,
  theme,
  onToggleTheme,
  onOpenSearch,
  tabs,
  onTabClick,
  onTabClose,
  onTabReorder,
  activeTabId,
  className,
}: TitleBarProps) => {
  const platformService = usePlatform()

  const handleDoubleClick = () => {
    if (platformService.isElectron()) {
      platformService.maximizeWindow()
    }
  }

  return (
    <header
      className={`flex items-stretch bg-gradient-to-r from-background to-surface text-text h-9 select-none shrink-0 app-border-b relative ${
        className || ''
      }`}
      style={{ WebkitAppRegion: 'drag' } as React.CSSProperties}
      onDoubleClick={handleDoubleClick}
    >
      <div style={{ WebkitAppRegion: 'no-drag' } as React.CSSProperties}>
        <MenuButton />
      </div>

      <TabBar
        tabs={tabs}
        onTabClick={onTabClick}
        onTabClose={onTabClose}
        onTabReorder={onTabReorder}
        activeTabId={activeTabId}
      />

      {tabs.length > 0 && <div className="w-px h-4 separator mx-1 self-center" aria-hidden="true"></div>}

      <div
        className="flex items-center ml-auto"
        style={{ WebkitAppRegion: 'no-drag' } as React.CSSProperties}
      >
        <AppControls
          sidebarPosition={sidebarPosition}
          onToggleSidebarPosition={onToggleSidebarPosition}
          theme={theme}
          onToggleTheme={onToggleTheme}
          onOpenSearch={onOpenSearch}
        />
        <WindowControls />
      </div>
    </header>
  )
}

export default TitleBar

