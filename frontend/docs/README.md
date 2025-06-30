# Detox Tool Frontend

A modern React-based frontend for the JavaScript deobfuscation tool, built with TypeScript, Vite, and following the task-writer architecture patterns with comprehensive planning documentation.

## 🚧 Current Implementation Status

### ✅ Completed Planning Phase (100%)
- **📋 Documentation Complete**: Comprehensive planning documents created following task-writer patterns
- **🏗️ Architecture Analysis**: Thorough study of task-writer reference implementation 
- **📝 Implementation Plan**: Detailed 8-phase implementation roadmap with 63 specific tasks
- **🗂️ Project Structure**: Complete directory structure and component organization planned
- **🎨 Style Guide Integration**: WCAG 2.1 AA compliance and theme system requirements
- **🔧 Service Architecture**: Platform abstraction with Electron and browser implementations
- **🎯 Auto-Discovery System**: Navigation and panel auto-discovery patterns defined

### 🔄 Current State: Planning Complete, Ready for CLI Scaffolding

**Status**: All planning documentation is complete. Ready to scaffold with CLI and implement proper architecture.

```
Current Status:
├── ✅ Comprehensive planning documentation (100%)
├── ✅ Architecture requirements defined
├── ✅ 12 custom detox-tool themes designed
├── ✅ All 50+ components planned and documented
├── ✅ Service layer architecture defined
├── ✅ Auto-discovery patterns specified
├── ❌ CLI scaffolding not yet executed
├── ❌ Directory structure not yet created
├── ❌ Implementation not yet started
```

### 📋 Next Steps: CLI Scaffolding and Implementation
1. **Remove premature app folder**: Delete `/frontend/app` to prepare for proper CLI scaffolding
2. **CLI Scaffolding**: Use Vite to scaffold the React TypeScript application properly
3. **Shell Script Setup**: Create script to generate all planned directories and placeholder files
4. **Phase 1 Implementation**: Begin with foundation architecture

## 🏗️ Planned Architecture (From Documentation)

### Complete Feature Set (63 Implementation Tasks)

#### 🎯 Core Features (Phase 1-2)
- **Auto-Discovery Navigation**: Pages and panels auto-register via configuration exports
- **Service Layer Architecture**: Clean separation with dependency injection
- **Layout System**: TitleBar, Sidebar, MainContent, StatusBar with responsive design
- **Custom Hooks**: 16 hooks for state management and coordination
- **Platform Abstraction**: Electron + browser dual compatibility

#### 🎨 Theming System (Phase 4) - 48 Total Variants
**12 Custom Detox-Tool Color Schemes**:
- Code Detective, Reverse Engineer, Malware Hunter, Script Sleuth
- Debug Master, Hex Analyst, Binary Explorer, Cyber Forensics  
- Code Breaker, Threat Hunter, Digital Archaeologist, Obfuscation Buster

**4 Mode Variants per Scheme**:
- Light, Dark, High Contrast Light, High Contrast Dark

**Advanced Features**:
- Enhanced matrix effects for Binary Explorer theme
- Neon glows and cyber effects for Cyber Forensics theme
- Font scaling (small/medium/large)
- Icon scaling (small/medium/large)  
- Border thickness options (none/thin/medium/thick)

#### 🧩 Component Architecture (50+ Components)
- **Layout Components**: 5 (Layout, TitleBar, Sidebar, MainContent, StatusBar)
- **Feature Components**: 25+ across 9 feature domains
- **UI Components**: 8 pure UI components with theme support
- **Shared Components**: 12 cross-feature reusable components

#### 📄 Pages & Panels (Auto-Discovery)
**Pages (5)**:
- WelcomePage, DeobfuscatorPage, SettingsPage, HelpPage, AboutPage

**Panels (3+)**:
- DeobfuscatorPanel, FileExplorerPanel, SettingsPanel

#### 🔧 Services (12 Services)
- **Core**: AppService, TabService, PlatformService, SettingsService
- **Platform**: ElectronService, BrowserService  
- **Feature**: SearchService, NavigationService, DeobfuscationService
- **Utility**: FileService, ToastService, KeyboardService

#### 🎣 Custom Hooks (16 Hooks)
- **Layout**: useLayoutState, useLayoutServices, useLayoutKeyboard
- **Feature**: useTabs, useSettings, useSpotlightSearch, useDeobfuscation
- **UI**: useTabBarDragDrop, useTabBarScroll, useToast
- **System**: usePlatform, useReducedMotion, useKeyboardShortcuts, useSidebar

