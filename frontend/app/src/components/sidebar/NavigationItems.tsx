import { getSidebarItems, getSidebarIcon } from '../../config/navigationConfig'
import NavItem from './NavItem'

interface NavigationItemsProps {
  activeTab: string
  position: 'left' | 'right'
  onTabChange: (tabId: string) => void
  isSidebarItemVisible?: (itemId: string, defaultVisible: boolean) => boolean
  pinnedItems?: string[]
  onToggleVisibility?: (itemId: string, defaultVisible: boolean) => void
  onTogglePin?: (itemId: string) => void
}

const NavigationItems = ({
  activeTab,
  position,
  onTabChange,
  isSidebarItemVisible = () => true,
  pinnedItems = [],
  onToggleVisibility,
  onTogglePin,
}: NavigationItemsProps) => {
  const sidebarNavItems = getSidebarItems()

  // Filter items based on user visibility preferences (items already filtered by showInSidebar)
  const visibleNavItems = sidebarNavItems.filter((item) => {
    const defaultVisibility = item.defaultVisible ?? true
    return isSidebarItemVisible(item.id, defaultVisibility)
  })

  // Sort items: pinned items first, then regular items by order
  const sortedNavItems = [...visibleNavItems].sort((a, b) => {
    const aIsPinned = pinnedItems.includes(a.id)
    const bIsPinned = pinnedItems.includes(b.id)

    if (aIsPinned && !bIsPinned) return -1
    if (!aIsPinned && bIsPinned) return 1

    return (a.order || 999) - (b.order || 999)
  })

  const navItems = sortedNavItems

  return (
    <>
      {navItems.map((item) => (
        <NavItem
          key={item.id}
          id={item.id}
          label={item.label}
          icon={getSidebarIcon(item.id)}
          isActive={activeTab === item.id}
          position={position}
          onClick={() => onTabChange(item.id)}
          isVisible={isSidebarItemVisible(item.id, item.defaultVisible ?? item.showInSidebar)}
          isPinned={pinnedItems.includes(item.id)}
          onToggleVisibility={onToggleVisibility}
          onTogglePin={onTogglePin}
        />
      ))}
    </>
  )
}

export default NavigationItems

