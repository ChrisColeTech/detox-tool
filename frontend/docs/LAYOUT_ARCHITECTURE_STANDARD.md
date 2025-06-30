# Detox Tool - Layout Architecture Gold Standard

## 🏗️ MANDATORY Layout Architecture for All Components

This document establishes the **definitive architecture patterns** that ALL layout components in the detox-tool must follow. Based on the proven task-writer architecture, this standard ensures consistency, maintainability, and professional desktop application behavior.

## 🎯 Desktop Application Shell Structure

### **REQUIRED Shell Hierarchy**
```tsx
// ✅ MANDATORY - Exact structure required
<div className={layoutState.cssClasses}>
  <TitleBar />                    // Fixed header with tabs and controls
  <div className="flex-1 flex">   // Main content area
    <LayoutSidebar />             // Navigation + contextual panels
    <main className="flex-1">     // Primary content area
      <ErrorBanner />             // Error handling
      <LayoutMainContent />       // Page routing
    </main>
  </div>
  <StatusBar />                   // Optional bottom status
  <SpotlightSearch />             // Global search overlay
  <ToastContainer />              // Notifications
</div>
```

### **Complete Layout Component Hierarchy**

```tsx
// ✅ MANDATORY - Full component breakdown with ALL components
Layout (< 80 lines - orchestration only)
├── TitleBar (< 100 lines)
│   ├── MenuButton (app menu dropdown)
│   ├── TabBar (< 150 lines - drag/drop tabs)
│   │   ├── TabBarScrollable (scrollable tab container)
│   │   ├── TabBarControls (left/right scroll buttons)
│   │   └── TabItem (individual tab with close button)
│   ├── AppControls (application-level controls)
│   │   ├── SidebarToggle (position left/right)
│   │   ├── ThemeToggle (theme selector)
│   │   └── SearchButton (open spotlight search)
│   └── WindowControls (native window controls)
│       ├── MinimizeButton
│       ├── MaximizeButton
│       └── CloseButton
├── LayoutSidebar (< 80 lines - positioning logic)
│   ├── Sidebar (< 100 lines - navigation container)
│   │   ├── CollapseButton (expand/collapse panel)
│   │   ├── NavigationItems (< 100 lines - auto-discovery nav)
│   │   │   └── NavItem (individual navigation item)
│   │   │       ├── Icon (navigation icon)
│   │   │       ├── Tooltip (hover label)
│   │   │       └── ContextMenu (visibility/pin controls)
│   │   └── SettingsButton (bottom settings access)
│   └── SidePanel (< 80 lines - contextual panel)
│       └── [Dynamic Panel Component] (page-specific panels)
├── LayoutMainContent (< 80 lines - page routing)
│   ├── ErrorBanner (global error display)
│   └── [Active Page Component] (current page content)
├── StatusBar (< 50 lines - bottom status info)
│   ├── StatusIndicator (ready/processing)
│   ├── VersionInfo (app version)
│   └── EncodingInfo (file encoding)
├── SpotlightSearch (global search modal)
│   ├── SearchInput (fuzzy search input)
│   ├── SearchResults (result list)
│   └── SearchEmptyState (no results state)
└── ToastContainer (notification system)
    └── Toast (individual notification)
        ├── ToastIcon (success/error/warning)
        ├── ToastContent (title/message)
        └── ToastDismiss (close button)
```

### **Directory Structure Mapping**

```
components/
├── layout/                    # Core layout orchestration
│   ├── Layout.tsx            # Main layout orchestrator (< 80 lines)
│   ├── TitleBar.tsx          # Title bar with tabs (< 100 lines)
│   ├── LayoutSidebar.tsx     # Sidebar positioning (< 80 lines)
│   ├── Sidebar.tsx           # Navigation container (< 100 lines)
│   ├── SidePanel.tsx         # Contextual panels (< 80 lines)
│   ├── LayoutMainContent.tsx # Page routing (< 80 lines)
│   └── StatusBar.tsx         # Bottom status (< 50 lines)
├── titlebar/                 # Title bar controls
│   ├── TabBar.tsx           # Tab management (< 150 lines)
│   ├── AppControls.tsx      # App-level controls
│   └── WindowControls.tsx   # Native window controls
├── features/tabbar/          # Tab bar subcomponents
│   ├── TabBarScrollable.tsx # Scrollable tab container
│   ├── TabBarControls.tsx   # Scroll control buttons
│   └── TabItem.tsx          # Individual tab component
├── sidebar/                  # Sidebar navigation
│   ├── CollapseButton.tsx   # Panel expand/collapse
│   ├── NavigationItems.tsx  # Auto-discovery navigation
│   ├── NavItem.tsx          # Individual nav item
│   └── SettingsButton.tsx   # Settings access button
├── menu/                     # Application menu
│   ├── MenuButton.tsx       # Main menu button
│   ├── DropdownMenu.tsx     # Menu container
│   ├── MenuItem.tsx         # Individual menu item
│   └── Submenu.tsx          # Nested submenus
├── search/                   # Global search
│   └── SpotlightSearch.tsx  # Main search modal
├── features/spotlight-search/ # Search subcomponents
│   ├── SearchInput.tsx      # Search input field
│   ├── SearchResults.tsx    # Results display
│   └── SearchEmptyState.tsx # No results state
└── ui/                       # Shared UI components
    ├── Toast.tsx            # Notification component
    ├── ErrorBanner.tsx      # Error display
    └── Button.tsx           # Standard button
```

