const StatusBar = () => {
  return (
    <div className="flex items-center justify-between bg-gradient-to-r from-background to-surface text-text-muted h-6 px-3 text-xs app-border-t">
      <div className="flex items-center space-x-4">
        <span>Ready</span>
        <div className="w-px h-3 separator" aria-hidden="true"></div>
        <span>v1.0.0</span>
      </div>

      <div className="flex items-center space-x-4">
        <span>UTF-8</span>
      </div>
    </div>
  )
}

export default StatusBar

