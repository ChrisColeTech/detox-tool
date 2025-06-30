# Detox Tool - Complete Implementation Plan

Based on comprehensive analysis of the task-writer reference implementation and architecture documentation, this plan provides a systematic approach to implementing the detox-tool frontend following proven patterns.

## 🎯 Overview

The detox-tool will implement a tab-based desktop application interface for JavaScript deobfuscation, following the exact architecture patterns from task-writer. The implementation will be broken down into single-feature phases, with each phase being fully completed before moving to the next.

## 📋 Phase Breakdown

**Total Implementation Time**: 600 minutes (10 hours) across 8 focused phases  
**Average Phase Duration**: 75 minutes (1.25 hours)  
**Phase range**: 60-90 minutes each

### Phase 1: Foundation & Architecture (PRIORITY 1)
**Goal**: Establish working layout shell with basic navigation  
**Time Estimate**: 90 minutes (1.5 hours)

#### 1.1 Project Structure Setup
- [ ] Delete current `/src` folder completely
- [ ] Create new directory structure following task-writer pattern
- [ ] Copy and adapt core configuration files (Vite, TypeScript, etc.)
- [ ] Install necessary dependencies from task-writer

#### 1.2 Core Types & Interfaces
- [ ] Create `/src/types/navigation.ts` - Navigation type definitions
- [ ] Create `/src/types/tab.ts` - Tab management types  
- [ ] Create `/src/types/settings.ts` - Settings and theming types
- [ ] Create `/src/types/deobfuscation.ts` - Tool-specific types
- [ ] Create `/src/types/platform.ts` - Platform abstraction types
- [ ] Create `/src/types/search.ts` - Search functionality types
- [ ] Create `/src/types/theme.ts` - Theming system types
- [ ] Create `/src/types/sidebar.ts` - Sidebar and panel types
- [ ] Create `/src/types/layout.ts` - Layout component types
- [ ] Create `/src/types/electron-api.d.ts` - Electron API type definitions

#### 1.3 Service Layer Foundation
- [ ] Create `/src/services/appService.ts` - Central application coordination
- [ ] Create `/src/services/tabService.ts` - Tab state management
- [ ] Create `/src/services/platformService.ts` - Platform abstraction interface
- [ ] Create `/src/services/electronService.ts` - Electron-specific implementations
- [ ] Create `/src/services/browserService.ts` - Browser-specific implementations
- [ ] Create `/src/services/settingsService.ts` - Settings persistence
- [ ] Create `/src/services/navigationService.ts` - Navigation and routing service
- [ ] Create `/src/services/searchService.ts` - Search functionality service
- [ ] Create `/src/services/toastService.ts` - Notification service
- [ ] Create `/src/services/keyboardService.ts` - Keyboard shortcut service

#### 1.4 Configuration and Auto-Discovery
- [ ] Create `/src/config/navigationConfig.tsx` - Auto-discovery implementation
- [ ] Create `/src/config/themeConfig.ts` - Theme definitions and utilities
- [ ] Create `/src/config/keyboardConfig.ts` - Keyboard shortcut definitions
- [ ] Create `/src/config/searchConfig.ts` - Search data and configuration
- [ ] Implement page module scanning with `import.meta.glob()`
- [ ] Create navigation item registration system
- [ ] Add TypeScript validation for navigation configs

**Success Criteria**: Services are instantiated, navigation discovery works, types are defined

### Phase 2: Layout Shell (PRIORITY 1)
**Goal**: Working layout with title bar, sidebar, and main content area  
**Time Estimate**: 90 minutes (1.5 hours)

#### 2.1 Custom Hooks for State Management
- [ ] Create `/src/hooks/useLayoutState.ts` - Layout state orchestration
- [ ] Create `/src/hooks/useLayoutServices.ts` - Service dependency injection
- [ ] Create `/src/hooks/useLayoutKeyboard.ts` - Global keyboard shortcuts
- [ ] Create `/src/hooks/useTabs.ts` - Tab management state
- [ ] Create `/src/hooks/useSettings.ts` - Settings state with persistence
- [ ] Create `/src/hooks/usePlatform.ts` - Platform detection and services
- [ ] Create `/src/hooks/useReducedMotion.ts` - Animation preferences
- [ ] Create `/src/hooks/useSidebar.ts` - Sidebar state and navigation
- [ ] Create `/src/hooks/useKeyboardShortcuts.ts` - Application-wide shortcuts

