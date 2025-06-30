# Detox Tool - Component Architecture Gold Standard

## 🧩 MANDATORY Component Architecture for All Components

This document establishes the **definitive component patterns** that ALL components in the detox-tool must follow. Based on proven task-writer architecture and modern React best practices, this standard ensures maintainability, reusability, and professional code quality.

## 🎯 Component Size Limits (STRICTLY ENFORCED)

### **Component Type Limits**
```tsx
// ✅ CORRECT - Respect size limits
Page Components:    < 100 lines  // Orchestration only
Feature Components: < 150 lines  // Business logic components  
Layout Components:  < 80 lines   // Layout orchestration
UI Components:      < 100 lines  // Pure rendering components
Hook Files:         < 150 lines  // Custom hook implementations
Service Files:      < 200 lines  // Business logic services
```

### **Size Limit Enforcement**
```tsx
// ✅ CORRECT - Under limit, focused responsibility
const DeobfuscatorPage = () => {
  const state = useDeobfuscatorState()
  const services = useDeobfuscatorServices()
  
  return (
    <div className="h-full overflow-y-auto p-6">
      <DeobfuscatorHeader />
      <DeobfuscatorMain state={state} services={services} />
    </div>
  )
} // ~15 lines - orchestration only

// ❌ WRONG - Over limit, multiple responsibilities
const DeobfuscatorPage = () => {
  const [code, setCode] = useState('')
  const [result, setResult] = useState('')
  const [loading, setLoading] = useState(false)
  // ... 150+ lines of mixed logic
}
```

## 🏗️ Component Architecture Patterns

### **Hook-Based Architecture (REQUIRED)**
```tsx
// ✅ CORRECT - Extract all logic to hooks
const FeaturePage = () => {
  const state = useFeatureState()
  const services = useFeatureServices()
  const animations = useFeatureAnimations()
  const keyboard = useFeatureKeyboard()
  
  return (
    <motion.div {...animations.containerVariants}>
      <FeatureHeader {...state.headerProps} />
      <FeatureMain {...state.mainProps} {...services} />
    </motion.div>
  )
}

// Custom hooks contain all logic
export const useFeatureState = () => {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  
  // All state management logic here
  return { data, loading, headerProps, mainProps }
}
```

### **Service Layer Integration (REQUIRED)**
```tsx
// ✅ CORRECT - Services handle all business logic
const useFeatureServices = () => {
  const deobfuscationService = useService('deobfuscation')
  const fileService = useService('file')
  const toastService = useService('toast')
  
  const processFile = useCallback(async (file: File) => {
    try {
      const result = await deobfuscationService.process(file)
      toastService.success('Processing complete')
      return result
    } catch (error) {
      toastService.error('Processing failed', error.message)
    }
  }, [deobfuscationService, toastService])
  
  return { processFile }
}

// ❌ WRONG - Business logic in component
const Component = () => {
  const handleProcess = async () => {
    try {
      const response = await fetch('/api/process', {
        method: 'POST',
        body: formData
      })
      // Direct API calls in component
    } catch (error) {
      // Error handling in component
    }
  }
}
```

### **Composition Over Inheritance (REQUIRED)**
```tsx
// ✅ CORRECT - Compose complex components from simple ones
const DeobfuscatorMain = ({ state, services }) => (
  <div className="space-y-6">
    <DeobfuscatorControls {...state.controlsProps} {...services} />
    <DeobfuscatorEditor {...state.editorProps} />
    <DeobfuscatorResults {...state.resultsProps} />
  </div>
)

// Each subcomponent has single responsibility
const DeobfuscatorControls = ({ options, onProcess, onClear }) => (
  <div className="bg-surface app-border p-4">
    <OptionsPanel options={options} />
    <ActionButtons onProcess={onProcess} onClear={onClear} />
  </div>
)

// ❌ WRONG - Monolithic component with multiple responsibilities
const DeobfuscatorMain = () => {
  // 200+ lines handling controls, editor, results, state management
}
```

## 🎨 Styling Architecture

### **Theme Variable Usage (MANDATORY)**
```tsx
// ✅ CORRECT - Only theme variables
className="bg-surface hover:bg-surface-hover text-text app-border"
className="bg-accent hover:bg-accent-hover text-text-background"

// Enhanced effects for special themes
className="bg-surface cyberpunk-glow neon-border"

// ❌ WRONG - Hardcoded colors
className="bg-gray-800 hover:bg-gray-700 text-white border-gray-600"
className="bg-blue-600 hover:bg-blue-700"
```

### **Responsive Design Patterns (REQUIRED)**
```tsx
// ✅ CORRECT - Mobile-first responsive
className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
className="text-sm md:text-base lg:text-lg"
className="p-4 md:p-6 lg:p-8"

// ✅ CORRECT - Responsive visibility
className="hidden md:block"         // Desktop only
className="block md:hidden"         // Mobile only
className="md:col-span-2"           // Responsive spans
```

