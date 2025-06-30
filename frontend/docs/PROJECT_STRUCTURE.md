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

## 🧩 Components Architecture (Complete 30-Phase Structure)

```
components/
├── 📁 layout/                       # Core layout orchestration (MAX 80 lines each)
│   ├── 📄 Layout.tsx                # Main layout orchestrator (< 80 lines)
│   ├── 📄 TitleBar.tsx              # Title bar with tabs (< 100 lines)
│   ├── 📄 LayoutSidebar.tsx         # Sidebar positioning (< 80 lines)
│   ├── 📄 Sidebar.tsx               # Navigation container (< 100 lines)
│   ├── 📄 SidePanel.tsx             # Contextual panels (< 80 lines)
│   ├── 📄 LayoutMainContent.tsx     # Page routing (< 80 lines)
│   └── 📄 StatusBar.tsx             # Bottom status (< 50 lines)
├── 📁 titlebar/                     # Title bar controls (Phases 21-22)
│   ├── 📄 TabBar.tsx                # Tab management (< 150 lines)
│   ├── 📄 AppControls.tsx           # App-level controls
│   └── 📄 WindowControls.tsx        # Native window controls
├── 📁 features/                     # Feature-specific components (MAX 150 lines each)
│   ├── 📁 tabbar/                   # Tab bar subcomponents (Phase 23)
│   │   ├── 📄 TabBarScrollable.tsx  # Scrollable tab container
│   │   ├── 📄 TabBarControls.tsx    # Scroll control buttons
│   │   └── 📄 TabItem.tsx           # Individual tab component
│   ├── 📁 deobfuscator/             # Main deobfuscation tool (Phase 13)
│   │   ├── 📄 DeobfuscatorMain.tsx  # Main deobfuscation interface
│   │   ├── 📄 ControlPanel.tsx      # Options panel
│   │   └── 📄 ResultsDisplay.tsx    # Results viewer
│   ├── 📁 editor/                   # Monaco editor integration (Phase 11)
│   │   ├── 📄 CodeEditor.tsx        # Monaco wrapper
│   │   ├── 📄 EditorControls.tsx    # Editor toolbar
│   │   └── 📄 SyntaxHighlight.tsx   # Syntax highlighting
│   ├── 📁 file-explorer/            # File management interface (Phase 27)
│   │   ├── 📄 FileTree.tsx          # Directory browsing
│   │   ├── 📄 FileItem.tsx          # Individual file component
│   │   └── 📄 FileContextMenu.tsx   # File operations menu
│   ├── 📁 comparison/               # Results comparison (Phase 28)
│   │   ├── 📄 CodeComparison.tsx    # Side-by-side diff view
│   │   ├── 📄 DiffViewer.tsx        # Diff highlighting
│   │   └── 📄 ComparisonStats.tsx   # Statistics display
│   ├── 📁 security/                 # Security analysis (Phase 29)
│   │   ├── 📄 SecurityAnalysis.tsx  # Vulnerability scanning UI
│   │   ├── 📄 ThreatIndicator.tsx   # Threat level display
│   │   └── 📄 SecurityReport.tsx    # Report generation
│   ├── 📁 settings/                 # Settings configuration UI (Phase 9)
│   │   ├── 📄 Settings.tsx          # Main settings UI
│   │   ├── 📄 ThemeSelector.tsx     # Theme selection
│   │   └── 📄 SettingsPanel.tsx     # Settings sidebar panel
│   ├── 📁 spotlight-search/         # Global spotlight search (Phase 15)
│   │   ├── 📄 SearchInput.tsx       # Search input field
│   │   ├── 📄 SearchResults.tsx     # Results display
│   │   └── 📄 SearchEmptyState.tsx  # No results state
│   ├── 📁 notifications/            # Toast notification system (Phase 16)
│   │   ├── 📄 ToastContainer.tsx    # Toast container
│   │   └── 📄 ToastItem.tsx         # Individual toast
│   └── 📁 welcome/                  # Welcome page components (Phase 7)
│       ├── 📄 WelcomeHeader.tsx     # Welcome page header
│       └── 📄 WelcomeFeatureCard.tsx # Feature showcase cards
├── 📁 sidebar/                      # Sidebar navigation (Phases 24-25)
│   ├── 📄 CollapseButton.tsx        # Panel expand/collapse
│   ├── 📄 NavigationItems.tsx       # Auto-discovery navigation
│   ├── 📄 NavItem.tsx               # Individual nav item
│   └── 📄 SettingsButton.tsx        # Settings access button
├── 📁 menu/                         # Application menu (Phase 20)
│   ├── 📄 MenuButton.tsx            # Main menu button
│   ├── 📄 DropdownMenu.tsx          # Menu container
│   ├── 📄 MenuItem.tsx              # Individual menu item
│   └── 📄 Submenu.tsx               # Nested submenus
├── 📁 search/                       # Global search (Phase 15)
│   └── 📄 SpotlightSearch.tsx       # Main search modal
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

**Style Guide Compliance**: ALL components must follow the gold standards in:
- [Style Guide](/mnt/c/projects/docs/STYLE_GUIDE.md) - Theme system, accessibility, animations
- [Layout Architecture Standard](LAYOUT_ARCHITECTURE_STANDARD.md) - Component hierarchy
- [Component Architecture Standard](COMPONENT_ARCHITECTURE_STANDARD.md) - Size limits, patterns

## 📄 Pages Architecture (Auto-Discovery Pattern)

Following the task-writer architecture, pages are organized with their associated panels:

```
pages/
├── 📄 WelcomePage.tsx               # Landing page (root level)
├── 📁 deobfuscator/                 # Main deobfuscation tool
│   ├── 📄 DeobfuscatorPage.tsx      # Main tool page
│   └── 📄 DeobfuscatorPanel.tsx     # Associated sidebar panel
├── 📁 settings/                     # Application settings
│   ├── 📄 SettingsPage.tsx          # Settings configuration
│   └── 📄 SettingsPanel.tsx         # Settings sidebar panel
├── 📁 help/                         # Help and documentation
│   ├── 📄 HelpPage.tsx              # Help content
│   └── 📄 HelpPanel.tsx             # Help navigation panel
└── 📁 about/                        # About information
    ├── 📄 AboutPage.tsx             # About content
    └── 📄 AboutPanel.tsx            # About details panel