#### 2.2 Layout Components Architecture
- [ ] Create `/src/components/layout/Layout.tsx` - Main layout orchestrator (< 80 lines)
- [ ] Create `/src/components/layout/TitleBar.tsx` - Title bar with tabs and controls
- [ ] Create `/src/components/layout/Sidebar.tsx` - Sidebar navigation container
- [ ] Create `/src/components/layout/MainContent.tsx` - Main content area router
- [ ] Create `/src/components/layout/StatusBar.tsx` - Bottom status bar

#### 2.3 Basic Page System and Utilities
- [ ] Create `/src/pages/WelcomePage.tsx` - Landing page with navigation config
- [ ] Create `/src/pages/DeobfuscatorPage.tsx` - Main tool page stub
- [ ] Create `/src/pages/SettingsPage.tsx` - Settings page stub
- [ ] Create `/src/pages/HelpPage.tsx` - Help and documentation page
- [ ] Create `/src/pages/AboutPage.tsx` - About and version information
- [ ] Create `/src/utils/cn.ts` - Class name utility (clsx wrapper)
- [ ] Create `/src/utils/themeUtils.ts` - Theme manipulation utilities
- [ ] Create `/src/utils/keyboardUtils.ts` - Keyboard shortcut utilities
- [ ] Create `/src/utils/iconUtils.ts` - Icon sizing and context utilities
- [ ] Implement page component resolution and rendering

#### 2.4 Panel System Foundation
- [ ] Create `/src/pages/panels/DeobfuscatorPanel.tsx` - Deobfuscator tools panel
- [ ] Create `/src/pages/panels/FileExplorerPanel.tsx` - File browser panel
- [ ] Create `/src/pages/panels/SettingsPanel.tsx` - Quick settings panel
- [ ] Implement panel auto-discovery system
- [ ] Add panel visibility management to sidebar

#### 2.5 CSS and Theming Foundation
- [ ] Create `/src/styles/variables.css` - CSS custom properties foundation
- [ ] Create `/src/styles/themes.css` - All 12 color schemes with 4 variants each
- [ ] Create `/src/styles/settings.css` - User preference scaling (font/icon)
- [ ] Create `/src/styles/borders.css` - Border system and thickness variants
- [ ] Create `/src/styles/base.css` - Base styles and Tailwind integration
- [ ] Create `/src/styles/components.css` - Component-specific styling
- [ ] Implement basic light/dark theme switching

**Success Criteria**: App loads with working layout, tabs work, sidebar navigation works, pages render

### Phase 3: Tab System (PRIORITY 2)
**Goal**: Complete tab management with drag & drop, persistence, and controls  
**Time Estimate**: 75 minutes (1.25 hours)

#### 3.1 Tab Bar Implementation  
- [ ] Create `/src/components/features/tabbar/TabBarScrollable.tsx` - Scrollable tab container
- [ ] Create `/src/components/features/tabbar/TabItem.tsx` - Individual tab component
- [ ] Create `/src/components/features/tabbar/TabBarControls.tsx` - Tab controls
- [ ] Implement tab rendering in TitleBar component

#### 3.2 Tab Management Features
- [ ] Create `/src/hooks/useTabBarDragDrop.ts` - Drag & drop functionality
- [ ] Create `/src/hooks/useTabBarScroll.ts` - Tab bar scrolling
- [ ] Implement tab reordering with drag & drop
- [ ] Add tab close buttons and context menus

#### 3.3 Tab Persistence
- [ ] Implement tab state saving to localStorage/platform storage
- [ ] Add tab restoration on application startup
- [ ] Handle tab metadata persistence for tool state
- [ ] Implement tab dirty state (unsaved changes)

