import { Settings as SettingsIcon } from 'lucide-react'

interface SettingsButtonProps {
  onClick: () => void
  isActive: boolean
  position: 'left' | 'right'
}

const SettingsButton = ({ onClick, isActive, position }: SettingsButtonProps) => {
  const handleClick = () => {
    onClick()
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      console.log('SettingsButton: key down detected:', e.key)
      onClick()
    }
  }

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      className={`h-12 w-12 flex items-center justify-center text-text-muted transition-colors relative cursor-pointer hover:text-text hover:bg-surface-hover focus:outline-none focus:bg-surface-hover focus:text-text ${
        isActive ? 'text-text bg-surface-hover font-semibold' : 'font-normal'
      }`.trim()}
      title="Settings"
      aria-label="Settings"
      aria-current={isActive ? 'page' : undefined}
    >
      {isActive && (
        <div
          className={`absolute top-1/2 -translate-y-1/2 h-6 w-0.5 bg-accent ${
            position === 'left' ? 'left-0.5' : 'right-0.5'
          }`.trim()}
          aria-hidden="true"
        />
      )}
      <div className="tab-icon [&_svg]:stroke-1">
        <SettingsIcon size={16} />
      </div>
    </div>
  )
}

export default SettingsButton

