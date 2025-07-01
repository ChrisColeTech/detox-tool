import React from 'react'
import { ChevronRight } from 'lucide-react'

export type RegularMenuItem = {
  id: string
  label: string
  hasSubmenu?: boolean
  shortcut?: string
  disabled?: boolean
  icon?: React.ReactNode
  action?: () => void
  type?: undefined
  submenuItems?: MenuItemType[]
}

export type SeparatorMenuItem = {
  type: 'separator'
  id?: string
  label?: never
  hasSubmenu?: never
  shortcut?: never
  disabled?: never
  icon?: never
  action?: never
  submenuItems?: never
}

export type MenuItemType = RegularMenuItem | SeparatorMenuItem

interface MenuItemProps {
  item: MenuItemType
  onMouseEnter?: () => void
  onMouseLeave?: () => void
  onClick: (item: MenuItemType) => void // Pass the item back on click
  className?: string
}

const MenuItem = ({ item, onMouseEnter, onMouseLeave, onClick, className }: MenuItemProps) => {
  const handleClick = (e: React.MouseEvent | React.KeyboardEvent) => {
    e.stopPropagation()
    if (item.type === 'separator' || item.disabled) return

    if (item.type !== 'separator' && item.action) {
      item.action()
    }
    onClick(item)
  }

  if (item.type === 'separator') {
    return <div className="my-1 h-px bg-border mx-2" key={item.id || Math.random()} />
  }

  // For regular menu items
  return (
    <div
      role="menuitem"
      tabIndex={item.disabled ? -1 : 0} // Disable tabbing if item is disabled
      className={`flex items-center justify-between px-3 py-1.5 text-base text-text ${
        item.disabled
          ? 'text-text-disabled cursor-not-allowed'
          : 'hover:bg-surface-hover hover:text-accent cursor-pointer focus:bg-surface-hover focus:text-accent focus:outline-none'
      } ${className || ''}`.trim()}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onClick={handleClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          handleClick(e)
        }
      }}
      aria-disabled={item.disabled}
      aria-haspopup={item.hasSubmenu}
    >
      <div className="flex items-center gap-2">
        {item.icon && (
          <span className="menu-item-icon w-4 h-4 flex items-center justify-center [&_svg]:stroke-1">
            {item.icon}
          </span>
        )}
        <span>{item.label}</span>
      </div>
      <div className="flex items-center space-x-2">
        {item.shortcut && <span className="text-sm text-text-muted">{item.shortcut}</span>}
        {item.hasSubmenu && (
          <div className="submenu-indicator [&_svg]:stroke-1">
            <ChevronRight size={14} className="text-text-muted" />
          </div>
        )}
      </div>
    </div>
  )
}

export default MenuItem