**Success Criteria**: Tabs can be opened, closed, reordered, persist across sessions

### Phase 4: Theming System (PRIORITY 2)
**Goal**: Complete 12-color scheme theming with dual-dimension support  
**Time Estimate**: 90 minutes (1.5 hours)

#### 4.1 Color Scheme Implementation
- [ ] Create `/src/styles/themes.css` - All 12 detox-tool specific color schemes
- [ ] Implement Code Detective, Reverse Engineer, Malware Hunter, Script Sleuth themes
- [ ] Add Debug Master, Hex Analyst, Binary Explorer, Cyber Forensics themes
- [ ] Add Code Breaker, Threat Hunter, Digital Archaeologist, Obfuscation Buster themes
- [ ] Create theme switching infrastructure with proper CSS specificity order
- [ ] Implement enhanced effects: matrix effects for Binary Explorer, neon glows for Cyber Forensics

#### 4.2 Dual-Dimension Theming
- [ ] Implement Light/Dark mode for each color scheme (24 combinations)
- [ ] Add High Contrast Light/Dark variants (48 total theme combinations)
- [ ] Ensure proper CSS class generation order: color scheme → dark → high contrast
- [ ] Create theme preview system in settings
- [ ] Add theme persistence and restoration
- [ ] Test independence of color scheme and mode dimensions

#### 4.3 Advanced Theming Features
- [ ] Implement font size scaling (small, medium, large) with CSS calc()
- [ ] Add icon size scaling options with context-aware utilities
- [ ] Create border thickness options (none, thin, medium, thick)
- [ ] Implement app-border system instead of hardcoded Tailwind borders
- [ ] Add theme application throughout all components
- [ ] Create animation support with reduced motion preferences

**Success Criteria**: All 48 theme variants work, settings allow theme customization, themes persist

### Phase 5: Deobfuscation Core (PRIORITY 3)
**Goal**: Main deobfuscation tool interface with Monaco editor integration  
**Time Estimate**: 90 minutes (1.5 hours)

#### 5.1 Monaco Editor Integration
- [ ] Install and configure Monaco Editor for React
- [ ] Create `/src/components/features/editor/CodeEditor.tsx` - Monaco wrapper
- [ ] Implement syntax highlighting for JavaScript/TypeScript
- [ ] Add code formatting and validation features

#### 5.2 File Management System
- [ ] Create `/src/components/features/file-explorer/FileExplorer.tsx` - File tree component
- [ ] Create `/src/hooks/useFileTreeState.ts` - File tree state management
- [ ] Implement file loading and saving functionality
- [ ] Add support for multiple file formats

#### 5.3 Deobfuscation Engine Integration
- [ ] Create `/src/services/DeobfuscationService.ts` - Engine coordination service
- [ ] Integrate with existing backend deobfuscation engines
- [ ] Create deobfuscation progress tracking
- [ ] Implement result display and comparison

#### 5.4 Tool-Specific UI Components
- [ ] Create `/src/components/features/deobfuscator/DeobfuscatorMain.tsx` - Main tool interface
- [ ] Create `/src/components/features/deobfuscator/AnalysisPanel.tsx` - Code analysis display
- [ ] Create `/src/components/features/deobfuscator/ResultsPanel.tsx` - Deobfuscation results
- [ ] Create `/src/components/features/deobfuscator/ProgressIndicator.tsx` - Processing progress

**Success Criteria**: Files can be loaded, edited in Monaco, deobfuscated, and results displayed

### Phase 6: Search System (PRIORITY 3)
**Goal**: Global spotlight search across files and features  
**Time Estimate**: 60 minutes (1 hour)

#### 6.1 Search Infrastructure
- [ ] Create `/src/components/features/search/SpotlightSearch.tsx` - Main search component
- [ ] Create `/src/components/features/titlebar/AppControls.tsx` - Search button in title bar
- [ ] Create `/src/hooks/useSpotlightSearch.ts` - Search state management
- [ ] Create `/src/hooks/useSpotlightKeyboard.ts` - Search keyboard navigation
- [ ] Create `/src/services/searchService.ts` - Search functionality
- [ ] Create `/src/utils/searchUtils.ts` - Search algorithm and scoring