### **Animation Standards (REQUIRED)**
```tsx
// ✅ CORRECT - Reduced motion support
const prefersReducedMotion = useReducedMotion()

const animations = useMemo(() => ({
  container: {
    initial: prefersReducedMotion ? {} : { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: prefersReducedMotion ? 0 : 0.3 }
  }
}), [prefersReducedMotion])

// ✅ CORRECT - Motion-safe classes
className="motion-safe:hover:scale-105 motion-reduce:transform-none"

// ❌ WRONG - Forced animations
className="animate-bounce hover:scale-110"
```

## ♿ Accessibility Standards

### **Semantic HTML (MANDATORY)**
```tsx
// ✅ CORRECT - Semantic structure
<article aria-labelledby="feature-title">
  <header>
    <h2 id="feature-title">Feature Name</h2>
  </header>
  <section aria-describedby="feature-description">
    <p id="feature-description">Feature description</p>
  </section>
  <footer>
    <button type="button" aria-label="Process files">
      Process
    </button>
  </footer>
</article>

// ❌ WRONG - Generic divs
<div>
  <div>Feature Name</div>
  <div>Feature description</div>
  <div onClick={handleClick}>Process</div>
</div>
```

### **Keyboard Navigation (REQUIRED)**
```tsx
// ✅ CORRECT - Full keyboard support
const useKeyboardNavigation = () => {
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
      case 'ArrowDown':
        focusNext()
        break
      case 'ArrowUp':
        focusPrevious()
        break
    }
  }, [])
  
  return { handleKeyDown }
}

// ✅ CORRECT - Focus management
const { focusRef, focusNext, focusPrevious } = useFocusManagement()
```

### **Screen Reader Support (REQUIRED)**
```tsx
// ✅ CORRECT - Screen reader announcements
const [announcement, setAnnouncement] = useState('')

<div role="status" aria-live="polite" aria-atomic="true" className="sr-only">
  {announcement}
</div>

// Update announcements for user actions
const handleAction = useCallback(() => {
  setAnnouncement(`Processing ${fileName}`)
  // Action logic
}, [fileName])

// ✅ CORRECT - Comprehensive ARIA labels
<button
  aria-label="Deobfuscate JavaScript file"
  aria-describedby="deobfuscate-description"
  aria-pressed={isProcessing}
>
  {isProcessing ? 'Processing...' : 'Deobfuscate'}
</button>
<div id="deobfuscate-description" className="sr-only">
  Removes obfuscation from JavaScript code to make it readable
</div>
```

## 🔧 TypeScript Standards

### **Interface Definitions (REQUIRED)**
```tsx
// ✅ CORRECT - Comprehensive interfaces
interface DeobfuscatorState {
  code: string
  result: string | null
  loading: boolean
  error: string | null
  options: DeobfuscationOptions
}

interface DeobfuscationOptions {
  removeComments: boolean
  prettifyCode: boolean
  renameVariables: boolean
  analyzeSecurity: boolean
}

interface DeobfuscatorServices {
  processCode: (code: string, options: DeobfuscationOptions) => Promise<string>
  clearResults: () => void
  exportResults: (format: 'txt' | 'js') => void
}

// ❌ WRONG - Any types or missing interfaces
const handleProcess = (data: any) => {
  // No type safety
}
```

### **Generic Types (REQUIRED)**
```tsx
// ✅ CORRECT - Proper generic usage
interface ApiResponse<T> {
  data: T
  success: boolean
  error?: string
}

interface ServiceHook<T, S> {
  state: T
  services: S
  loading: boolean
  error: string | null
}

// Component with generic props
interface DataTableProps<T> {
  data: T[]
  columns: TableColumn<T>[]
  onRowClick: (row: T) => void
}
```

### **Event Handlers (REQUIRED)**
```tsx
// ✅ CORRECT - Properly typed event handlers
const handleClick = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
  event.preventDefault()
  // Handler logic
}, [dependencies])

const handleKeyDown = useCallback((event: React.KeyboardEvent<HTMLDivElement>) => {
  // Keyboard handler logic
}, [dependencies])

const handleChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
  // Change handler logic
}, [dependencies])
```

## 🎯 Error Handling Patterns

### **Component Error Boundaries (REQUIRED)**
```tsx
// ✅ CORRECT - Error boundary for each major feature
<ErrorBoundary
  fallback={<FeatureErrorFallback />}
  onError={(error, errorInfo) => {
    console.error('Feature error:', error, errorInfo)
    errorReportingService.report(error, errorInfo)
  }}
>
  <FeatureComponent />
</ErrorBoundary>

// Custom error fallback
const FeatureErrorFallback = ({ error, resetErrorBoundary }) => (
  <div className="bg-surface app-border p-6 text-center">
    <h3 className="text-lg font-semibold text-text mb-2">
      Feature Unavailable
    </h3>
    <p className="text-text-muted mb-4">
      This feature encountered an error and needs to be reloaded.
    </p>
    <button
      onClick={resetErrorBoundary}
      className="bg-accent hover:bg-accent-hover text-text-background px-4 py-2 rounded-md"
    >
      Reload Feature
    </button>
  </div>
)
```

