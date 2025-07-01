import { getPanelComponent } from '@/config/navigationConfig'
import type { AppSettings } from '@/hooks/useSettings'

interface SidePanelProps {
  activeTab: string
  isVisible: boolean
  theme: AppSettings['theme']
  sidebarPosition: AppSettings['sidebarPosition']
  className?: string
}

const SidePanel = ({
  activeTab,
  isVisible,
  // theme, // theme prop is not used in the provided sample
  sidebarPosition,
  className,
}: SidePanelProps) => {
  const PanelComponent = getPanelComponent(activeTab)

  if (!isVisible || !PanelComponent) {
    return null
  }

  // Panel border should be on the side opposite to sidebar
  const borderClass = sidebarPosition === 'left' ? 'app-border-r' : 'app-border-l'

  return (
    <div
      className={`w-64 bg-surface ${borderClass} ${className || ''}`}
      aria-label={`${activeTab} details panel`}
    >
      <PanelComponent />
    </div>
  )
}

export default SidePanel