#### 6.2 Search Features
- [ ] Implement global search modal with Ctrl+F/Cmd+F shortcut
- [ ] Add navigation item search
- [ ] Add command search (settings, actions, etc.)
- [ ] Add file content search (when implemented)
- [ ] Create search data repository with 27+ searchable items
- [ ] Implement fuzzy search with relevance scoring
- [ ] Add category-based result organization

#### 6.3 Search UI Components
- [ ] Create `/src/components/features/search/SearchInput.tsx` - Search input field
- [ ] Create `/src/components/features/search/SearchResults.tsx` - Results display
- [ ] Create `/src/components/features/search/SearchEmptyState.tsx` - No results state
- [ ] Create `/src/components/features/search/SearchCategories.tsx` - Result categorization
- [ ] Add category icons and visual hierarchy for search results

**Success Criteria**: Ctrl+K opens search, can search navigation/commands, results navigate properly

### Phase 7: Settings System (PRIORITY 4)
**Goal**: Complete settings interface with all customization options  
**Time Estimate**: 75 minutes (1.25 hours)

#### 7.1 Settings UI Implementation
- [ ] Create `/src/components/features/settings/Settings.tsx` - Main settings component
- [ ] Create `/src/components/features/settings/AppearanceSettings.tsx` - Theme and appearance
- [ ] Create `/src/components/features/settings/LayoutSettings.tsx` - Layout customization
- [ ] Create `/src/components/features/settings/DeobfuscationSettings.tsx` - Tool-specific settings

#### 7.2 Settings Infrastructure
- [ ] Create `/src/hooks/useSettings.ts` - Settings state management hook
- [ ] Implement settings persistence to platform storage
- [ ] Add settings validation and migration
- [ ] Create settings export/import functionality

#### 7.3 Shared Form Components
- [ ] Create `/src/components/shared/forms/SettingsSection.tsx` - Settings section wrapper
- [ ] Create `/src/components/shared/forms/FormField.tsx` - Generic form field
- [ ] Create `/src/components/shared/forms/ThemeSelector.tsx` - Theme selection component
- [ ] Create `/src/components/shared/forms/ToggleSwitch.tsx` - Toggle control

**Success Criteria**: All settings can be configured, persist across sessions, UI is polished

### Phase 8: Advanced Features (PRIORITY 4)
**Goal**: Polish features and advanced functionality  
**Time Estimate**: 60 minutes (1 hour)

#### 8.1 Keyboard Shortcuts System
- [ ] Create `/src/hooks/useKeyboardShortcuts.ts` - Global shortcuts management
- [ ] Implement context-sensitive shortcuts for each page
- [ ] Add shortcut customization in settings
- [ ] Create shortcuts help overlay

#### 8.2 Advanced Panel Features
- [ ] Implement panel resizing and drag & drop
- [ ] Add panel docking and undocking
- [ ] Create panel persistence across sessions
- [ ] Add panel-specific keyboard shortcuts
- [ ] Implement panel context menus and actions

#### 8.3 Notification System
- [ ] Create `/src/components/ui/Toast.tsx` - Toast notification component
- [ ] Create `/src/components/features/notifications/ToastContainer.tsx` - Toast container
- [ ] Create `/src/hooks/useToast.ts` - Toast management hook
- [ ] Implement success, error, warning, info notifications
- [ ] Add notification persistence and history
- [ ] Implement toast positioning that respects status bar visibility

#### 8.4 Error Handling & Recovery
- [ ] Create `/src/components/ui/ErrorBoundary.tsx` - React error boundary component
- [ ] Implement graceful error recovery mechanisms
- [ ] Add error reporting and logging
- [ ] Create user-friendly error messages
- [ ] Add error boundary integration to all major layout components

**Success Criteria**: App is robust, polished, and handles errors gracefully

