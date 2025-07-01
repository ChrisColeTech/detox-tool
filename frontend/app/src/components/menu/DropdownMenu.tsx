import { useState, useRef, useEffect } from 'react'
import MenuItem, { type MenuItemType } from './MenuItem'
import Submenu from './Submenu'

interface DropdownMenuProps {
  onClose: () => void
}

const DropdownMenu = ({ onClose }: DropdownMenuProps) => {
  const [activeSubmenu, setActiveSubmenu] = useState<string | null>(null)
  const timeoutRef = useRef<number | null>(null)

  const handleMouseEnter = (itemId: string) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }
    setActiveSubmenu(itemId)
  }

  const handleMouseLeave = () => {
    timeoutRef.current = window.setTimeout(() => {
      setActiveSubmenu(null)
    }, 200)
  }

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  const handleMenuItemClick = (item: MenuItemType) => {
    if (item.type === 'separator' || item.hasSubmenu) return
    onClose()
  }

  const menuItems = [
    {
      id: 'file',
      label: 'File',
      hasSubmenu: true,
      submenuItems: [
        { id: 'new', label: 'New File', shortcut: 'Ctrl+N' },
        { id: 'open', label: 'Open File...', shortcut: 'Ctrl+O' },
        { id: 'save', label: 'Save', shortcut: 'Ctrl+S' },
        { id: 'save-as', label: 'Save As...', shortcut: 'Ctrl+Shift+S' },
        { type: 'separator' as const },
        { id: 'recent', label: 'Open Recent', hasSubmenu: true }, // This submenu would need further definition or handling
        { type: 'separator' as const },
        { id: 'exit', label: 'Exit', shortcut: 'Alt+F4' },
      ],
    },
    {
      id: 'edit',
      label: 'Edit',
      hasSubmenu: true,
      submenuItems: [
        { id: 'undo', label: 'Undo', shortcut: 'Ctrl+Z' },
        { id: 'redo', label: 'Redo', shortcut: 'Ctrl+Y' },
        { type: 'separator' as const },
        { id: 'cut', label: 'Cut', shortcut: 'Ctrl+X' },
        { id: 'copy', label: 'Copy', shortcut: 'Ctrl+C' },
        { id: 'paste', label: 'Paste', shortcut: 'Ctrl+V' },
        { type: 'separator' as const },
        { id: 'find', label: 'Find', shortcut: 'Ctrl+F' },
        { id: 'replace', label: 'Replace', shortcut: 'Ctrl+H' },
      ],
    },
    {
      id: 'view',
      label: 'View',
      hasSubmenu: true,
      submenuItems: [
        { id: 'command-palette', label: 'Command Palette...', shortcut: 'Ctrl+Shift+P' },
        { type: 'separator' as const },
        { id: 'explorer', label: 'Explorer', shortcut: 'Ctrl+Shift+E' },
        { id: 'search', label: 'Search', shortcut: 'Ctrl+Shift+F' },
        { id: 'extensions', label: 'Extensions', shortcut: 'Ctrl+Shift+X' },
        { type: 'separator' as const },
        { id: 'terminal', label: 'Terminal', shortcut: 'Ctrl+`' },
      ],
    },
    {
      id: 'help',
      label: 'Help',
      hasSubmenu: true,
      submenuItems: [
        { id: '', label: 'Documentation' },
        { id: 'shortcuts', label: 'Keyboard Shortcuts', shortcut: 'Ctrl+K Ctrl+S' },
        { type: 'separator' as const },
        { id: 'about', label: 'About AI Editor' },
      ],
    },
  ]

  return (
    <div className="absolute top-full left-0 z-20 bg-surface app-border shadow-theme py-1 min-w-48">
      {menuItems.map((item) => (
        <div
          key={item.id}
          className="relative"
          onMouseEnter={() => item.hasSubmenu && handleMouseEnter(item.id)}
          onMouseLeave={handleMouseLeave}
        >
          <MenuItem
            item={item}
            onMouseEnter={() => {}}
            onMouseLeave={() => {}}
            onClick={handleMenuItemClick}
          />
          {activeSubmenu === item.id && item.submenuItems && (
            <Submenu items={item.submenuItems} onClose={onClose} />
          )}
        </div>
      ))}
    </div>
  )
}

export default DropdownMenu