### **Shell Component Responsibilities**

#### **TitleBar Component (REQUIRED)**
- **Window Management**: Drag region, maximize/minimize/close
- **Tab Management**: Visual tabs with reordering capability
- **App Controls**: Theme toggle, sidebar position, global search
- **Platform Integration**: Electron-specific behaviors

```tsx
// ✅ CORRECT - Desktop app title bar with all subcomponents
<header
  className="flex items-stretch bg-gradient-to-r from-background to-surface text-text h-9 select-none shrink-0 app-border-b"
  style={{ WebkitAppRegion: 'drag' }}
  onDoubleClick={handleMaximize}
>
  {/* Menu System */}
  <MenuButton />
  
  {/* Tab Management */}
  <TabBar 
    tabs={tabs} 
    onTabClick={onTabClick} 
    onTabClose={onTabClose}
    onTabReorder={onTabReorder}
    activeTabId={activeTabId}
  />
  
  {/* Application Controls */}
  <AppControls 
    sidebarPosition={sidebarPosition}
    onToggleSidebarPosition={onToggleSidebarPosition}
    theme={theme}
    onToggleTheme={onToggleTheme}
    onOpenSearch={onOpenSearch}
  />
  
  {/* Window Controls */}
  <WindowControls />
</header>
```

#### **TabBar System (REQUIRED)**
The TabBar is a complex system with multiple subcomponents:

```tsx
// ✅ CORRECT - Complete TabBar architecture
<TabBar>
  <TabBarControls />              // Left scroll controls
  <DndContext>                    // Drag & drop context
    <TabBarScrollable>            // Scrollable container
      {tabs.map(tab => (
        <TabItem 
          key={tab.id}
          tab={tab}
          isActive={tab.id === activeTabId}
          onTabClick={onTabClick}
          onTabClose={onTabClose}
        />
      ))}
    </TabBarScrollable>
    <DragOverlay />               // Visual drag feedback
  </DndContext>
  <TabBarControls />              // Right scroll controls
</TabBar>
```

#### **Sidebar System (REQUIRED)**
Complete sidebar navigation with icons and panels:

```tsx
// ✅ CORRECT - Complete Sidebar architecture
<Sidebar>
  <CollapseButton 
    isExpanded={isExpanded}
    position={position}
    onToggle={onToggleExpanded}
  />
  
  <NavigationItems
    activeTab={activeTab}
    position={position}
    onTabChange={onTabChange}
    isSidebarItemVisible={isSidebarItemVisible}
    pinnedItems={pinnedItems}
    onToggleVisibility={onToggleVisibility}
    onTogglePin={onTogglePin}
  />
  
  <div className="flex-1" />      // Spacer
  
  <SettingsButton
    onClick={onSettingsClick}
    isActive={activeTabId === 'settings'}
    position={position}
  />
</Sidebar>
```

#### **LayoutSidebar Component (REQUIRED)**
- **Dual Purpose**: Navigation sidebar + contextual side panel
- **Position Flexibility**: Left or right positioning
- **Collapsible Behavior**: Expand/collapse with smooth transitions
- **Context Awareness**: Shows relevant panels based on active tab

```tsx
// ✅ CORRECT - Sidebar with panel composition
const LayoutSidebar = ({ settings, activeTab, isExpanded }) => {
  const sidebarComponent = <Sidebar />
  const panelComponent = <SidePanel />
  
  return settings.sidebarPosition === 'left' ? (
    <>{sidebarComponent}{panelComponent}</>
  ) : (
    <>{panelComponent}{sidebarComponent}</>
  )
}
```

#### **MainContent Component (REQUIRED)**
- **Page Routing**: Handles page navigation and rendering
- **Content Management**: Manages tab content and state
- **Error Boundaries**: Graceful error handling
- **Accessibility**: Proper ARIA regions and navigation

