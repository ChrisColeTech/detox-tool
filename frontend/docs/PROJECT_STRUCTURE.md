# Detox Tool - Project Structure Documentation

This document provides a comprehensive overview of the detox-tool project structure, explaining the purpose and organization of every file and directory following the task-writer architecture patterns.

## 🏗️ Root Directory Structure

```
detox-tool/
├── 📁 electron/                      # Electron main process
├── 📁 frontend/                      # React frontend application  
├── 📁 backend/                       # Deobfuscation engines (existing)
├── 📁 tests/                         # Test suites (existing)
├── 📄 package.json                   # Root package configuration
├── 📄 README.md                      # Main project documentation
└── 📄 .gitignore                     # Git ignore rules
```

## 🖥️ Electron Backend

```
electron/
├── 📄 main.js                        # Main Electron process entry point
├── 📄 preload.js                     # Secure IPC bridge for renderer
└── 📁 services/                      # Electron-specific services
    ├── 📄 fileSystem.js              # File system operations
    ├── 📄 windowManager.js           # Window management
    └── 📄 menuManager.js             # Application menus
```

**Purpose**: Handles native desktop functionality, file system access, and window management.

## ⚛️ Frontend Application

### Main Application Structure

```
frontend/app/
├── 📄 package.json                   # Frontend dependencies and scripts
├── 📄 vite.config.ts                 # Vite build configuration
├── 📄 tailwind.config.js             # Tailwind CSS configuration
├── 📄 postcss.config.js              # PostCSS configuration
├── 📄 tsconfig.json                  # TypeScript configuration
├── 📄 index.html                     # HTML entry point
├── 📄 README.md                      # Frontend-specific documentation
├── 📄 IMPLEMENTATION_PLAN.md         # Detailed implementation roadmap
├── 📄 PROJECT_STRUCTURE.md           # This documentation file
└── 📁 src/                           # Source code
```

### Source Code Organization

```
src/
├── 📄 App.tsx                        # Root application component
├── 📄 main.tsx                       # React application entry point
├── 📄 vite-env.d.ts                  # Vite environment types
├── 📁 components/                    # React components
├── 📁 pages/                         # Page components with navigation config
├── 📁 hooks/                         # Custom React hooks
├── 📁 services/                      # Business logic services
├── 📁 config/                        # Configuration files
├── 📁 types/                         # TypeScript type definitions
├── 📁 styles/                        # CSS stylesheets and theming
├── 📁 utils/                         # Utility functions
└── 📁 assets/                        # Static assets
```

## 🧩 Components Architecture

The components are organized in a hierarchical structure following the task-writer architecture patterns:

### Component Organization (ENFORCED STRUCTURE)

```
components/
├── 📁 features/                      # Feature-specific components (MAX 150 lines each)
│   ├── 📁 deobfuscator/             # Main deobfuscation tool
│   ├── 📁 editor/                   # Monaco editor integration
│   ├── 📁 file-explorer/            # File management interface
│   ├── 📁 settings/                 # Settings configuration UI
│   ├── 📁 search/                   # Global spotlight search functionality
│   ├── 📁 tabbar/                   # Tab management UI
│   ├── 📁 titlebar/                 # Title bar controls and window management
│   ├── 📁 sidebar/                  # Sidebar navigation and panels
│   ├── 📁 notifications/            # Toast notification system
│   └── 📁 welcome/                  # Welcome page components
├── 📁 layout/                       # Layout orchestration (MAX 80 lines each)
│   ├── 📄 Layout.tsx                # Main layout orchestrator (MUST be < 80 lines)
│   ├── 📄 TitleBar.tsx              # Title bar with tabs and controls
│   ├── 📄 Sidebar.tsx               # Sidebar navigation container
│   ├── 📄 MainContent.tsx           # Main content area router
│   └── 📄 StatusBar.tsx             # Bottom status bar
├── 📁 shared/                       # Cross-feature reusable components (MAX 150 lines each)
│   ├── 📁 forms/                    # Form components
│   │   ├── 📄 SettingsSection.tsx   # Settings section wrapper
│   │   ├── 📄 FormField.tsx         # Generic form field
│   │   ├── 📄 ThemeSelector.tsx     # Theme selection dropdown
│   │   ├── 📄 ToggleSwitch.tsx      # Toggle control
│   │   └── 📄 index.ts              # Barrel exports (REQUIRED)
│   └── 📁 generators/               # Shared deobfuscation components
│       ├── 📄 EngineSelector.tsx    # Deobfuscation engine selector
│       ├── 📄 ProcessingStatus.tsx  # Processing status indicator
│       └── 📄 index.ts              # Barrel exports (REQUIRED)
└── 📁 ui/                          # Pure UI components (MAX 100 lines each)
    ├── 📄 Button.tsx                # Reusable button component
    ├── 📄 Card.tsx                  # Card container component
    ├── 📄 Modal.tsx                 # Modal dialog component
    ├── 📄 Tooltip.tsx               # Tooltip component
    ├── 📄 LoadingSpinner.tsx        # Loading indicator
    ├── 📄 Toast.tsx                 # Toast notification component
    └── 📄 ErrorBoundary.tsx         # Error boundary wrapper
```

