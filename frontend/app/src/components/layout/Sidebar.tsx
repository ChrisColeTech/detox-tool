import CollapseButton from '../sidebar/CollapseButton'
import NavigationItems from '../sidebar/NavigationItems'
import SettingsButton from '../sidebar/SettingsButton'

interface SidebarProps {
  activeTab: string
  onTabChange: (tabId: string) => void
  isExpanded: boolean
  onToggleExpanded: () => void
  position: 'left' | 'right'
  onSettingsClick: () => void
  activeTabId?: string | null
  showToggleButton?: boolean
  isSidebarItemVisible?: (itemId: string, defaultVisible: boolean) => boolean
  pinnedItems?: string[]
  onToggleVisibility?: (itemId: string, defaultVisible: boolean) => void
  onTogglePin?: (itemId: string) => void
}

const Sidebar = ({
  activeTab,
  onTabChange,
  isExpanded,
  onToggleExpanded,
  position,
  onSettingsClick,
  activeTabId,
  showToggleButton = true,
  isSidebarItemVisible,
  pinnedItems,
  onToggleVisibility,
  onTogglePin,
}: SidebarProps) => {
  return (
    <div
      className={`w-12 ${
        position === 'left'
          ? 'bg-gradient-to-b from-background to-surface'
          : 'bg-gradient-to-b from-surface to-background'
      } ${position === 'left' ? 'app-border-r' : 'app-border-l'} flex flex-col`}
    >
      {showToggleButton && (
        <CollapseButton isExpanded={isExpanded} position={position} onToggle={onToggleExpanded} />
      )}

      <NavigationItems
        activeTab={activeTab}
        position={position}
        onTabChange={onTabChange}
        isSidebarItemVisible={isSidebarItemVisible}
        pinnedItems={pinnedItems}
        onToggleVisibility={onToggleVisibility}
        onTogglePin={onTogglePin}
      />

      <div className="flex-1" />

      <SettingsButton
        onClick={onSettingsClick}
        isActive={activeTabId === 'settings'}
        position={position}
      />
    </div>
  )
}

export default Sidebar