## 🛠️ Technical Implementation Details

### Directory Structure & Architecture

For complete directory structure details, see **[PROJECT_STRUCTURE.md](PROJECT_STRUCTURE.md)** which provides:
- Complete file and directory organization
- Component architecture with size limits
- Service layer structure with dependency injection patterns
- Type system organization
- Style and theming file structure

### Key Architecture Patterns

#### Component Size Limits (MANDATORY - ENFORCED)
- **Page Components**: < 100 lines (orchestration only)
- **Feature Components**: < 150 lines (use composition)
- **Layout Components**: < 80 lines (focused responsibility)
- **UI Components**: < 100 lines (pure rendering)

**CRITICAL ENFORCEMENT RULES**:
1. **NO component may exceed its limit** - MUST refactor before proceeding
2. **Line count excludes imports and types** - only implementation code
3. **If refactoring is needed, STOP and refactor immediately**
4. **Use composition and custom hooks to reduce complexity**
5. **Single Responsibility Principle is NON-NEGOTIABLE**

#### State Management Strategy (ENFORCED PATTERNS)
- **Custom Hooks**: Own specific state domains (PREFERRED)
- **Service Coordination**: Business logic in services (REQUIRED)
- **Prop Drilling**: Simple parent-child communication (ACCEPTABLE)
- **Context**: Only for true application-wide state (RESTRICTED)

**MANDATORY RULES**:
1. **NO business logic in components** (FORBIDDEN)
2. **ALL state changes MUST go through hooks or services**
3. **ALL async operations MUST be in services**
4. **Components MUST be primarily declarative**
5. **Context ONLY for theme, settings, and authentication**

#### Navigation Configuration Pattern (ENFORCED)
Every page MUST export a navigation configuration:
```typescript
// REQUIRED PATTERN - NO EXCEPTIONS
export const navigationConfig: NavigationConfig = {
  id: 'deobfuscator',           // REQUIRED: kebab-case string
  label: 'Deobfuscator',        // REQUIRED: user-friendly display name
  iconComponent: Code,          // REQUIRED: Lucide React icon
  showInSidebar: true,          // REQUIRED: boolean visibility
  order: 1,                     // REQUIRED: numeric sort order
  keyboardShortcut: 'Ctrl+D'    // OPTIONAL: keyboard shortcut
}

// ENFORCEMENT RULES:
// 1. MUST be exported as named export 'navigationConfig'
// 2. MUST match NavigationConfig interface exactly
// 3. MUST use TypeScript - no 'any' types allowed
// 4. MUST be auto-discoverable via file naming (*Page.tsx)
```

#### Service Layer Pattern (ENFORCED ARCHITECTURE)
```typescript
// REQUIRED SERVICE PATTERN - MUST follow exactly
export class DeobfuscationService {
  constructor(
    private platformService: PlatformService,    // REQUIRED: dependency injection
    private toastService: ToastService            // REQUIRED: notification handling
  ) {}

  async deobfuscateFile(file: File): Promise<string> {
    try {
      // REQUIRED: All business logic in services
      const result = await this.processFile(file)
      
      // REQUIRED: User feedback for all operations
      this.toastService.success('Deobfuscation completed')
      return result
    } catch (error) {
      // REQUIRED: Error handling with user notification
      this.toastService.error('Deobfuscation failed', error.message)
      
      // REQUIRED: Re-throw for component error boundaries
      throw error
    }
  }
}

// ENFORCEMENT RULES:
// 1. ALL services MUST use dependency injection
// 2. ALL services MUST handle errors gracefully
// 3. ALL services MUST provide user feedback
// 4. ALL async operations MUST have proper error handling
// 5. NO services may import React components
```

### Testing Strategy (MANDATORY REQUIREMENTS)
Each phase includes:
- **Unit Tests**: Individual components and hooks (REQUIRED)
- **Integration Tests**: Feature workflows (REQUIRED)
- **Manual Testing**: User interaction flows (REQUIRED)
- **Build Verification**: Ensure application builds and runs (REQUIRED)