**CRITICAL REQUIREMENTS**:
- **EVERY component MUST have a single, clear responsibility**
- **EVERY feature folder MUST have an index.ts with barrel exports**
- **NO component may exceed its line limit - refactor instead**
- **ALL components MUST use theme variables (bg-surface, text-text, etc.)**
- **ALL components MUST be wrapped in error boundaries**
- **ALL interactive components MUST be keyboard accessible**

### Style Guide Compliance (GOLD STANDARD ENFORCEMENT)
Following `/mnt/c/projects/docs/STYLE_GUIDE.md` as the gold standard:

#### Theme System Usage (MANDATORY)
```tsx
// ✅ CORRECT - Uses theme variables (works with ALL 48 variants)
className="bg-surface text-text app-border hover:bg-surface-hover"
className="bg-accent hover:bg-accent-hover text-text-background app-border-accent"

// ✅ CORRECT - Enhanced effects (automatically applied for special themes)
className="bg-accent cyberpunk-glow neon-text transition-all duration-300"

// ❌ WRONG - Hardcoded colors break theming across ALL schemes
className="bg-blue-600 hover:bg-blue-700 text-white border-blue-500"
```

#### Required Theme Variables (MUST USE)
```css
/* Backgrounds */
--background     /* Main page background */
--surface        /* Card/panel backgrounds */
--surface-hover  /* Hover states for surfaces */

/* Text Colors */
--text           /* Primary text */
--text-muted     /* Secondary/helper text */
--text-background /* Text on accent backgrounds */

/* Accent Colors */
--accent         /* Primary actions, focus states */
--accent-hover   /* Hover state for accent */

/* Borders */
--border         /* Standard borders */

/* Enhanced Effects (for special themes) */
--accent-glow    /* Multi-layer glow effects */
--text-glow      /* Text shadow glow */
--neon-border    /* Neon border effects */
--shadow         /* Enhanced shadow effects */
```

#### CSS Classes to Use (ENFORCED)
```tsx
// Backgrounds
"bg-background"     // Page backgrounds
"bg-surface"        // Cards, panels
"bg-accent"         // Primary buttons, active states

// Text
"text-text"         // Primary text
"text-text-muted"   // Secondary text  
"text-text-background" // Text on accent backgrounds

// Borders (REQUIRED)
"app-border"        // Standard borders (respects border thickness setting)
"app-border-accent" // Accent colored borders
```

#### Auto-Scaling System (ENFORCED)
**DO NOT** manually set font sizes or icon sizes. The system automatically scales:

```tsx
// ✅ CORRECT - Auto-scales with user settings
<h1 className="text-4xl font-bold text-text">Title</h1>
<Icon className="w-6 h-6 text-accent" />

// ❌ WRONG - Fixed sizes ignore user preferences  
<h1 style={{fontSize: '36px'}}>Title</h1>
<Icon size={24} />
```

### Feature Components Detail

#### Deobfuscator Feature
```
features/deobfuscator/
├── 📄 DeobfuscatorMain.tsx          # Main deobfuscation interface
├── 📄 SourcePanel.tsx               # Source code input panel
├── 📄 OutputPanel.tsx               # Deobfuscated output panel
├── 📄 AnalysisPanel.tsx             # Code analysis and metrics
├── 📄 ProgressIndicator.tsx         # Deobfuscation progress
├── 📄 EngineControls.tsx            # Engine selection and options
└── 📄 index.ts                      # Feature exports
```

#### Editor Feature (Monaco Integration)
```
features/editor/
├── 📄 CodeEditor.tsx                # Main Monaco editor wrapper
├── 📄 EditorTabs.tsx                # Multiple file tab support
├── 📄 EditorToolbar.tsx             # Editor actions and tools
├── 📄 SyntaxSelector.tsx            # Language/syntax selection
└── 📄 index.ts                      # Feature exports
```

#### Search Feature
```
features/search/
├── 📄 SpotlightSearch.tsx           # Main search modal component
├── 📄 SearchInput.tsx               # Search input with shortcuts
├── 📄 SearchResults.tsx             # Search results list
├── 📄 SearchEmptyState.tsx          # No results state
├── 📄 SearchCategories.tsx          # Result categorization
└── 📄 index.ts                      # Feature exports
```

#### Title Bar Feature
```
features/titlebar/
├── 📄 AppControls.tsx               # Search button and controls
├── 📄 WindowControls.tsx            # Minimize/maximize/close buttons
├── 📄 TabBarContainer.tsx           # Tab bar integration
└── 📄 index.ts                      # Feature exports
```

#### Sidebar Feature
```
features/sidebar/
├── 📄 SidebarNavigation.tsx         # Navigation items
├── 📄 SidebarPanels.tsx             # Panel management
├── 📄 SidebarToggle.tsx             # Collapse/expand controls
└── 📄 index.ts                      # Feature exports
```

## 📄 Pages System

Pages are auto-discovered components that export navigation configuration:

