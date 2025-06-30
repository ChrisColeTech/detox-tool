# Detox Tool - Implementation Examples

This document contains detailed code examples and patterns for implementing the detox-tool frontend components following the gold standard architecture.

## 🎯 Component Implementation Patterns

### Page Component Pattern
```tsx
// pages/deobfuscator/DeobfuscatorPage.tsx - < 100 lines
import { Code } from 'lucide-react'
import { DeobfuscatorMain } from '@/components/features/deobfuscator'
import type { NavigationConfig } from '@/types/navigation'

const DeobfuscatorPage = () => {
  return (
    <div className="h-full overflow-y-auto bg-background">
      <DeobfuscatorMain />
    </div>
  )
}

export default DeobfuscatorPage

export const navigationConfig: NavigationConfig = {
  id: 'deobfuscator',
  label: 'Deobfuscator',
  iconComponent: Code,
  showInSidebar: true,
  closable: true,
  order: 1,
}
```

### Panel Component Pattern
```tsx
// pages/deobfuscator/DeobfuscatorPanel.tsx
const DeobfuscatorPanel = () => {
  return (
    <div className="h-full bg-surface p-4">
      <h3 className="text-lg font-semibold text-text mb-4">Tool Options</h3>
      <div className="space-y-4">
        {/* Panel content */}
      </div>
    </div>
  )
}

export default DeobfuscatorPanel
```

## 🔧 Service Implementation Patterns

### Service Class Pattern
```typescript
// services/deobfuscationService.ts
export class DeobfuscationService {
  constructor(
    private platformService: PlatformService,
    private toastService: ToastService
  ) {}

  async processFile(file: File, options: DeobfuscationOptions): Promise<string> {
    try {
      const result = await this.performDeobfuscation(file, options)
      this.toastService.success('Deobfuscation completed')
      return result
    } catch (error) {
      this.toastService.error('Deobfuscation failed', error.message)
      throw error
    }
  }
}
```

### Custom Hook Pattern
```typescript
// hooks/useDeobfuscation.ts
export const useDeobfuscation = () => {
  const [state, setState] = useState({
    result: null,
    loading: false,
    error: null
  })
  
  const deobfuscationService = useService('deobfuscation')
  
  const processFile = useCallback(async (file: File) => {
    setState(prev => ({ ...prev, loading: true, error: null }))
    
    try {
      const result = await deobfuscationService.processFile(file)
      setState({ result, loading: false, error: null })
    } catch (error) {
      setState({ result: null, loading: false, error })
    }
  }, [deobfuscationService])
  
  return { ...state, processFile }
}
```

## 🎨 Theme Implementation Patterns

### Theme Variable Usage
```tsx
// ✅ CORRECT - Theme variables only
<div className="bg-surface hover:bg-surface-hover text-text app-border">
  <button className="bg-accent hover:bg-accent-hover text-text-background">
    Action
  </button>
</div>

// ❌ WRONG - Hardcoded colors
<div className="bg-gray-800 hover:bg-gray-700 text-white border-gray-600">
  <button className="bg-blue-600 hover:bg-blue-700 text-white">
    Action
  </button>
</div>
```

### Enhanced Theme Effects
```tsx
// For Binary Explorer and Cyber Forensics themes
<div className="bg-accent cyberpunk-glow neon-border transition-all duration-300">
  Matrix-style enhanced effects
</div>
```

## ♿ Accessibility Implementation Patterns

### Semantic HTML Structure
```tsx
<main role="main" aria-label="Deobfuscator Tool">
  <header>
    <h1 id="page-title" className="text-2xl font-bold text-text">
      JavaScript Deobfuscator
    </h1>
  </header>
  <section aria-labelledby="controls-heading">
    <h2 id="controls-heading" className="sr-only">Deobfuscation Controls</h2>
    {/* Controls content */}
  </section>
</main>
```

### ARIA Labels and Descriptions
```tsx
<button
  aria-label="Process JavaScript file for deobfuscation"
  aria-describedby="process-description"
  className="bg-accent hover:bg-accent-hover text-text-background px-4 py-2 rounded-md"
>
  Process File
</button>
<div id="process-description" className="sr-only">
  Analyzes and removes obfuscation from JavaScript code
</div>
```

### Keyboard Navigation
```tsx
const handleKeyDown = useCallback((event: React.KeyboardEvent) => {
  switch (event.key) {
    case 'Enter':
    case ' ':
      event.preventDefault()
      handleAction()
      break
    case 'Escape':
      handleCancel()
      break
  }
}, [handleAction, handleCancel])

<div
  role="button"
  tabIndex={0}
  onKeyDown={handleKeyDown}
  className="focus:outline-none focus:ring-2 focus:ring-accent"
>
  Interactive Element
</div>
```

## 🎭 Animation Implementation Patterns

