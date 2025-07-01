import { useState, useRef } from 'react'
import MenuItem, { type MenuItemType } from './MenuItem'

interface SubmenuProps {
  items: MenuItemType[]
  onClose: (item?: MenuItemType) => void
  className?: string
  onMouseEnter?: (e: React.MouseEvent) => void
  onMouseLeave?: (e: React.MouseEvent) => void
}

const Submenu = ({ items, onClose, className, onMouseEnter, onMouseLeave }: SubmenuProps) => {
  const [activeNestedSubmenu, setActiveNestedSubmenu] = useState<string | null>(null)
  const nestedTimeoutRef = useRef<number | null>(null)

  const handleItemMouseEnter = (item: MenuItemType) => {
    if (item.type !== 'separator' && item.hasSubmenu) {
      if (nestedTimeoutRef.current) {
        clearTimeout(nestedTimeoutRef.current)
      }
      setActiveNestedSubmenu(item.id)
    } else {
      if (nestedTimeoutRef.current) clearTimeout(nestedTimeoutRef.current)
      setActiveNestedSubmenu(null)
    }
  }

  const handleItemMouseLeave = (item: MenuItemType) => {
    if (item.type !== 'separator' && item.hasSubmenu) {
      nestedTimeoutRef.current = window.setTimeout(() => {
        setActiveNestedSubmenu(null)
      }, 200)
    }
  }

  const handleSubmenuMouseEnter = () => {
    if (nestedTimeoutRef.current) {
      clearTimeout(nestedTimeoutRef.current)
    }
  }

  const handleItemClick = (item: MenuItemType) => {
    if (item.type === 'separator' || item.disabled) return

    if (!item.hasSubmenu) {
      onClose(item)
    }
  }

  return (
    <div
      role="menu"
      className={`absolute top-0 left-full -ml-px bg-surface border border-border shadow-lg min-w-48 z-30 ${
        className || ''
      }`.trim()}
      onMouseEnter={(e) => {
        onMouseEnter?.(e)
        handleSubmenuMouseEnter()
      }}
      onMouseLeave={onMouseLeave}
    >
      {items.map((item) => (
        <div
          key={item.type === 'separator' ? `sep-${item.id || Math.random()}` : item.id}
          className="relative"
          onMouseEnter={() => handleItemMouseEnter(item)}
          onMouseLeave={() => handleItemMouseLeave(item)}
        >
          <MenuItem item={item} onClick={() => handleItemClick(item)} />
          {item.type !== 'separator' &&
            item.hasSubmenu &&
            activeNestedSubmenu === item.id &&
            item.submenuItems && (
              <Submenu
                items={item.submenuItems}
                onClose={onClose}
                onMouseEnter={handleSubmenuMouseEnter}
              />
            )}
        </div>
      ))}
    </div>
  )
}

export default Submenu