```
pages/
├── 📄 WelcomePage.tsx               # Application welcome/landing page
├── 📄 DeobfuscatorPage.tsx          # Main deobfuscation tool page
├── 📄 SettingsPage.tsx              # Application settings page
├── 📄 HelpPage.tsx                  # Help and documentation page
├── 📄 AboutPage.tsx                 # About and version information
└── 📁 panels/                       # Optional panels for pages
    ├── 📄 DeobfuscatorPanel.tsx     # Sidebar panel for deobfuscator page
    ├── 📄 FileExplorerPanel.tsx     # File browser panel
    └── 📄 SettingsPanel.tsx         # Settings quick access panel
```

### Page Component Pattern (Auto-Discovery)
Each page follows the exact task-writer pattern:

```typescript
// WelcomePage.tsx
import { Home } from 'lucide-react'
import type { NavigationConfig } from '@/types/navigation'

const WelcomePage = () => {
  return (
    <div className="h-full overflow-y-auto flex items-center justify-center">
      {/* Welcome page content */}
    </div>
  )
}

export default WelcomePage

// Auto-discovery navigation configuration
export const navigationConfig: NavigationConfig = {
  id: 'welcome',
  label: 'Welcome',
  iconComponent: Home,
  showInSidebar: true,
  order: 0,
  keyboardShortcut: 'Ctrl+H'
}
```

```typescript
// DeobfuscatorPage.tsx
import { Code } from 'lucide-react'
import { DeobfuscatorMain } from '@/components/features/deobfuscator'
import type { NavigationConfig } from '@/types/navigation'

const DeobfuscatorPage = () => {
  return (
    <div className="h-full overflow-y-auto">
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
  order: 1,
  keyboardShortcut: 'Ctrl+D'
}
```

```typescript
// SettingsPage.tsx
import { Settings } from 'lucide-react'
import { SettingsMain } from '@/components/features/settings'
import type { NavigationConfig } from '@/types/navigation'

const SettingsPage = () => {
  return (
    <div className="h-full overflow-y-auto">
      <SettingsMain />
    </div>
  )
}

export default SettingsPage

export const navigationConfig: NavigationConfig = {
  id: 'settings',
  label: 'Settings',
  iconComponent: Settings,
  showInSidebar: true,
  order: 9,
  keyboardShortcut: 'Ctrl+,'
}
```

```typescript
// HelpPage.tsx
import { HelpCircle } from 'lucide-react'
import type { NavigationConfig } from '@/types/navigation'

const HelpPage = () => {
  return (
    <div className="h-full overflow-y-auto p-6">
      {/* Help documentation content */}
    </div>
  )
}

export default HelpPage

export const navigationConfig: NavigationConfig = {
  id: 'help',
  label: 'Help',
  iconComponent: HelpCircle,
  showInSidebar: true,
  order: 8,
  keyboardShortcut: 'F1'
}
```

```typescript
// AboutPage.tsx
import { Info } from 'lucide-react'
import type { NavigationConfig } from '@/types/navigation'

const AboutPage = () => {
  return (
    <div className="h-full overflow-y-auto p-6">
      {/* About and version information */}
    </div>
  )
}

export default AboutPage

export const navigationConfig: NavigationConfig = {
  id: 'about',
  label: 'About',
  iconComponent: Info,
  showInSidebar: false, // Accessible via menu only
  order: 10
}
```

### Panel Component Pattern (Auto-Discovery)
Optional panels provide sidebar content for specific pages:

```typescript
// pages/panels/DeobfuscatorPanel.tsx
import { FileText, Settings, Eye } from 'lucide-react'
import type { PanelConfig } from '@/types/navigation'

const DeobfuscatorPanel = () => {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <h3 className="text-sm font-semibold text-text">Engine Options</h3>
        {/* Engine selection UI */}
      </div>
      <div className="space-y-2">
        <h3 className="text-sm font-semibold text-text">Processing Status</h3>
        {/* Status information */}
      </div>
    </div>
  )
}

export default DeobfuscatorPanel

// Auto-discovery panel configuration
export const panelConfig: PanelConfig = {
  id: 'deobfuscator-panel',
  label: 'Deobfuscator Tools',
  iconComponent: Settings,
  pageId: 'deobfuscator',        // Associated page
  position: 'right',             // Sidebar position
  defaultVisible: true,          // Show by default
  order: 1
}
```

```typescript
// pages/panels/FileExplorerPanel.tsx
import { Folder, File, Upload } from 'lucide-react'
import type { PanelConfig } from '@/types/navigation'

const FileExplorerPanel = () => {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <h3 className="text-sm font-semibold text-text">Project Files</h3>
        {/* File tree component */}
      </div>
      <div className="space-y-2">
        <h3 className="text-sm font-semibold text-text">Recent Files</h3>
        {/* Recent files list */}
      </div>
    </div>
  )
}

export default FileExplorerPanel

export const panelConfig: PanelConfig = {
  id: 'file-explorer-panel',
  label: 'File Explorer',
  iconComponent: Folder,
  pageId: '*',                   // Available on all pages
  position: 'left',
  defaultVisible: false,         // Hidden by default
  order: 0
}
```