```

**Page Requirements**:
- **Navigation Config**: Each page MUST export `navigationConfig`
- **Single Responsibility**: Pages < 100 lines (orchestration only)
- **Panel Association**: Pages with panels get sidebar panel when active
- **Auto-Discovery**: Pages automatically discovered by navigation system

## 🔧 Services Architecture (Business Logic Layer)

All business logic is extracted to services following dependency injection patterns:

```
services/
├── 📄 appService.ts                 # Application coordination
├── 📄 platformService.ts            # Platform abstraction (Electron/browser)
├── 📄 settingsService.ts            # Settings persistence
├── 📄 toastService.ts               # Notification system
├── 📄 healthService.ts              # Backend health monitoring
├── 📄 tabService.ts                 # Tab state management
├── 📄 fileService.ts                # File operations
├── 📄 deobfuscationService.ts       # Deobfuscation API integration
├── 📄 analysisService.ts            # Code analysis
├── 📄 searchService.ts              # Global search functionality
├── 📄 keyboardService.ts            # Keyboard shortcut management
└── 📄 index.ts                      # Service registry and DI
```

## 🪝 Hooks Architecture (State Management)

Custom hooks extract complex state logic from components:

```
hooks/
├── 📄 useSettings.ts                # Settings state management
├── 📄 useTabs.ts                    # Tab state management
├── 📄 useFileOperations.ts          # File operation state
├── 📄 useDeobfuscation.ts           # Deobfuscation state
├── 📄 useCodeAnalysis.ts            # Analysis state
├── 📄 useSpotlightSearch.ts         # Search state management
├── 📄 useToast.ts                   # Toast notification state
├── 📄 useKeyboardShortcuts.ts       # Shortcut management
├── 📄 useLayoutState.ts             # Layout orchestration state
├── 📄 useLayoutServices.ts          # Layout service coordination
├── 📄 useLayoutKeyboard.ts          # Layout keyboard shortcuts
├── 📄 useLayoutEffects.ts           # Layout side effects
├── 📄 useTabBarDragDrop.ts          # Tab drag & drop logic
├── 📄 useTabBarScroll.ts            # Tab scrolling logic
├── 📄 useWelcomeAnimations.ts       # Welcome page animations
├── 📄 useWelcomeState.ts            # Welcome page state
├── 📄 useReducedMotion.ts           # Motion preference detection
└── 📄 usePlatform.ts                # Platform detection
```

## 🎨 Styles Architecture (Theme System)

Complete CSS organization with theme support:

```
styles/
├── 📄 index.css                     # Global styles entry point
├── 📄 variables.css                 # CSS custom properties
├── 📄 themes.css                    # All 48 theme variants
├── 📄 settings.css                  # User setting overrides
├── 📄 borders.css                   # Border system
├── 📄 effects.css                   # Enhanced theme effects
└── 📄 animations.css                # Motion-safe animations
```

## ⚙️ Configuration Architecture

Application configuration and auto-discovery:

```
config/
├── 📄 navigationConfig.tsx          # Auto-discovery navigation
├── 📄 welcomeFeatures.ts            # Welcome page feature definitions
├── 📄 themeConfig.ts                # Theme configuration
└── 📄 keyboardConfig.ts             # Keyboard shortcuts
```

## 🔧 TypeScript Types Architecture

Comprehensive type definitions:

```
types/
├── 📄 navigation.ts                 # Navigation and routing types
├── 📄 tab.ts                        # Tab management types
├── 📄 theme.ts                      # Theming system types
├── 📄 platform.ts                   # Platform abstraction types
├── 📄 deobfuscation.ts              # Tool-specific types
├── 📄 api.ts                        # Backend API request/response types
├── 📄 settings.ts                   # Settings configuration types
├── 📄 search.ts                     # Search functionality types
├── 📄 file.ts                       # File operation types
├── 📄 analysis.ts                   # Code analysis types
└── 📄 electron-api.d.ts             # Electron API definitions
```

## 🛠️ Utilities Architecture

Helper functions and utilities:

```
utils/
├── 📄 cn.ts                         # Class name utility (clsx + tailwind-merge)
├── 📄 theme.ts                      # Theme manipulation utilities
├── 📄 keyboard.ts                   # Keyboard event utilities
├── 📄 file.ts                       # File handling utilities
├── 📄 validation.ts                 # Input validation utilities
├── 📄 animation.ts                  # Animation utilities
├── 📄 platform.ts                   # Platform detection utilities
└── 📄 index.ts                      # Utility barrel exports
```

## 🖼️ Assets Architecture

Static assets organization:

```
assets/
├── 📁 icons/                        # SVG icons and custom graphics
│   ├── 📄 detox-logo.svg           # Application logo
│   ├── 📄 file-types/              # File type icons
│   └── 📄 tools/                   # Tool-specific icons
├── 📁 images/                       # Static images
│   ├── 📄 welcome-bg.png           # Welcome page background
│   └── 📄 security-badges/         # Security analysis badges
└── 📁 fonts/                       # Custom fonts (if needed)
    └── 📄 JetBrainsMono.woff2      # Monospace font for code
```

## 📋 Implementation Standards

### File Organization Requirements
- **Barrel Exports**: Every feature folder MUST include `index.ts` with exports
- **Component Naming**: PascalCase for components, camelCase for utilities
- **File Extensions**: `.tsx` for components, `.ts` for utilities/services
- **Import Paths**: Use `@/` alias for all internal imports

### Documentation Requirements  
- **Component Headers**: Each file MUST include purpose and line limit comment
- **Interface Documentation**: All props and types MUST be documented
- **Implementation Examples**: See [Implementation Examples](IMPLEMENTATION_EXAMPLES.md)

### Quality Assurance
- **Size Enforcement**: Automated checks for component line limits
- **Theme Compliance**: All components tested with 48 theme variants
- **Accessibility**: WCAG 2.1 AA compliance verified for all components
- **Performance**: Code splitting and lazy loading for large features

---

**This structure supports the complete 30-phase implementation plan with professional desktop application architecture.**