#### 🔍 Advanced Search System (Phase 6)
- **Global Spotlight Search**: Ctrl+F/Cmd+F shortcut (macOS compatible)
- **27+ Searchable Items**: Navigation, commands, settings, actions, files, content
- **Fuzzy Search**: Relevance scoring and category organization
- **Real-time Results**: Instant search with keyboard navigation and previews
- **File Content Search**: Search within code files across all open tabs
- **Command Palette**: Quick access to all application commands and actions
- **Search Categories**: Organized results by Navigation, Commands, Settings, Files, Actions

#### 🔔 Smart Notification System (Phase 8)
- **Toast Notifications**: Success, error, warning, and info messages with auto-dismiss
- **Progress Tracking**: Real-time progress indicators for long-running operations
- **Processing Logs**: Detailed output and error logging with searchable history
- **Status Updates**: Live status in status bar with processing state
- **Error Recovery**: Graceful error handling with user-friendly recovery options
- **Notification History**: Review past notifications and processing results

#### 💻 Professional Code Editor (Phase 5)
- **Monaco Editor Integration**: Full VS Code editor experience with syntax highlighting
- **Multi-Language Support**: JavaScript, TypeScript, JSON with intelligent code completion
- **Code Formatting**: Automatic code beautification with customizable formatting rules
- **Search & Replace**: Advanced find/replace with regex support across all open files
- **Code Folding**: Collapse/expand code sections for better navigation
- **Error Detection**: Real-time TypeScript/JavaScript error highlighting
- **Multiple Cursors**: Advanced text editing with multi-cursor support
- **Code Minimap**: Visual overview of large files with scroll navigation

#### 📁 Advanced File Management (Phase 5)
- **File Explorer Panel**: Tree-view file browser with folder navigation
- **Multi-format Support**: JavaScript, TypeScript, JSON, source maps, and web formats
- **Drag & Drop**: Drop files directly into the application for instant processing
- **File Tabs**: Work with multiple files simultaneously with tab management
- **Export Options**: Save results in various formats with batch export
- **Project Management**: Save and restore project states with file collections
- **File Comparison**: Side-by-side comparison of original vs deobfuscated code
- **Backup System**: Automatic backups of processed files

#### 📝 Types & Configuration (10 Type Files)
- Comprehensive TypeScript coverage with NO 'any' types
- Strict typing for navigation, panels, settings, themes
- Platform abstraction types for Electron/browser compatibility

### Project Architecture

For complete directory structure and component organization details, see:
- **[PROJECT_STRUCTURE.md](PROJECT_STRUCTURE.md)** - Complete architecture with 50+ components, services, and file organization
- **[IMPLEMENTATION_PLAN.md](IMPLEMENTATION_PLAN.md)** - Detailed 8-phase implementation roadmap with architectural enforcement

**Architecture Summary:**
- **50+ Components**: Organized by feature domains with strict size limits
- **12 Services**: Clean business logic separation with dependency injection  
- **16 Custom Hooks**: State management and coordination
- **10 Type Files**: Comprehensive TypeScript coverage
- **48 Theme Variants**: 12 color schemes × 4 mode combinations

## 🔥 Architectural Enforcement Rules

### Component Size Limits (MANDATORY - ENFORCED)
- **Page Components**: < 100 lines (orchestration only)
- **Feature Components**: < 150 lines (use composition)
- **Layout Components**: < 80 lines (focused responsibility)
- **UI Components**: < 100 lines (pure rendering)

**CRITICAL**: Any component exceeding limits MUST be refactored before proceeding.

### Style Guide Compliance (GOLD STANDARD)
Following `/mnt/c/projects/docs/STYLE_GUIDE.md` requirements:

#### Theme System (MANDATORY)
```tsx
// ✅ CORRECT - Uses theme variables (works with ALL 48 variants)
className="bg-surface text-text app-border hover:bg-surface-hover"

// ❌ WRONG - Hardcoded colors break theming
className="bg-blue-600 text-white border-gray-200"
```

#### Accessibility (WCAG 2.1 AA - REQUIRED)
- **Semantic HTML**: Proper ARIA labels and roles
- **Keyboard Navigation**: Full keyboard accessibility
- **Screen Reader Support**: Live regions and announcements
- **Focus Management**: Visible focus indicators
- **Reduced Motion**: Animation preferences respected

#### Modern Design Standards
- **Compact Layout**: `py-8` for headers, `p-6` for cards
- **Clean Cards**: Gradient headers, subtle shadows, hover effects
- **Consistent Spacing**: `space-y-6` for sections, `space-y-4` for groups
- **Content-First**: Design serves content, not vice versa