```typescript
// pages/panels/SettingsPanel.tsx
import { Palette, Type, Monitor } from 'lucide-react'
import type { PanelConfig } from '@/types/navigation'

const SettingsPanel = () => {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <h3 className="text-sm font-semibold text-text">Quick Settings</h3>
        {/* Quick theme/settings toggles */}
      </div>
    </div>
  )
}

export default SettingsPanel

export const panelConfig: PanelConfig = {
  id: 'settings-panel',
  label: 'Quick Settings',
  iconComponent: Palette,
  pageId: '*',                   // Available on all pages
  position: 'right',
  defaultVisible: false,
  order: 9
}
```

## 🎣 Custom Hooks

State management and business logic coordination through custom hooks:

```
hooks/
├── 📄 useLayoutState.ts             # Layout state orchestration
├── 📄 useLayoutServices.ts          # Service dependency injection
├── 📄 useLayoutKeyboard.ts          # Global keyboard shortcuts
├── 📄 useTabs.ts                    # Tab management state
├── 📄 useSettings.ts                # Settings state with persistence
├── 📄 useTabBarDragDrop.ts          # Tab reordering functionality
├── 📄 useTabBarScroll.ts            # Tab scrolling behavior
├── 📄 useSpotlightSearch.ts         # Global search state
├── 📄 useSpotlightKeyboard.ts       # Search keyboard navigation
├── 📄 useDeobfuscation.ts           # Deobfuscation process management
├── 📄 useFileManagement.ts          # File loading and saving
├── 📄 useToast.ts                   # Toast notification management
├── 📄 useKeyboardShortcuts.ts       # Application-wide shortcuts
├── 📄 usePlatform.ts                # Platform detection and services
├── 📄 useReducedMotion.ts           # Animation preferences
└── 📄 useSidebar.ts                 # Sidebar state and navigation
```

### Hook Responsibility Pattern (ENFORCED)
- **State Hooks**: Manage specific state domains (useSettings, useTabs) - MUST be pure state management
- **Effect Hooks**: Handle side effects and lifecycle (useLayoutKeyboard) - MUST clean up properly
- **Service Hooks**: Integrate with business logic services (useDeobfuscation) - MUST handle errors

**MANDATORY REQUIREMENTS**:
- **ALL custom hooks MUST have proper cleanup in useEffect**
- **ALL service hooks MUST handle loading, success, and error states**
- **ALL hooks MUST be memoized with useCallback/useMemo where appropriate**
- **NO business logic in components - MUST be in hooks or services**

```typescript
// ✅ CORRECT - Proper hook pattern
const useDataService = () => {
  const [state, setState] = useState({ data: null, loading: true, error: null })
  const service = useService(DataService)
  
  useEffect(() => {
    let mounted = true
    
    service.loadData()
      .then(data => mounted && setState({ data, loading: false, error: null }))
      .catch(error => mounted && setState({ data: null, loading: false, error }))
    
    return () => { mounted = false } // Cleanup
  }, [service])
  
  return state
}

// ❌ FORBIDDEN - No error handling or cleanup
const useBadDataService = () => {
  const [data, setData] = useState(null)
  
  useEffect(() => {
    fetch('/api/data').then(r => r.json()).then(setData) // No error handling!
  }, []) // No cleanup!
  
  return data
}
```

## 🔧 Services Layer

Business logic separation following dependency injection patterns:

```
services/
├── 📄 appService.ts                 # Central application coordination
├── 📄 tabService.ts                 # Tab state management service
├── 📄 platformService.ts            # Platform abstraction layer
├── 📄 electronService.ts            # Electron-specific implementations
├── 📄 browserService.ts             # Browser-specific implementations
├── 📄 settingsService.ts            # Settings persistence service
├── 📄 searchService.ts              # Search functionality service
├── 📄 navigationService.ts          # Navigation and routing service
├── 📄 deobfuscationService.ts       # Deobfuscation engine coordination
├── 📄 fileService.ts                # File operations service
├── 📄 toastService.ts               # Notification service
└── 📄 keyboardService.ts            # Keyboard shortcut service
```

### Service Architecture Pattern
```typescript
export class DeobfuscationService {
  constructor(
    private platformService: PlatformService,
    private toastService: ToastService
  ) {}

  async deobfuscateFile(file: File, options: DeobfuscationOptions): Promise<string> {
    try {
      // Business logic implementation
      const result = await this.processFile(file, options)
      this.toastService.success('Deobfuscation completed')
      return result
    } catch (error) {
      this.toastService.error('Deobfuscation failed', error.message)
      throw error
    }
  }
}
```

