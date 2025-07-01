import { useState } from 'react'
import { Menu } from 'lucide-react'
import DropdownMenu from './DropdownMenu'

const MenuButton = () => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="relative">
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="w-12 h-8 flex items-center justify-center text-text-muted hover:text-text hover:bg-surface-hover transition-colors cursor-pointer"
        title="Application menu"
      >
        <div className="tab-icon [&_svg]:stroke-1">
          <Menu size={12} />
        </div>
      </div>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
          <DropdownMenu onClose={() => setIsOpen(false)} />
        </>
      )}
    </div>
  )
}

export default MenuButton

