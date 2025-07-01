import React from 'react'
import { VscLayoutSidebarLeft, VscLayoutSidebarRight } from 'react-icons/vsc'
import { Sun, Moon, Search } from 'lucide-react'
import type { AppSettings } from '../../hooks/useSettings'

interface AppControlsProps {
  sidebarPosition: AppSettings['sidebarPosition']
  onToggleSidebarPosition: () => void
  theme: AppSettings['theme']
  onToggleTheme: () => void
  onOpenSearch: () => void
  className?: string
}

const AppControls = ({
  sidebarPosition,
  onToggleSidebarPosition,
  theme,
  onToggleTheme,
  onOpenSearch,
  className,
}: AppControlsProps) => {
  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>, action: () => void) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      action()
    }
  }

  return (
    <div
      className={`flex items-center ${className || ''}`}
      style={{ WebkitAppRegion: 'no-drag' } as React.CSSProperties}
    >
      <div
        role="button"
        tabIndex={0}
        onClick={onOpenSearch}
        onKeyDown={(e) => handleKeyDown(e, onOpenSearch)}
        className="w-12 h-8 flex items-center justify-center text-text-muted hover:text-text hover:bg-surface-hover focus:bg-surface-hover focus:text-text focus:outline-none transition-colors cursor-default"
        title="Search features and pages (Ctrl+F)"
        aria-label="Open search dialog"
      >
        <div className="tab-icon [&_svg]:stroke-1">
          <Search size={14} />
        </div>
      </div>

      <div
        role="button"
        tabIndex={0}
        onClick={onToggleSidebarPosition}
        onKeyDown={(e) => handleKeyDown(e, onToggleSidebarPosition)}
        className="w-12 h-8 flex items-center justify-center text-text-muted hover:text-text hover:bg-surface-hover focus:bg-surface-hover focus:text-text focus:outline-none transition-colors cursor-default"
        title={`Move sidebar to ${sidebarPosition === 'left' ? 'right' : 'left'}`}
        aria-label={`Move sidebar to ${sidebarPosition === 'left' ? 'right' : 'left'}`}
      >
        <div className="tab-icon [&_svg]:stroke-1">
          {sidebarPosition === 'left' ? (
            <VscLayoutSidebarRight size={14} />
          ) : (
            <VscLayoutSidebarLeft size={14} />
          )}
        </div>
      </div>

      <div
        role="button"
        tabIndex={0}
        onClick={onToggleTheme}
        onKeyDown={(e) => handleKeyDown(e, onToggleTheme)}
        className="w-12 h-8 flex items-center justify-center text-text-muted hover:text-text hover:bg-surface-hover focus:bg-surface-hover focus:text-text focus:outline-none transition-colors cursor-default"
        title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
        aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
      >
        <div className="tab-icon [&_svg]:stroke-1">
          {theme === 'dark' ? <Sun size={14} /> : <Moon size={14} />}
        </div>
      </div>

      <div className="w-px h-4 bg-border" aria-hidden="true"></div>
    </div>
  )
}

export default AppControls