### Architecture Compliance (ENFORCED)
- **Single Responsibility**: Each component has ONE clear purpose
- **NO Business Logic**: Components are declarative only
- **Service Layer**: ALL async operations in services
- **Custom Hooks**: Complex state management extracted
- **Error Boundaries**: ALL components protected
- **TypeScript Strict**: NO 'any' types allowed

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm 8+

### Development Setup (Post-Scaffolding)

1. **CLI Scaffolding** (Ready to execute)
   ```bash
   cd frontend
   npm create vite@latest app -- --template react-ts
   cd app
   npm install
   ```

2. **Directory Structure Setup**
   ```bash
   # Run shell script to create all planned directories and placeholder files
   ./scripts/setup-structure.sh
   ```

3. **Install Additional Dependencies**
   ```bash
   npm install @monaco-editor/react framer-motion lucide-react clsx tailwind-merge
   ```

4. **Development Server**
   ```bash
   npm run dev
   ```

## 📋 Implementation Phases

### Phase 1: Foundation & Architecture (NEXT)
**Goal**: Establish working layout shell with basic navigation

#### 1.1 CLI Scaffolding and Structure Setup
- [ ] Remove premature `/frontend/app` folder
- [ ] Execute Vite CLI scaffolding
- [ ] Create complete directory structure with shell script
- [ ] Generate all placeholder files with correct extensions

#### 1.2 Core Types & Interfaces (10 files)
- [ ] navigation.ts, tab.ts, settings.ts, deobfuscation.ts
- [ ] platform.ts, search.ts, theme.ts, sidebar.ts, layout.ts
- [ ] electron-api.d.ts

#### 1.3 Service Layer Foundation (12 services)
- [ ] Platform abstraction with Electron and browser implementations
- [ ] Core services: App, Tab, Settings, Navigation
- [ ] Utility services: Search, Toast, Keyboard, File

#### 1.4 Configuration and Auto-Discovery
- [ ] Navigation and panel auto-discovery implementation
- [ ] Theme configuration with 12 custom schemes
- [ ] Keyboard shortcut definitions and search configuration

**Success Criteria**: Services instantiated, auto-discovery works, types defined

### Phase 2-8: [See IMPLEMENTATION_PLAN.md for complete details]

## 🎯 Current Architecture Debt

**Why Complete Rewrite is Necessary**:
1. **No Architecture**: Missing service layer, hooks, proper state management
2. **No Theming System**: Missing 48-variant theme system required
3. **No Auto-Discovery**: Manual navigation instead of configuration-driven
4. **No Component Limits**: Need architectural enforcement
5. **No Accessibility**: Missing WCAG 2.1 AA compliance
6. **No Platform Abstraction**: Missing Electron/browser compatibility

## 🔧 Development Tools

### Planned Configuration
- **Build**: Vite with TypeScript (strict mode)
- **Styling**: Tailwind CSS with theme variables
- **Icons**: Lucide React (16,000+ icons)
- **Editor**: Monaco Editor (VS Code experience)
- **Animation**: Framer Motion (reduced motion support)
- **Testing**: Jest + React Testing Library

### Code Quality Enforcement
- **TypeScript**: Strict mode, NO 'any' types
- **ESLint**: React and accessibility rules
- **Component Limits**: Automated enforcement
- **Architecture Patterns**: Pre-commit hooks
- **Quality Gates**: Phase completion blockers

## 📚 References

### Documentation
- **Architecture Guide**: `/mnt/c/projects/docs/ARCHITECTURE_GUIDE.md`
- **Style Guide**: `/mnt/c/projects/docs/STYLE_GUIDE.md`
- **Theme System**: `/mnt/c/projects/docs/THEMING_SYSTEM.md`
- **Implementation Plan**: `./IMPLEMENTATION_PLAN.md`
- **Project Structure**: `./PROJECT_STRUCTURE.md`

### Reference Implementation
- **Task Writer**: `/mnt/c/projects/task-writer` (proven patterns)

## 🚦 Immediate Next Actions

### 1. Prepare for CLI Scaffolding
```bash
# Remove premature structure
rm -rf /mnt/c/projects/detox-tool/frontend/app

# CLI scaffolding ready to execute
cd /mnt/c/projects/detox-tool/frontend
npm create vite@latest app -- --template react-ts
```

### 2. Create Setup Script
- Generate shell script to create all planned directories
- Create placeholder files with correct extensions
- Install all required dependencies

### 3. Begin Phase 1 Implementation
- Follow IMPLEMENTATION_PLAN.md exactly
- Implement 63 planned tasks across 8 phases
- Maintain architectural compliance throughout

**Status**: Documentation complete ✅ | CLI scaffolding ready ✅ | Implementation ready to begin ✅

The planning phase is complete. Time to scaffold and build the proper architecture following the comprehensive documentation and enforcement rules.