### Platform Service Implementation Pattern (ENFORCED)
```typescript
// services/platformService.ts - Platform abstraction (REQUIRED)
export interface PlatformService {
  isElectron(): boolean
  isBrowser(): boolean
  loadSettings(): Promise<AppSettings | null>
  saveSettings(settings: AppSettings): Promise<void>
  openFile(filters?: FileFilter[]): Promise<File | null>
  saveFile(content: string, filename: string): Promise<boolean>
  // REQUIRED: All methods MUST handle errors gracefully
}

// ENFORCEMENT RULES:
// 1. ALL service methods MUST return Promise for async operations
// 2. ALL service methods MUST handle errors internally
// 3. ALL services MUST implement proper TypeScript interfaces
// 4. NO services may depend on components (one-way dependency)

// services/electronService.ts - Electron implementation
export const electronService: PlatformService = {
  isElectron: () => true,
  isBrowser: () => false,
  
  async loadSettings(): Promise<AppSettings | null> {
    return window.electronAPI?.getAppSettings() || null
  },
  
  async saveSettings(settings: AppSettings): Promise<void> {
    await window.electronAPI?.setAppSettings(settings)
  },
  
  async openFile(filters?: FileFilter[]): Promise<File | null> {
    const result = await window.electronAPI?.openFileDialog(filters)
    return result ? new File([result.content], result.name) : null
  },
  
  async saveFile(content: string, filename: string): Promise<boolean> {
    return await window.electronAPI?.saveFile(content, filename) || false
  }
}

// services/browserService.ts - Browser implementation (ENFORCED PATTERN)
export const browserService: PlatformService = {
  isElectron: () => false,
  isBrowser: () => true,
  
  async loadSettings(): Promise<AppSettings | null> {
    try {
      const stored = localStorage.getItem('detox-tool-settings')
      return stored ? JSON.parse(stored) : null
    } catch (error) {
      // REQUIRED: Proper error handling and logging
      console.warn('Failed to load settings from localStorage:', error)
      return null // REQUIRED: Graceful fallback
    }
  },
  
  // ENFORCEMENT: ALL methods MUST follow this error handling pattern
  // 1. Try-catch blocks for all operations
  // 2. Proper logging of errors
  // 3. Graceful fallbacks
  // 4. Return type safety
  
  async saveSettings(settings: AppSettings): Promise<void> {
    try {
      localStorage.setItem('detox-tool-settings', JSON.stringify(settings))
    } catch (error) {
      console.warn('Failed to save settings to localStorage:', error)
    }
  },
  
  async openFile(filters?: FileFilter[]): Promise<File | null> {
    return new Promise((resolve) => {
      const input = document.createElement('input')
      input.type = 'file'
      input.accept = filters?.map(f => f.extensions.map(e => `.${e}`).join(',')).join(',') || '*'
      
      input.onchange = (e) => {
        const file = (e.target as HTMLInputElement).files?.[0]
        resolve(file || null)
      }
      
      input.click()
    })
  },
  
  async saveFile(content: string, filename: string): Promise<boolean> {
    try {
      const blob = new Blob([content], { type: 'text/plain' })
      const url = URL.createObjectURL(blob)
      
      const a = document.createElement('a')
      a.href = url
      a.download = filename
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      
      return true
    } catch (error) {
      console.error('Failed to save file:', error)
      return false
    }
  }
}

// Platform service factory
export const getPlatformService = (): PlatformService => {
  return window.electronAPI ? electronService : browserService
}
```

## 📝 Type Definitions

Comprehensive TypeScript coverage for type safety:

```
types/
├── 📄 navigation.ts                 # Navigation and panel types (NavigationConfig, PanelConfig)
├── 📄 tab.ts                        # Tab management types
├── 📄 settings.ts                   # Settings and configuration types
├── 📄 deobfuscation.ts              # Tool-specific types
├── 📄 platform.ts                   # Platform abstraction types
├── 📄 search.ts                     # Search functionality types
├── 📄 theme.ts                      # Theming system types
├── 📄 sidebar.ts                    # Sidebar state and panel management types
├── 📄 layout.ts                     # Layout component types
└── 📄 electron-api.d.ts             # Electron API type definitions
```

### Key Type Interfaces (MANDATORY TYPING)
```typescript
// types/navigation.ts (NO any types allowed)
interface NavigationConfig {
  id: string                        // Unique page identifier (REQUIRED)
  label: string                     // Display name in sidebar (REQUIRED)
  iconComponent: React.ComponentType<{ className?: string }>  // Lucide icon component (REQUIRED)
  showInSidebar: boolean           // Whether to show in sidebar navigation (REQUIRED)
  order: number                    // Sort order in sidebar (lower = higher) (REQUIRED)
  keyboardShortcut?: string        // Optional keyboard shortcut
  description?: string             // Optional description for search
}

// ENFORCEMENT: ALL exports MUST be properly typed
// ❌ FORBIDDEN
export const navigationConfig: any = { ... }

// ✅ REQUIRED
export const navigationConfig: NavigationConfig = {
  id: 'deobfuscator',
  label: 'Deobfuscator',
  iconComponent: Code,
  showInSidebar: true,
  order: 1
} // Type checking enforced

interface PanelConfig {
  id: string                       // Unique panel identifier
  label: string                    // Panel display name
  iconComponent: React.ComponentType<{ className?: string }>  // Lucide icon component
  pageId: string                   // Associated page ID ('*' for all pages)
  position: 'left' | 'right'       // Sidebar position
  defaultVisible: boolean          // Show by default when page opens
  order: number                    // Sort order within position
  keyboardShortcut?: string        // Optional toggle shortcut
}

// types/tab.ts
interface Tab {
  id: string                       // Matches NavigationConfig.id
  label: string                    // Tab display name
  active: boolean                  // Currently active tab
  closable: boolean               // Can be closed by user
  dirty?: boolean                 // Has unsaved changes
  metadata?: Record<string, any>  // Page-specific metadata
}

// types/sidebar.ts (STRICT TYPING REQUIRED)
interface SidebarState {
  leftPanels: readonly string[]    // IDs of visible left panels (readonly for immutability)
  rightPanels: readonly string[]   // IDs of visible right panels (readonly for immutability)
  leftExpanded: boolean            // Left sidebar expanded state
  rightExpanded: boolean           // Right sidebar expanded state
  activeLeftPanel?: string         // Currently active left panel
  activeRightPanel?: string        // Currently active right panel
}

// ENFORCEMENT: Use strict typing patterns
type PanelPosition = 'left' | 'right' // No magic strings
type PanelVisibility = 'visible' | 'hidden' | 'collapsed' // Explicit states

// ❌ FORBIDDEN - Loose typing
interface BadSidebarState {
  panels: any[]
  state: string
}

// ✅ REQUIRED - Strict typing
interface GoodSidebarState {
  panels: readonly PanelConfig[]
  visibility: PanelVisibility
}
```