```tsx
// ✅ CORRECT - Main content area
<main className="flex-1 bg-background overflow-hidden">
  <div className="h-full flex flex-col">
    <ErrorBanner />
    <div className="flex-1 overflow-hidden">
      <LayoutMainContent />
    </div>
  </div>
</main>
```

## 🎨 Layout Styling Standards

### **Theme Integration (MANDATORY)**
```tsx
// ✅ CORRECT - All layout components use theme variables
className="bg-background text-text app-border"
className="bg-surface hover:bg-surface-hover"
className="bg-gradient-to-r from-background to-surface"

// ❌ WRONG - Hardcoded colors break theming
className="bg-gray-900 text-white border-gray-700"
```

### **Desktop Spacing Standards**
```tsx
// ✅ CORRECT - Desktop application spacing
<TitleBar className="h-9" />                    // Fixed 36px height
<StatusBar className="h-6" />                   // Fixed 24px height
<Sidebar className="w-12" />                    // Collapsed: 48px
<SidePanel className="w-64" />                  // Expanded: 256px
<div className="flex-1 flex min-h-0" />         // Flexible content
```

### **Responsive Behavior**
```tsx
// ✅ CORRECT - Desktop-first responsive design
<div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
  {/* Adapts to screen size while maintaining desktop feel */}
</div>

// ✅ CORRECT - Sidebar responsive behavior
<LayoutSidebar className={`
  ${isExpanded ? 'w-64' : 'w-12'}
  transition-all duration-300
  lg:static absolute lg:translate-x-0
  ${isMobile && !isExpanded ? '-translate-x-full' : ''}
`} />
```

## 🔧 Component Architecture Standards

### **Layout Component Size Limits (ENFORCED)**
- **Layout.tsx**: < 80 lines (orchestration only)
- **TitleBar.tsx**: < 100 lines (composition and event handling)
- **LayoutSidebar.tsx**: < 80 lines (positioning logic)
- **MainContent.tsx**: < 80 lines (routing logic)
- **StatusBar.tsx**: < 50 lines (simple status display)

### **Hook-Based Architecture (REQUIRED)**
```tsx
// ✅ CORRECT - Extract complex logic to hooks
const Layout = () => {
  const layoutState = useLayoutState()
  const layoutServices = useLayoutServices()
  const layoutKeyboard = useLayoutKeyboard()
  const layoutEffects = useLayoutEffects()
  
  return (
    <div className={layoutState.cssClasses}>
      {/* Simple composition only */}
    </div>
  )
}

// ❌ WRONG - Complex logic in component
const Layout = () => {
  const [tabs, setTabs] = useState([])
  const [activeTab, setActiveTab] = useState(null)
  // ... 200 lines of state management
}
```

### **Service Integration Pattern (REQUIRED)**
```tsx
// ✅ CORRECT - Service-based architecture
const layoutServices = useLayoutServices({
  addTab: layoutState.addTab,
  removeTab: layoutState.removeTab,
  updateSetting: layoutState.updateSetting,
})

// Services handle all business logic
const tabService = useService('tab')
const settingsService = useService('settings')
```

## 🎯 Desktop Application Patterns

### **Electron Integration (REQUIRED)**
```tsx
// ✅ CORRECT - Platform-aware behavior
const { isElectron, maximizeWindow, minimizeWindow } = usePlatform()

// Window controls
<WindowControls 
  onMaximize={() => isElectron() && maximizeWindow()}
  onMinimize={() => isElectron() && minimizeWindow()}
/>

// Draggable regions
<header style={{ WebkitAppRegion: 'drag' }}>
  <div style={{ WebkitAppRegion: 'no-drag' }}>
    <AppControls />
  </div>
</header>
```

### **Tab Management (REQUIRED)**
```tsx
// ✅ CORRECT - Complete tab lifecycle management
interface TabState {
  tabs: Tab[]
  activeTabId: string | null
  addTab: (tab: Tab) => void
  removeTab: (id: string) => void
  reorderTabs: (newOrder: Tab[]) => void
  setActiveTab: (id: string) => void
}

// Tab persistence
useEffect(() => {
  settingsService.saveTabs(tabs)
}, [tabs])
```

### **Keyboard Shortcuts (REQUIRED)**
```tsx
// ✅ CORRECT - Desktop keyboard shortcuts
useLayoutKeyboard({
  'Ctrl+K': () => openSpotlightSearch(),
  'Ctrl+T': () => openNewTab(),
  'Ctrl+W': () => closeActiveTab(),
  'Ctrl+Tab': () => nextTab(),
  'Ctrl+Shift+Tab': () => previousTab(),
  'Ctrl+,': () => openSettings(),
})
```