**TESTING ENFORCEMENT**:
1. **ALL services MUST have unit tests** (NON-NEGOTIABLE)
2. **ALL custom hooks MUST have tests**
3. **ALL components MUST be tested for accessibility**
4. **NO component without error boundary testing**
5. **Build MUST pass with ZERO TypeScript errors**
6. **ALL 48 theme variants MUST be tested**

**Testing Requirements Per Component Type**:
- **Page Components**: Navigation config, routing, error boundaries
- **Feature Components**: User interactions, error states, loading states
- **Layout Components**: Responsive behavior, theme application
- **UI Components**: Props, accessibility, theme variables
- **Services**: All methods, error handling, dependency injection

### Dependencies to Install
```json
{
  "dependencies": {
    "@monaco-editor/react": "^4.6.0",
    "framer-motion": "^10.16.16",
    "lucide-react": "^0.294.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "clsx": "^2.0.0",
    "tailwind-merge": "^2.2.0"
  },
  "devDependencies": {
    "@types/react": "^18.2.43",
    "@types/react-dom": "^18.2.17",
    "@vitejs/plugin-react": "^4.2.1",
    "autoprefixer": "^10.4.16",
    "postcss": "^8.4.32",
    "tailwindcss": "^3.3.6",
    "typescript": "^5.2.2",
    "vite": "^5.0.8"
  }
}
```

## 🎯 Success Metrics

### Phase Completion Criteria
- [ ] **Phase 1**: Application launches, services initialize, navigation discovery works
- [ ] **Phase 2**: Layout shell renders, basic navigation works, pages load
- [ ] **Phase 3**: Tabs open/close/reorder, persist across sessions
- [ ] **Phase 4**: All 48 theme variants work, themes persist and apply correctly
- [ ] **Phase 5**: Files load, Monaco editor works, deobfuscation processes
- [ ] **Phase 6**: Global search works with Ctrl+K, results navigate properly
- [ ] **Phase 7**: All settings can be configured and persist
- [ ] **Phase 8**: Application is production-ready with error handling

### Quality Gates (ENFORCED CHECKPOINTS)
**PHASE COMPLETION BLOCKERS** - Must pass ALL before proceeding:

1. **Code Quality Gates**:
   - ✅ All components under size limits (ENFORCED)
   - ✅ TypeScript compilation without errors (ZERO tolerance)
   - ✅ No console errors during normal operation
   - ✅ ESLint passes with no warnings
   - ✅ All components use theme variables (NO hardcoded colors)

2. **Architecture Compliance Gates**:
   - ✅ Single Responsibility Principle followed (MANDATORY)
   - ✅ All business logic in services (NO exceptions)
   - ✅ Proper error boundaries implemented
   - ✅ All auto-discovery patterns working
   - ✅ Dependency injection properly implemented

3. **Accessibility Gates** (WCAG 2.1 AA):
   - ✅ All features work with keyboard navigation
   - ✅ Screen reader compatibility verified
   - ✅ Color contrast meets AA standards
   - ✅ Focus indicators visible and functional
   - ✅ Reduced motion preferences respected

4. **Theme System Gates**:
   - ✅ All 48 theme variants functional
   - ✅ CSS specificity order correct
   - ✅ app-border classes used (NO Tailwind borders)
   - ✅ Settings persist across application restarts
   - ✅ Theme switching instant (no re-renders)

5. **Testing Gates**:
   - ✅ All services have unit tests
   - ✅ All components have accessibility tests
   - ✅ Integration tests pass
   - ✅ Build process completes successfully

**FAILURE PROTOCOL**: If ANY quality gate fails, STOP and fix before proceeding to next phase.

This implementation plan provides a systematic approach to building the detox-tool frontend while following the proven architecture patterns from task-writer. Each phase builds upon the previous one, ensuring a solid foundation at every step.

## 🚫 VIOLATION CONSEQUENCES

**ARCHITECTURAL VIOLATIONS WILL RESULT IN**:
1. **Immediate refactoring requirements**
2. **Phase completion blocking**
3. **Code review failures**
4. **Build pipeline failures**

