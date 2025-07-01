import React, { useState, useEffect } from 'react'
import {
  VscChromeMinimize,
  VscChromeMaximize,
  VscChromeRestore,
  VscChromeClose,
} from 'react-icons/vsc'
import { usePlatform } from '../../hooks/usePlatform'

interface WindowControlsProps {
  className?: string
}

const WindowControls = ({ className }: WindowControlsProps) => {
  const platformService = usePlatform()
  const [isMaximized, setIsMaximized] = useState(false)

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>, action: () => void) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      action()
    }
  }

  useEffect(() => {
    if (platformService.isElectron()) {
      const unsubscribe = platformService.onWindowStateChange(({ isMaximized: maximized }) => {
        setIsMaximized(maximized)
      })

      // Get initial state
      platformService
        .isMaximized()
        .then((maximized) => setIsMaximized(maximized))
        .catch((error) => {
          console.error('WindowControls: Failed to get initial window state:', error)
        })

      return unsubscribe
    } else {
      setIsMaximized(false)
      return () => {}
    }
  }, [platformService])

  const handleMinimize = () => {
    if (platformService.isElectron()) {
      platformService.minimizeWindow()
    } else {
      console.log('Minimize requested (browser environment)')
    }
  }

  const handleMaximizeToggle = async () => {
    if (platformService.isElectron()) {
      await platformService.maximizeWindow()
      // State is updated via onWindowStateChange listener
    } else {
      console.log('Maximize/Restore requested (browser environment)')
      setIsMaximized(!isMaximized)
    }
  }

  const handleClose = () => {
    if (platformService.isElectron()) {
      platformService.closeWindow()
    } else {
      console.log('Close requested (browser environment)')
      platformService.closeWindow()
    }
  }

  const maximizeLabel = isMaximized ? 'Restore' : 'Maximize'
  const MaximizeIcon = isMaximized ? VscChromeRestore : VscChromeMaximize

  return (
    <div
      className={`flex items-center ${className || ''}`}
      style={{ WebkitAppRegion: 'no-drag' } as React.CSSProperties}
    >
      <div
        role="button"
        tabIndex={0}
        onClick={handleMinimize}
        onKeyDown={(e) => handleKeyDown(e, handleMinimize)}
        className="w-12 h-8 flex items-center justify-center text-text-muted hover:text-text hover:bg-surface-hover focus:bg-surface-hover focus:text-text focus:outline-none transition-colors cursor-default"
        aria-label="Minimize"
        title="Minimize"
      >
        <div className="tab-icon [&_svg]:stroke-1">
          <VscChromeMinimize size={12} />
        </div>
      </div>
      <div
        role="button"
        tabIndex={0}
        onClick={handleMaximizeToggle}
        onKeyDown={(e) => handleKeyDown(e, handleMaximizeToggle)}
        className="w-12 h-8 flex items-center justify-center text-text-muted hover:text-text hover:bg-surface-hover focus:bg-surface-hover focus:text-text focus:outline-none transition-colors cursor-default"
        aria-label={maximizeLabel}
        title={maximizeLabel}
      >
        <div className="tab-icon [&_svg]:stroke-1">
          <MaximizeIcon size={12} />
        </div>
      </div>
      <div
        role="button"
        tabIndex={0}
        onClick={handleClose}
        onKeyDown={(e) => handleKeyDown(e, handleClose)}
        className="w-12 h-8 flex items-center justify-center text-text-muted hover:text-text hover:bg-surface-hover focus:bg-surface-hover focus:text-text focus:outline-none transition-colors cursor-default"
        aria-label="Close"
        title="Close"
      >
        <div className="tab-icon [&_svg]:stroke-1">
          <VscChromeClose size={12} />
        </div>
      </div>
    </div>
  )
}

export default WindowControls