## 🎨 Styles and Theming

Dual-dimension theming system with 48 total theme variants:

```
styles/
├── 📄 variables.css                 # CSS custom properties foundation
├── 📄 themes.css                    # All 12 color schemes with 4 variants each
├── 📄 settings.css                  # User preference scaling (font/icon)
├── 📄 borders.css                   # Border system and thickness variants
├── 📄 base.css                      # Base styles and Tailwind integration
└── 📄 components.css                # Component-specific styling
```

### Theming Architecture
- **12 Color Schemes**: Code Detective, Reverse Engineer, Malware Hunter, Script Sleuth, Debug Master, Hex Analyst, Binary Explorer, Cyber Forensics, Code Breaker, Threat Hunter, Digital Archaeologist, Obfuscation Buster
- **4 Mode Variants**: Light, Dark, High Contrast Light, High Contrast Dark per scheme (48 total variants)
- **Scaling Options**: Font size (small/medium/large), icon size (small/medium/large), border thickness (none/thin/medium/thick)
- **Special Effects**: Enhanced matrix effects for Binary Explorer, neon glows for Cyber Forensics
- **CSS Specificity Order**: Color scheme → Dark mode → High contrast

### Theme Structure Pattern
```css
/* CSS Specificity Order (CRITICAL) */
.color-code-detective { /* Light mode variables */ }
.color-code-detective.dark { /* Dark mode overrides */ }
.color-code-detective.high-contrast:not(.dark) { /* High contrast light */ }
.color-code-detective.high-contrast.dark { /* High contrast dark */ }

/* Enhanced effects for special themes */
.color-binary-explorer {
  --accent-glow: 0 0 8px currentColor, 0 0 16px currentColor;
  --text-glow: 0 0 4px currentColor;
  --matrix-effect: repeating-linear-gradient(0deg, transparent 0px, transparent 2px, rgba(0, 255, 0, 0.03) 2px, rgba(0, 255, 0, 0.03) 4px);
}

.color-cyber-forensics {
  --accent-glow: 0 0 12px currentColor, 0 0 24px currentColor, 0 0 36px currentColor;
  --text-glow: 0 0 6px currentColor;
  --neon-border: 0 0 6px currentColor, inset 0 0 6px currentColor;
}
```

## ⚙️ Configuration

Application configuration and auto-discovery setup:

```
config/
├── 📄 navigationConfig.tsx          # Auto-discovery implementation
├── 📄 themeConfig.ts                # Theme definitions and utilities
├── 📄 keyboardConfig.ts             # Keyboard shortcut definitions
├── 📄 deobfuscationConfig.ts        # Tool-specific configuration
└── 📄 searchConfig.ts               # Search data and configuration
```

### Auto-Discovery Implementation
```typescript
// config/navigationConfig.tsx
import type { NavigationConfig, PanelConfig } from '@/types/navigation'

// Auto-discover all page modules with navigation configs
const pageModules = import.meta.glob('../pages/**/[A-Z]*Page.tsx', { eager: true })

// Auto-discover all panel modules with panel configs
const panelModules = import.meta.glob('../pages/panels/**/[A-Z]*Panel.tsx', { eager: true })

interface PageModule {
  default: React.ComponentType
  navigationConfig?: NavigationConfig
}

interface PanelModule {
  default: React.ComponentType
  panelConfig?: PanelConfig
}

const navigationConfigs: NavigationConfig[] = []
const pageComponents: Record<string, React.ComponentType> = {}
const panelConfigs: PanelConfig[] = []
const panelComponents: Record<string, React.ComponentType> = {}

// Process page modules
Object.entries(pageModules).forEach(([path, module]) => {
  const pageModule = module as PageModule
  
  if (pageModule.navigationConfig) {
    navigationConfigs.push(pageModule.navigationConfig)
    pageComponents[pageModule.navigationConfig.id] = pageModule.default
  }
})

// Process panel modules
Object.entries(panelModules).forEach(([path, module]) => {
  const panelModule = module as PanelModule
  
  if (panelModule.panelConfig) {
    panelConfigs.push(panelModule.panelConfig)
    panelComponents[panelModule.panelConfig.id] = panelModule.default
  }
})

// Sort by order
navigationConfigs.sort((a, b) => a.order - b.order)
panelConfigs.sort((a, b) => a.order - b.order)

export { navigationConfigs, pageComponents, panelConfigs, panelComponents }
export const getAllNavigationItems = () => navigationConfigs
export const getAllPanelItems = () => panelConfigs
export const getPageComponent = (pageId: string) => pageComponents[pageId]
export const getPanelComponent = (panelId: string) => panelComponents[panelId]
export const getPanelsForPage = (pageId: string) => 
  panelConfigs.filter(panel => panel.pageId === pageId || panel.pageId === '*')
```

