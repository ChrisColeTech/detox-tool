import React from 'react'
import { Menu, Eye, EyeOff, RotateCcw } from 'lucide-react'
import { motion, useReducedMotion } from 'framer-motion'
import { Switch } from '@/components/ui/switch'
import { useSidebarManagement, type SidebarItem } from '@/hooks/useSidebarManagement'

interface SidebarManagementProps {
  isSidebarItemVisible: (itemId: string, defaultVisible: boolean) => boolean
  pinnedSidebarItems: string[]
  onToggleVisibility: (itemId: string) => void
  onTogglePin: (itemId: string) => void
}

/**
 * Component for managing sidebar items visibility and pinning
 * Follows architecture guide principles:
 * - Single responsibility: Sidebar management UI
 * - Under 200 lines
 * - Clean props interface
 * - Uses custom hook for logic
 * - Feature card pattern compliance
 */
const SidebarManagement: React.FC<SidebarManagementProps> = ({
  isSidebarItemVisible,
  pinnedSidebarItems,
  onToggleVisibility,
  onTogglePin,
}) => {
  const sidebarManagement = useSidebarManagement({
    isSidebarItemVisible,
    pinnedSidebarItems,
    onToggleVisibility,
    onTogglePin,
  })
  
  const prefersReducedMotion = useReducedMotion()

  const cardVariants = {
    initial: prefersReducedMotion ? {} : { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: prefersReducedMotion ? { duration: 0 } : { duration: 0.3 }
  }

  const SidebarItemRow: React.FC<{ item: SidebarItem }> = ({ item }) => (
    <div className="flex items-center justify-between p-3 app-border rounded-md bg-surface hover:bg-surface-hover transition-colors">
      <div className="flex items-center gap-3">
        {item.icon && <div className="w-4 h-4">{item.icon}</div>}
        <span className="text-sm font-medium text-text">{item.label}</span>
        {item.pinned && (
          <span className="px-2 py-1 bg-accent/10 text-accent text-xs rounded">Pinned</span>
        )}
      </div>
      
      <div className="flex items-center gap-2">
        <Switch
          checked={item.visible}
          onCheckedChange={() => onToggleVisibility(item.id)}
        />
        <button
          onClick={() => onTogglePin(item.id)}
          className={`p-1 rounded transition-colors ${
            item.pinned 
              ? 'text-accent hover:text-accent-hover' 
              : 'text-text-muted hover:text-accent'
          }`}
          title={item.pinned ? 'Unpin item' : 'Pin item'}
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>
    </div>
  )

  return (
    <motion.article
      variants={cardVariants}
      initial="initial"
      animate="animate"
      className="bg-surface app-border overflow-hidden transition-all duration-300 group motion-safe:hover:shadow-theme motion-safe:hover:scale-[1.02]"
      aria-labelledby="sidebar-management-title"
      role="region"
    >
      {/* Feature Card Header */}
      <div className="bg-gradient-to-r from-surface to-background px-6 py-4 app-border-b">
        <div className="flex items-center gap-3">
          <div className="page-icon transition-transform duration-300 motion-safe:group-hover:scale-110" role="img" aria-hidden="true">
            <Menu className="w-6 h-6 text-accent motion-safe:group-hover:text-accent-hover transition-colors" />
          </div>
          <h2 id="sidebar-management-title" className="text-xl font-semibold text-text">
            Sidebar Management
          </h2>
        </div>
      </div>
      
      {/* Feature Card Content */}
      <div className="p-6 space-y-6">

      {/* Statistics */}
      <div className="grid grid-cols-4 gap-4">
        <div className="text-center p-3 bg-surface app-border rounded-md">
          <div className="text-lg font-bold text-text">{sidebarManagement.stats.total}</div>
          <div className="text-xs text-text-muted">Total</div>
        </div>
        <div className="text-center p-3 bg-surface app-border rounded-md">
          <div className="text-lg font-bold text-accent">{sidebarManagement.stats.visible}</div>
          <div className="text-xs text-text-muted">Visible</div>
        </div>
        <div className="text-center p-3 bg-surface app-border rounded-md">
          <div className="text-lg font-bold text-text-muted">{sidebarManagement.stats.hidden}</div>
          <div className="text-xs text-text-muted">Hidden</div>
        </div>
        <div className="text-center p-3 bg-surface app-border rounded-md">
          <div className="text-lg font-bold text-accent">{sidebarManagement.stats.pinned}</div>
          <div className="text-xs text-text-muted">Pinned</div>
        </div>
      </div>

      {/* Visible Items */}
      {sidebarManagement.visibleItems.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Eye className="w-4 h-4 text-accent" />
            <h4 className="font-semibold text-text">Visible Items</h4>
            <span className="text-sm text-text-muted">({sidebarManagement.visibleItems.length})</span>
          </div>
          
          <div className="space-y-2">
            {sidebarManagement.visibleItems.map((item) => (
              <SidebarItemRow key={item.id} item={item} />
            ))}
          </div>
        </div>
      )}

      {/* Hidden Items */}
      {sidebarManagement.hiddenItems.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <EyeOff className="w-4 h-4 text-text-muted" />
            <h4 className="font-semibold text-text">Hidden Items</h4>
            <span className="text-sm text-text-muted">({sidebarManagement.hiddenItems.length})</span>
          </div>
          
          <div className="space-y-2">
            {sidebarManagement.hiddenItems.map((item) => (
              <SidebarItemRow key={item.id} item={item} />
            ))}
          </div>
        </div>
      )}

        {/* Help Text */}
        <div className="p-3 bg-surface app-border rounded-md">
          <p className="text-sm text-text-muted">
            Toggle visibility to show or hide sidebar items. Pin items to keep them at the top of the sidebar.
          </p>
        </div>
      </div>
    </motion.article>
  )
}

export default SidebarManagement
