import { ChevronsLeft, ChevronsRight } from 'lucide-react'

interface CollapseButtonProps {
  isExpanded: boolean
  position: 'left' | 'right'
  onToggle: () => void
}

const CollapseButton = ({ isExpanded, position, onToggle }: CollapseButtonProps) => {
  const getIcon = () => {
    if (isExpanded) {
      return position === 'left' ? <ChevronsLeft size={18} /> : <ChevronsRight size={18} />
    } else {
      return position === 'left' ? <ChevronsRight size={18} /> : <ChevronsLeft size={18} />
    }
  }

  return (
    <div
      onClick={onToggle}
      className="h-8 flex items-center justify-center text-text-muted hover:text-text hover:bg-surface-hover transition-colors cursor-pointer"
      title={isExpanded ? 'Collapse sidebar' : 'Expand sidebar'}
    >
      <div className="sidebar-icon [&_svg]:stroke-1">{getIcon()}</div>
    </div>
  )
}

export default CollapseButton