**COMMON VIOLATIONS TO AVOID**:
- ❌ Components exceeding line limits
- ❌ Business logic in components
- ❌ Hardcoded colors instead of theme variables
- ❌ Missing error boundaries
- ❌ Poor TypeScript typing (any types)
- ❌ Manual registration instead of auto-discovery
- ❌ Missing accessibility features
- ❌ Improper state management patterns

**ENFORCEMENT TOOLS**:
- TypeScript strict mode
- ESLint with custom rules
- Pre-commit hooks
- Automated testing
- Code review checklists

**SUCCESS CRITERIA**: 100% compliance with architectural patterns at ALL times.

## 🔍 Complete Feature Inventory (ARCHITECTURE COMPLIANCE)

**ENFORCEMENT NOTE**: Every component listed below MUST follow the architectural patterns defined in this document. NO exceptions.

### Components (Total: 50+ components)
- **Layout Components**: 5 (Layout, TitleBar, Sidebar, MainContent, StatusBar)
- **Feature Components**: 25+ across 9 feature domains
- **UI Components**: 8 pure UI components
- **Shared Components**: 12 cross-feature components

### Pages & Panels (Auto-Discovery)
- **Pages**: 5 (Welcome, Deobfuscator, Settings, Help, About)
- **Panels**: 3+ (DeobfuscatorPanel, FileExplorerPanel, SettingsPanel)
- **Auto-Discovery**: Both pages and panels export configuration for automatic registration
- **Panel System**: Left/right sidebar panels with visibility management

### Services (Total: 12 services)
- **Core Services**: AppService, TabService, PlatformService, SettingsService
- **Platform Services**: ElectronService, BrowserService (platform-specific implementations)
- **Feature Services**: SearchService, NavigationService, DeobfuscationService
- **Utility Services**: FileService, ToastService, KeyboardService

### Hooks (Total: 16 hooks)
- **Layout Hooks**: useLayoutState, useLayoutServices, useLayoutKeyboard
- **Feature Hooks**: useTabs, useSettings, useSpotlightSearch, useDeobfuscation
- **UI Hooks**: useTabBarDragDrop, useTabBarScroll, useToast
- **System Hooks**: usePlatform, useReducedMotion, useKeyboardShortcuts, useSidebar

### Types (Total: 10 type files)
- **Core Types**: navigation (includes PanelConfig), tab, settings, platform, layout
- **Feature Types**: deobfuscation, search, theme, sidebar (panel management)
- **API Types**: electron-api definitions

### Auto-Discovery System (ENFORCED PATTERNS)
- **Page Discovery**: `import.meta.glob('../pages/**/[A-Z]*Page.tsx')` (REQUIRED)
- **Panel Discovery**: `import.meta.glob('../pages/panels/**/[A-Z]*Panel.tsx')` (REQUIRED)
- **Configuration Export**: Both pages and panels export config objects (MANDATORY)
- **Navigation Registration**: Automatic sidebar and routing setup (NO MANUAL REGISTRATION)

**ENFORCEMENT RULES**:
1. **File naming MUST follow pattern** (*Page.tsx, *Panel.tsx)
2. **ALL pages MUST export navigationConfig**
3. **ALL panels MUST export panelConfig**
4. **Configuration objects MUST be properly typed**
5. **NO manual registration allowed - everything auto-discovered**

### Theming System (48 total variants)
- **12 Detox-Tool Color Schemes** × **4 Mode Variants** each
- **On-Brand Themes**: Code Detective, Reverse Engineer, Malware Hunter, Script Sleuth, Debug Master, Hex Analyst, Binary Explorer, Cyber Forensics, Code Breaker, Threat Hunter, Digital Archaeologist, Obfuscation Buster
- **Enhanced Effects**: Matrix effects for Binary Explorer, neon glows for Cyber Forensics
- **Scaling Systems**: Font, icon, and border thickness options
- **CSS Architecture**: Proper specificity order and variable inheritance