### Reduced Motion Support
```tsx
import { useReducedMotion } from 'framer-motion'

const Component = () => {
  const prefersReducedMotion = useReducedMotion()
  
  const animations = useMemo(() => ({
    initial: prefersReducedMotion ? {} : { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: prefersReducedMotion ? 0 : 0.3 }
  }), [prefersReducedMotion])
  
  return (
    <motion.div
      {...animations}
      className="motion-safe:hover:scale-105 motion-reduce:transform-none"
    >
      Content
    </motion.div>
  )
}
```

## 🔄 Tab Management Patterns

### Tab Drag & Drop
```tsx
// hooks/useTabBarDragDrop.ts
export const useTabBarDragDrop = ({ tabs, onTabReorder }) => {
  const [activeTab, setActiveTab] = useState(null)
  
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor)
  )
  
  const handleDragStart = useCallback((event) => {
    const tab = tabs.find(t => t.id === event.active.id)
    setActiveTab(tab)
  }, [tabs])
  
  const handleDragEnd = useCallback((event) => {
    const { active, over } = event
    
    if (active.id !== over?.id) {
      const oldIndex = tabs.findIndex(t => t.id === active.id)
      const newIndex = tabs.findIndex(t => t.id === over.id)
      
      onTabReorder(arrayMove(tabs, oldIndex, newIndex))
    }
    
    setActiveTab(null)
  }, [tabs, onTabReorder])
  
  return {
    sensors,
    activeTab,
    handleDragStart,
    handleDragEnd,
    handleDragCancel: () => setActiveTab(null)
  }
}
```

## 🔍 Search Implementation Patterns

### Spotlight Search
```tsx
// components/search/SpotlightSearch.tsx
const SpotlightSearch = ({ isOpen, onClose, onNavigate }) => {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  
  const searchService = useService('search')
  
  useEffect(() => {
    if (query.trim()) {
      searchService.search(query).then(setResults)
    } else {
      setResults([])
    }
  }, [query, searchService])
  
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="bg-surface app-border rounded-lg p-4">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search..."
          className="w-full bg-background text-text border-none outline-none"
        />
        <div className="mt-4 space-y-2">
          {results.map(result => (
            <SearchResultItem
              key={result.id}
              result={result}
              onSelect={() => {
                onNavigate(result.id)
                onClose()
              }}
            />
          ))}
        </div>
      </div>
    </Modal>
  )
}
```

## 📱 Responsive Design Patterns

### Mobile-First Approach
```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
  <div className="p-4 md:p-6 lg:p-8">
    <h3 className="text-base md:text-lg lg:text-xl">Responsive Title</h3>
  </div>
</div>
```

## 🎯 Error Handling Patterns

### Error Boundaries
```tsx
// components/ui/ErrorBoundary.tsx
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }
  
  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }
  
  componentDidCatch(error, errorInfo) {
    console.error('Component error:', error, errorInfo)
  }
  
  render() {
    if (this.state.hasError) {
      return (
        <div className="bg-surface app-border p-6 text-center">
          <h3 className="text-lg font-semibold text-text mb-2">
            Something went wrong
          </h3>
          <p className="text-text-muted mb-4">
            This component encountered an error
          </p>
          <button
            onClick={() => this.setState({ hasError: false, error: null })}
            className="bg-accent hover:bg-accent-hover text-text-background px-4 py-2 rounded-md"
          >
            Try Again
          </button>
        </div>
      )
    }
    
    return this.props.children
  }
}
```

## 📋 Form Implementation Patterns

### Settings Form
```tsx
// components/features/settings/Settings.tsx
const Settings = () => {
  const { settings, updateSetting } = useSettings()
  
  return (
    <div className="space-y-6">
      <SettingsSection title="Appearance">
        <ThemeSelector
          value={settings.theme}
          onChange={(theme) => updateSetting('theme', theme)}
        />
      </SettingsSection>
      
      <SettingsSection title="Behavior">
        <ToggleSwitch
          label="Show Status Bar"
          checked={settings.showStatusBar}
          onChange={(checked) => updateSetting('showStatusBar', checked)}
        />
      </SettingsSection>
    </div>
  )
}
```

## 🔌 Platform Integration Patterns

### Electron vs Browser Detection
```tsx
// services/platformService.ts
export const getPlatformService = (): PlatformService => {
  return window.electronAPI ? electronService : browserService
}

// Usage in components
const Component = () => {
  const platformService = usePlatform()
  
  const handleSaveFile = useCallback(async () => {
    if (platformService.isElectron()) {
      await platformService.saveFile(content, filename)
    } else {
      // Browser fallback
      downloadFile(content, filename)
    }
  }, [platformService, content, filename])
}
```

---

**These patterns ensure consistent implementation across all 30 phases while maintaining the gold standard architecture requirements.**