## 🛠️ Utilities

Helper functions and common utilities:

```
utils/
├── 📄 cn.ts                         # Class name utility (clsx wrapper)
├── 📄 fileUtils.ts                  # File handling utilities
├── 📄 themeUtils.ts                 # Theme manipulation utilities
├── 📄 keyboardUtils.ts              # Keyboard shortcut utilities
├── 📄 validationUtils.ts            # Input validation utilities
├── 📄 formatUtils.ts                # Data formatting utilities
├── 📄 iconUtils.ts                  # Icon sizing and context utilities
└── 📄 searchUtils.ts                # Search algorithm and scoring
```

## 🎯 Architecture Principles (MANDATORY)

### Component Size Guidelines (ENFORCED)
| Component Type | Max Lines | Focus | **ENFORCEMENT** |
|---|---|---|---|
| Page Components | 100 | Orchestration only | **MUST refactor if exceeded** |
| Feature Components | 150 | Composition and coordination | **MUST refactor if exceeded** |
| Layout Components | 80 | Structure and positioning | **MUST refactor if exceeded** |
| UI Components | 100 | Pure rendering | **MUST refactor if exceeded** |

**CRITICAL**: Any component exceeding these limits MUST be refactored before proceeding.

### Single Responsibility Principle (MANDATORY)
- **Each component has ONE clear purpose**
- **If a component does multiple things, it MUST be split**
- **Maximum complexity per component is 150 lines total**
- **NEVER bypass this rule - refactor instead**

### State Management Strategy (ENFORCED)
1. **Custom Hooks**: Own specific state domains (PREFERRED)
2. **Service Coordination**: Business logic in services (REQUIRED)
3. **Prop Drilling**: Simple parent-child communication (ACCEPTABLE)
4. **Context**: Only for true application-wide state (RESTRICTED)

**RULE**: Business logic MUST live in services, NOT in components.

### Component Composition Requirements (MANDATORY)
- **Prefer composition over inheritance**
- **Use custom hooks to extract complex logic**
- **Components should be primarily declarative**
- **Side effects MUST be in useEffect or custom hooks**

### Auto-Discovery Pattern (ENFORCED)
- Pages export `navigationConfig` for automatic registration (REQUIRED)
- File naming convention: `*Page.tsx` for discovery (REQUIRED)
- Optional `*Panel.tsx` for sidebar panels (OPTIONAL)
- Configuration drives UI generation (REQUIRED)
- **NO manual registration - everything MUST be auto-discovered**

### Service Layer Pattern (MANDATORY)
- **Single Responsibility**: Each service handles one domain (REQUIRED)
- **Dependency Injection**: Services receive dependencies (REQUIRED)
- **Error Handling**: Services handle errors and notifications (REQUIRED)
- **Platform Abstraction**: Services use platform service (REQUIRED)
- **NO business logic in components** (FORBIDDEN)

### Code Quality Requirements (ENFORCED)
- **TypeScript**: All code MUST be fully typed (NO `any` types)
- **Error Boundaries**: All major components MUST have error boundaries
- **Testing**: All services MUST have unit tests
- **Performance**: Components MUST use React.memo where appropriate
- **Accessibility**: ALL components MUST be WCAG 2.1 AA compliant

### Architecture Violations (FORBIDDEN)
```typescript
// ❌ FORBIDDEN - Business logic in component
const BadComponent = () => {
  const [data, setData] = useState([])
  
  useEffect(() => {
    // Complex business logic here - WRONG!
    fetch('/api/data').then(/* complex processing */)
  }, [])
}

// ❌ FORBIDDEN - Multiple responsibilities
const BadComponent = () => {
  // File management + UI rendering + API calls - WRONG!
  return <div>{/* 200+ lines of mixed concerns */}</div>
}

// ❌ FORBIDDEN - Hardcoded colors
const BadComponent = () => (
  <div className="bg-blue-600 text-white"> // WRONG!
)
```

### Architecture Compliance (REQUIRED)
```typescript
// ✅ CORRECT - Single responsibility with service
const GoodComponent = () => {
  const { data, loading, error } = useDataService()
  
  if (loading) return <LoadingSpinner />
  if (error) return <ErrorDisplay error={error} />
  
  return (
    <div className="bg-surface text-text"> {/* Theme variables */}
      {data.map(item => <ItemCard key={item.id} item={item} />)}
    </div>
  )
}

// ✅ CORRECT - Custom hook with service
const useDataService = () => {
  const [state, setState] = useState({ data: [], loading: true, error: null })
  const dataService = useService(DataService)
  
  useEffect(() => {
    dataService.loadData()
      .then(data => setState({ data, loading: false, error: null }))
      .catch(error => setState({ data: [], loading: false, error }))
  }, [dataService])
  
  return state
}
```