## 🔒 Quality Standards

### **Accessibility Requirements (MANDATORY)**
```tsx
// ✅ CORRECT - Semantic layout structure
<div role="application" aria-label="Detox Tool Application">
  <header role="banner" aria-label="Application header">
    <TitleBar />
  </header>
  <div role="main" aria-label="Main application content">
    <nav role="navigation" aria-label="Page navigation">
      <LayoutSidebar />
    </nav>
    <main role="main" aria-label="Active page content">
      <LayoutMainContent />
    </main>
  </div>
  <footer role="contentinfo" aria-label="Application status">
    <StatusBar />
  </footer>
</div>
```

### **Error Handling (REQUIRED)**
```tsx
// ✅ CORRECT - Comprehensive error boundaries
<ErrorBoundary
  fallback={<LayoutErrorFallback />}
  onError={(error) => console.error('Layout error:', error)}
>
  <Layout />
</ErrorBoundary>

// Component-level error handling
const handleLayoutError = useCallback((error: Error) => {
  console.error('Layout component error:', error)
  toast.error('Layout Error', 'Please refresh the application')
}, [])
```

### **Performance Standards (REQUIRED)**
```tsx
// ✅ CORRECT - Optimized rendering
const MemoizedSidebar = React.memo(LayoutSidebar)
const MemoizedMainContent = React.memo(LayoutMainContent)

// Lazy loading for heavy components
const LazySpotlightSearch = React.lazy(() => import('@/components/search/SpotlightSearch'))
```

## 🎭 Animation Standards

### **Layout Transitions (REQUIRED)**
```tsx
// ✅ CORRECT - Smooth layout transitions
<LayoutSidebar className={`
  transition-all duration-300 ease-in-out
  ${isExpanded ? 'w-64' : 'w-12'}
  motion-reduce:transition-none
`} />

// Respect user preferences
const prefersReducedMotion = useReducedMotion()
const transitionClass = prefersReducedMotion ? '' : 'transition-all duration-300'
```

### **Micro-interactions (REQUIRED)**
```tsx
// ✅ CORRECT - Subtle hover effects
<TabItem className="
  hover:bg-surface-hover
  motion-safe:hover:scale-[1.02]
  transition-all duration-200
  focus:ring-2 focus:ring-accent
" />
```

## 📋 Implementation Checklist

### **Before Implementation**
- [ ] Review this gold standard document
- [ ] Understand task-writer reference implementation
- [ ] Verify component size limits
- [ ] Plan hook extraction strategy

### **During Implementation**
- [ ] Use only theme variables (no hardcoded colors)
- [ ] Implement proper error boundaries
- [ ] Add comprehensive accessibility
- [ ] Extract complex logic to hooks
- [ ] Test with all 48 theme variants

### **After Implementation**
- [ ] Verify component size limits
- [ ] Test keyboard navigation
- [ ] Validate accessibility with screen reader
- [ ] Test responsive behavior
- [ ] Verify Electron integration works

## 🚨 Common Violations

### **Layout Structure Violations**
```tsx
// ❌ WRONG - Incorrect hierarchy
<div>
  <div>Title</div>
  <div>Content</div>
</div>

// ❌ WRONG - Missing semantic structure
<div className="layout">
  <div className="header">
    <div className="tabs">
```

### **Styling Violations**
```tsx
// ❌ WRONG - Hardcoded dimensions
<div style={{ width: '250px', height: '40px' }}>

// ❌ WRONG - Hardcoded colors
<div className="bg-blue-600 text-white">
```

### **Architecture Violations**
```tsx
// ❌ WRONG - Complex logic in component
const Layout = () => {
  const [tabs, setTabs] = useState([])
  const [settings, setSettings] = useState({})
  
  useEffect(() => {
    // 50 lines of logic
  }, [])
  
  const handleTabClick = (id) => {
    // 20 lines of logic
  }
  
  // 150+ lines total
}
```

## 📚 Reference Implementation

- **Task-Writer Layout**: `/mnt/c/projects/task-writer/frontend/app/src/components/layout/`
- **Style Guide**: `/mnt/c/projects/docs/STYLE_GUIDE.md`
- **Theme System**: `/mnt/c/projects/detox-tool/frontend/docs/THEMES_COMPLETE_REFERENCE.md`

---

**This layout architecture standard is MANDATORY for all layout components. Non-compliance will require refactoring before implementation can proceed.**