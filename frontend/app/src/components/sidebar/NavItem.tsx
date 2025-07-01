import React from 'react'

interface NavItemProps {
  id: string
  label: string
  icon: React.ReactNode
  isActive: boolean
  position: 'left' | 'right'
  onClick: () => void
  isVisible?: boolean
  isPinned?: boolean
  onToggleVisibility?: (itemId: string, defaultVisible: boolean) => void
  onTogglePin?: (itemId: string) => void
}

const NavItem = ({ label, icon, isActive, position, onClick }: NavItemProps) => {
  return (
    <div
      onClick={onClick}
      className={`h-12 flex items-center justify-center text-text-muted hover:text-text hover:bg-surface-hover transition-colors relative cursor-pointer ${
        isActive ? 'text-text bg-surface-hover font-semibold' : 'font-normal'
      }`}
      title={label}
    >
      {isActive && (
        <div
          className={`absolute top-0 bottom-0 w-0.5 bg-accent ${
            position === 'left' ? 'left-0' : 'right-0'
          }`}
        />
      )}
      <div className={`sidebar-icon ${isActive ? 'stroke-1' : '[&_svg]:stroke-1'}`}>{icon}</div>
    </div>
  )
}

export default NavItem