### Theme System Requirements (MANDATORY)
- **ALWAYS use CSS variables**: `bg-surface`, `text-text`, etc. (REQUIRED)
- **NEVER use hardcoded colors**: `bg-blue-600`, `text-white` (FORBIDDEN)
- **MUST support all 48 theme variants** (REQUIRED)
- **app-border classes ONLY**: No Tailwind borders (FORBIDDEN)
- **Reduced motion support**: All animations MUST respect preferences (REQUIRED)

#### Accessibility (WCAG 2.1 AA Compliance - MANDATORY)
```tsx
// ✅ CORRECT - Semantic structure
<main role="main" aria-label="Page description">
  <header>
    <h1 id="page-title">Page Title</h1>
  </header>
  <section aria-labelledby="features-heading">
    <h2 id="features-heading" className="sr-only">Features</h2>
  </section>
</main>

// ✅ CORRECT - ARIA labels and descriptions
<button
  aria-label="Deobfuscator - Process JavaScript files for analysis"
  aria-describedby="deobfuscator-description"
  type="button"
>
  Start Deobfuscation
</button>
<div id="deobfuscator-description" className="sr-only">
  Analyze and clean obfuscated JavaScript code for better readability
</div>

// ✅ CORRECT - Focus management
className="focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-background"

// ✅ CORRECT - Reduced motion support
const prefersReducedMotion = useReducedMotion()
className={`transition-transform ${prefersReducedMotion ? '' : 'motion-safe:hover:scale-110'}`}
```

#### Modern Design Standards (ENFORCED)
```tsx
// ✅ CORRECT - Compact, clean card design
<div className="bg-surface app-border overflow-hidden transition-all duration-300 group focus-within:ring-2 focus-within:ring-accent motion-safe:hover:shadow-theme motion-safe:hover:scale-[1.02]">
  <div className="bg-gradient-to-r from-surface to-background px-6 py-4 app-border-b">
    <div className="flex items-center gap-3">
      <div className="page-icon transition-transform duration-300 motion-safe:group-hover:scale-110">
        <Icon className="w-6 h-6 text-accent" />
      </div>
      <h3 className="text-xl font-semibold text-text">Title</h3>
    </div>
  </div>
  <div className="p-6 space-y-6">
    {/* Content */}
  </div>
</div>

// ✅ CORRECT - Modern button design
<button className="flex items-center justify-center gap-2 px-4 py-3 bg-accent hover:bg-accent-hover focus:bg-accent-hover app-border-accent rounded-md transition-all duration-300 text-text-background focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 motion-safe:hover:shadow-theme motion-safe:hover:-translate-y-0.5">
  <Icon className="w-4 h-4" />
  <span>Action Text</span>
</button>
```

#### Information Density Best Practices (ENFORCED)
- **Headers**: Use `py-8` instead of `py-12` for page headers
- **Cards**: Use `p-6` for card content, `py-4` for card headers
- **Grids**: Use `gap-4` for primary grids, `gap-6` for larger screens
- **Text**: Prefer `text-base` over `text-lg` for descriptions
- **Spacing**: Use `space-y-6` for major sections, `space-y-4` for content groups
- **Margins**: Use `mb-4` instead of `mb-6` for content separation

#### Page Header Pattern (GOLD STANDARD)
```tsx
<motion.header
  {...createAnimationVariants(prefersReducedMotion)}
  className="text-center"
>
  <div className="bg-surface app-border overflow-hidden mb-8 motion-reduce:transform-none hover:shadow-theme transition-shadow duration-300">
    <div className="bg-gradient-to-r from-surface to-background px-8 py-12">
      <div className="flex items-center justify-center mb-6">
        <div className="page-icon mr-4" role="img" aria-label="Page icon description">
          <Icon className="text-accent w-12 h-12" aria-hidden="true" />
        </div>
        <div>
          <h1 className="text-4xl font-bold text-text" id="page-title">
            Page Title
          </h1>
          <p className="text-lg text-text-muted mt-2" id="page-subtitle">
            Page Subtitle
          </p>
        </div>
      </div>
      <p className="text-base text-text-muted max-w-2xl mx-auto leading-relaxed">
        Page description that explains the purpose and functionality.
      </p>
    </div>
  </div>
</motion.header>
```

#### Common Mistakes to Avoid (FORBIDDEN)
```tsx
// ❌ NEVER do this - Theme system violations
className="bg-blue-600 text-white border-gray-300"
style={{backgroundColor: '#3b82f6'}}

// ❌ NEVER bypass the scaling system
<Icon size={24} />
className="text-lg" // when you need specific sizing

// ❌ NEVER do accessibility violations
<div onClick={handleClick}>Clickable div</div> // Not keyboard accessible
<img src="icon.png" />                        // Missing alt text
className="outline-none"                      // Removes focus indicators

// ❌ NEVER force animations
className="animate-bounce"     // Ignores user preference
transition={{duration: 1}}     // No reduced motion check
```

This structure provides a solid foundation for building the detox-tool frontend while maintaining consistency with the proven task-writer architecture patterns and **GOLD STANDARD** compliance from the style guide. **VIOLATION OF THESE PRINCIPLES WILL RESULT IN REFACTORING REQUIREMENTS.**