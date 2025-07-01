import { Settings } from 'lucide-react'

const SettingsPanel = () => {
  return (
    <div className="h-full overflow-y-auto">
      {/* Panel Header */}
      <div className="sticky top-0 bg-gradient-to-r from-surface to-background border-b border-border px-4 py-3 z-10">
        <div className="flex items-center gap-2">
          <div className="page-icon">
            <Settings size={16} className="text-text" />
          </div>
          <h3 className="font-medium text-text">Settings Control</h3>
        </div>
        <p className="text-xs text-text-muted mt-1">Quick actions & insights</p>
      </div>
    </div>
  )
}

export default SettingsPanel