### **Async Error Handling (REQUIRED)**
```tsx
// ✅ CORRECT - Comprehensive async error handling
const useAsyncOperation = () => {
  const [state, setState] = useState({ loading: false, error: null })
  const toastService = useService('toast')
  
  const executeAsync = useCallback(async (operation: () => Promise<any>) => {
    setState({ loading: true, error: null })
    
    try {
      const result = await operation()
      setState({ loading: false, error: null })
      return result
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      setState({ loading: false, error: errorMessage })
      
      console.error('Async operation failed:', error)
      toastService.error('Operation Failed', errorMessage)
      
      throw error
    }
  }, [toastService])
  
  return { ...state, executeAsync }
}
```

## 📱 Component Testing Standards

### **Component Testing Pattern (REQUIRED)**
```tsx
// ✅ CORRECT - Comprehensive component tests
describe('DeobfuscatorPage', () => {
  beforeEach(() => {
    mockServices.reset()
  })
  
  it('renders initial state correctly', () => {
    render(<DeobfuscatorPage />)
    expect(screen.getByRole('main')).toBeInTheDocument()
    expect(screen.getByLabelText(/upload file/i)).toBeInTheDocument()
  })
  
  it('handles file processing', async () => {
    const user = userEvent.setup()
    render(<DeobfuscatorPage />)
    
    const fileInput = screen.getByLabelText(/upload file/i)
    const testFile = new File(['obfuscated code'], 'test.js', { type: 'text/javascript' })
    
    await user.upload(fileInput, testFile)
    
    expect(mockServices.deobfuscation.process).toHaveBeenCalledWith(testFile)
  })
  
  it('supports keyboard navigation', async () => {
    const user = userEvent.setup()
    render(<DeobfuscatorPage />)
    
    await user.tab()
    expect(screen.getByRole('button', { name: /process/i })).toHaveFocus()
    
    await user.keyboard('{Enter}')
    // Verify action triggered
  })
})
```

### **Accessibility Testing (REQUIRED)**
```tsx
// ✅ CORRECT - Accessibility test coverage
it('meets accessibility standards', async () => {
  const { container } = render(<Component />)
  const results = await axe(container)
  expect(results).toHaveNoViolations()
})

it('supports screen reader navigation', () => {
  render(<Component />)
  
  // Verify ARIA labels
  expect(screen.getByRole('button')).toHaveAttribute('aria-label')
  
  // Verify live regions
  expect(screen.getByRole('status')).toBeInTheDocument()
  
  // Verify focus management
  expect(screen.getByRole('main')).toHaveAttribute('tabIndex', '-1')
})
```

## 🚨 Common Architecture Violations

### **Size Limit Violations**
```tsx
// ❌ WRONG - Component too large (200+ lines)
const FeaturePage = () => {
  const [state1, setState1] = useState()
  const [state2, setState2] = useState()
  // ... 50 more state variables
  
  useEffect(() => {
    // 30 lines of effect logic
  }, [])
  
  const handler1 = () => {
    // 20 lines of logic
  }
  
  // ... 20 more handlers
  
  return (
    <div>
      {/* 100+ lines of JSX */}
    </div>
  )
}
```

### **Architecture Violations**
```tsx
// ❌ WRONG - Mixed concerns
const Component = () => {
  // State management
  const [data, setData] = useState()
  
  // API calls
  const fetchData = async () => {
    const response = await fetch('/api/data')
    // Direct API handling
  }
  
  // Styling logic
  const getButtonColor = () => {
    return loading ? 'bg-gray-400' : 'bg-blue-600'
  }
  
  // Business logic
  const processData = (input) => {
    // Complex business rules
  }
  
  // All in one component
}
```

### **Accessibility Violations**
```tsx
// ❌ WRONG - Poor accessibility
<div onClick={handleClick}>             // Not keyboard accessible
  <img src="icon.png" />                // Missing alt text
  <span className="text-red-500">Error</span>  // Color only indication
</div>

// ❌ WRONG - Missing ARIA
<button onClick={handleSubmit}>
  Submit
</button>  // No aria-label or description
```

## 📋 Implementation Checklist

### **Before Writing Component**
- [ ] Define component responsibility (single purpose)
- [ ] Plan hook extraction strategy
- [ ] Design TypeScript interfaces
- [ ] Identify accessibility requirements

### **During Implementation**
- [ ] Stay under size limits
- [ ] Use only theme variables
- [ ] Extract logic to hooks
- [ ] Add comprehensive error handling
- [ ] Implement full keyboard support

### **Before Code Review**
- [ ] Verify component size limits
- [ ] Test with all 48 theme variants
- [ ] Validate accessibility with screen reader
- [ ] Test keyboard navigation
- [ ] Verify TypeScript coverage

## 📚 Reference Implementations

- **Task-Writer Components**: `/mnt/c/projects/task-writer/frontend/app/src/components/`
- **Style Guide**: `/mnt/c/projects/docs/STYLE_GUIDE.md`
- **Layout Standard**: `/mnt/c/projects/detox-tool/frontend/docs/LAYOUT_ARCHITECTURE_STANDARD.md`

---

**This component architecture standard is MANDATORY for all components. Non-compliance will require refactoring before code review approval.**