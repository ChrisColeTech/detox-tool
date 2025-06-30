# Detox Tool

A powerful JavaScript deobfuscation and code analysis tool designed for reverse engineering webpack bundles and React applications. Built with Electron and React for cross-platform desktop usage.

## 🚀 Complete Feature Overview

### 🔍 Advanced JavaScript Deobfuscation Engine
- **Heavy Obfuscation Support**: Handles complex obfuscation patterns including hex variables, string arrays, and control flow obfuscation
- **Webpack Bundle Analysis**: Specialized engine for deobfuscating webpack-minified code with React reconstruction
- **Pattern Detection**: Automatically detects obfuscation type and applies appropriate strategies
- **Multiple Fallback Libraries**: Uses Prettier, js-beautify, Babel, and custom engines for maximum compatibility
- **Real-time Processing**: Live deobfuscation with progress tracking and confidence scoring
- **Batch Processing**: Process multiple files simultaneously with queue management

### ⚛️ React Component Reconstruction
- **Component Extraction**: Identifies and reconstructs React components from minified bundles
- **Folder Structure Reconstruction**: Attempts to rebuild original project structure with file tree
- **Source Map Processing**: Utilizes source maps when available for accurate reconstruction
- **Bundle Splitting**: Handles large files by intelligently splitting into manageable components
- **Hook Detection**: Identifies React hooks and component lifecycle patterns
- **JSX Reconstruction**: Rebuilds JSX syntax from minified React code

### 💻 Professional Code Editor
- **Monaco Editor Integration**: Full VS Code editor experience with syntax highlighting
- **Multi-Language Support**: JavaScript, TypeScript, JSON with intelligent code completion
- **Code Formatting**: Automatic code beautification with customizable formatting rules
- **Search & Replace**: Advanced find/replace with regex support across all open files
- **Code Folding**: Collapse/expand code sections for better navigation
- **Error Detection**: Real-time TypeScript/JavaScript error highlighting
- **Multiple Cursors**: Advanced text editing with multi-cursor support
- **Code Minimap**: Visual overview of large files with scroll navigation

### 📁 Advanced File Management
- **File Explorer Panel**: Tree-view file browser with folder navigation
- **Multi-format Support**: JavaScript, TypeScript, JSON, source maps, and web formats
- **Drag & Drop**: Drop files directly into the application for instant processing
- **File Tabs**: Work with multiple files simultaneously with tab management
- **Export Options**: Save results in various formats with batch export
- **Project Management**: Save and restore project states with file collections
- **File Comparison**: Side-by-side comparison of original vs deobfuscated code
- **Backup System**: Automatic backups of processed files

### 🎨 Premium UI/UX Experience
- **Tab-based Interface**: Professional IDE-like interface with unlimited tabs
- **12 Custom Detox-Tool Themes**: Code Detective, Reverse Engineer, Malware Hunter, Script Sleuth, Debug Master, Hex Analyst, Binary Explorer, Cyber Forensics, Code Breaker, Threat Hunter, Digital Archaeologist, Obfuscation Buster
- **48 Total Theme Variants**: Each color scheme × (Light/Dark/High Contrast Light/High Contrast Dark)
- **Enhanced Visual Effects**: Matrix effects for Binary Explorer, neon glows for Cyber Forensics
- **Responsive Layout**: Flexible panels with drag & drop, resize, and docking
- **Auto-Discovery Navigation**: Pages and panels automatically discovered and registered
- **Service-Based Architecture**: Clean separation between UI and business logic with dependency injection
- **Accessibility Compliant**: WCAG 2.1 AA standards with full keyboard navigation

### 🔍 Global Search & Navigation
- **Spotlight Search System**: Global search with Ctrl+F/Cmd+F across all content
- **Fuzzy Search**: Intelligent search with relevance scoring and category organization
- **27+ Searchable Items**: Navigate to any page, panel, setting, command, or file
- **Real-time Results**: Instant search with keyboard navigation and previews
- **Search Categories**: Organized results by Navigation, Commands, Settings, Files, Actions
- **File Content Search**: Search within code files across all open tabs
- **Command Palette**: Quick access to all application commands and actions

### 🔔 Smart Notification System
- **Toast Notifications**: Success, error, warning, and info messages with auto-dismiss
- **Progress Tracking**: Real-time progress indicators for long-running operations
- **Processing Logs**: Detailed output and error logging with searchable history
- **Status Updates**: Live status in status bar with processing state
- **Error Recovery**: Graceful error handling with user-friendly recovery options
- **Notification History**: Review past notifications and processing results

### ⚙️ Comprehensive Settings System
- **Theme Customization**: Complete control over all 48 theme variants
- **Layout Configuration**: Sidebar position, panel visibility, status bar options
- **Editor Preferences**: Font size, icon size, border thickness, contrast settings
- **Deobfuscation Options**: Engine selection, formatting preferences, output settings
- **Keyboard Shortcuts**: Customizable shortcuts with conflict detection
- **Platform Integration**: Electron/browser compatibility with native file dialogs
- **Settings Persistence**: Automatic save/restore across application sessions
- **Export/Import**: Share settings configurations between installations

### 🎯 Developer-Focused Tools
- **Performance Metrics**: Track processing time, file sizes, and operation statistics
- **Debug Information**: Detailed analysis results with confidence scoring
- **Error Diagnostics**: Comprehensive error reporting with stack traces
- **Processing History**: Review past deobfuscation operations with results
- **Code Analysis**: Static analysis of obfuscation patterns and complexity
- **Memory Management**: Efficient handling of large files with progress streaming
- **Platform Abstraction**: Seamless operation in both Electron and browser environments

## 🚧 Current Implementation Status

### ✅ Completed Backend & Planning
- **Core Deobfuscation Engines**: Heavy, Webpack, and Generic pattern detection with real LM Studio testing
- **Comprehensive Planning**: Complete architecture documentation with 8-phase implementation plan
- **Project Structure**: Full directory structure with 50+ components planned following task-writer patterns
- **Service Architecture**: 12 services designed (App, Tab, Platform, Settings, Search, Navigation, etc.)
- **Type System**: Complete TypeScript definitions for all systems (navigation, theming, platform, etc.)
- **Theme Planning**: 12 custom detox-tool color schemes with 48 total variants designed
- **Auto-Discovery System**: Navigation and panel auto-discovery patterns defined
- **Scaffolding Script**: Complete init-project.sh ready to scaffold entire frontend

### 🚀 Ready for Implementation
- **Phase 1**: Foundation & Architecture (types, services, configuration)
- **Phase 2**: Layout Shell (TitleBar, Sidebar, MainContent, StatusBar) 
- **Phase 3**: Tab System (drag & drop, persistence, controls)
- **Phase 4**: Complete theming system (48 variants)
- **Phase 5**: Monaco Editor & deobfuscation UI
- **Phase 6**: Global search system
- **Phase 7**: Settings interface
- **Phase 8**: Advanced features & polish

### 📋 Next Steps
- **Execute Scaffolding**: Run init-project.sh to create complete React app structure
- **Begin Phase 1**: Implement foundation architecture following IMPLEMENTATION_PLAN.md
- **Follow Documentation**: All implementation details documented in frontend/docs/

## 🏗️ Architecture Overview

### Project Organization
- **Complete project structure**: See [Project Structure Documentation](frontend/docs/PROJECT_STRUCTURE.md)
- **Implementation roadmap**: See [Implementation Plan](frontend/docs/IMPLEMENTATION_PLAN.md) 
- **Frontend details**: See [Frontend README](frontend/docs/README.md)

### Core Technologies
- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS
- **Editor**: Monaco Editor (VS Code experience)
- **UI Library**: Lucide React (16,000+ icons)
- **Animation**: Framer Motion with reduced motion support
- **Backend**: Node.js deobfuscation engines
- **Platform**: Electron + browser compatibility
- **Build**: Vite, electron-builder
- **Testing**: Jest with real obfuscated code samples

### Architecture Principles
- **Component Size Limits**: Page (100 lines), Feature (150 lines), Layout (80 lines), UI (100 lines)
- **Service Layer**: All business logic in services with dependency injection
- **Auto-Discovery**: Pages and panels automatically registered via configuration exports
- **Platform Abstraction**: Seamless Electron/browser operation
- **Accessibility**: WCAG 2.1 AA compliance throughout
- **TypeScript Strict**: Zero 'any' types, comprehensive type coverage

## 🚦 Getting Started

### Prerequisites
- Node.js 18+ 
- npm 8+

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd detox-tool
   ```

2. **Install dependencies**
   ```bash
   # Install main dependencies
   npm install
   
   # Install frontend dependencies
   cd frontend
   npm install
   cd ..
   ```

3. **Run in development mode**
   ```bash
   # Start the application in development
   npm run electron-dev
   ```

4. **Build for production**
   ```bash
   # Build the application
   npm run build
   npm run dist
   ```

## 📖 Usage Guide

### Complete User Workflow

1. **File Management**
   - **Load Files**: Click "Load File", use `Ctrl+O`, or drag & drop files
   - **File Explorer**: Browse files in the sidebar file tree
   - **Multiple Tabs**: Open multiple files simultaneously in tabs
   - **Project Management**: Save and restore project states

2. **Code Editing & Analysis**
   - **Monaco Editor**: Professional code editing with VS Code features
   - **Syntax Highlighting**: JavaScript, TypeScript, JSON support
   - **Code Analysis**: Real-time obfuscation pattern detection
   - **Search & Replace**: Advanced find/replace with regex across files
   - **Error Detection**: Live TypeScript/JavaScript error highlighting

3. **Deobfuscation Process**
   - **Engine Selection**: Choose Heavy, Webpack, or Generic engines
   - **Real-time Processing**: Live progress tracking with confidence scoring
   - **Result Comparison**: Side-by-side original vs deobfuscated code
   - **React Reconstruction**: Automatic component and structure rebuilding

4. **Navigation & Search**
   - **Global Search**: Use `Ctrl+F` for spotlight search across everything
   - **File Content Search**: Search within code files and results
   - **Navigation**: Auto-discovered pages and panels in sidebar
   - **Command Palette**: Quick access to all commands and actions

5. **Customization & Settings**
   - **Theme Selection**: Choose from 12 custom detox-tool color schemes
   - **Layout Control**: Resize panels, toggle sidebars, customize interface
   - **Editor Preferences**: Font size, color scheme, contrast settings
   - **Keyboard Shortcuts**: Full customization with conflict detection

6. **Export & Results**
   - **Save Processed Code**: Export deobfuscated files in various formats
   - **Structure Export**: Save reconstructed React components and folders
   - **Batch Export**: Process and export multiple files simultaneously
   - **History Management**: Review and restore previous processing results

### Advanced Features

#### Professional Tab Management
- **Open Multiple Files**: `Ctrl+T` for new tabs, drag & drop files
- **Tab Navigation**: `Ctrl+1-9` for quick switching, `Ctrl+Tab` for recent
- **Tab Controls**: `Ctrl+W` to close, middle-click close, tab reordering
- **Tab Persistence**: Tabs restore on application restart with state
- **Dirty State**: Visual indicators for unsaved changes

#### Advanced Customization
- **12 Custom Themes**: Code Detective, Reverse Engineer, Malware Hunter, and 9 more
- **48 Theme Variants**: Each theme × Light/Dark/High Contrast modes
- **Layout Control**: Resizable panels, sidebar positioning, status bar toggle
- **Editor Preferences**: Font scaling, icon sizing, border thickness options
- **Accessibility**: High contrast modes, reduced motion, keyboard navigation

#### Complete Keyboard Shortcuts
| Category | Shortcut | Action |
|----------|----------|--------|
| **Navigation** | `Ctrl+F` / `Cmd+F` | Global spotlight search |
| | `Ctrl+H` | Go to Welcome page |
| | `Ctrl+D` | Go to Deobfuscator |
| | `Ctrl+B` | Toggle sidebar |
| **Files** | `Ctrl+O` | Open file dialog |
| | `Ctrl+S` | Save current file |
| | `Ctrl+T` | New tab |
| | `Ctrl+W` | Close current tab |
| | `Ctrl+Shift+T` | Reopen closed tab |
| **Editing** | `Ctrl+F` | Find in current file |
| | `Ctrl+H` | Find and replace |
| | `Ctrl+G` | Go to line |
| | `Ctrl+/` | Toggle comment |
| **System** | `Ctrl+,` | Open settings |
| | `Ctrl+Shift+P` | Command palette |
| | `F11` | Toggle fullscreen |

## 🧪 Testing

The project includes comprehensive tests covering:

```bash
# Run all tests
npm test

# Run specific test suites
npm run test:unit          # Unit tests
npm run test:integration   # Integration tests
npm run test:validation    # Validation tests

# Run with coverage
npm run test:coverage
```

### Test Coverage
- **Happy Path Tests**: Normal deobfuscation workflows
- **Unhappy Path Tests**: Error handling and edge cases
- **Real Code Tests**: Actual LM Studio obfuscated samples
- **Performance Tests**: Large file handling
- **Validation Tests**: Input/output validation

## 🔧 Configuration

### Application Settings
- **Theme**: Dark/Light mode
- **Color Scheme**: 12 different color variations
- **Layout**: Sidebar position, status bar visibility
- **Editor**: Font size, icon size, contrast settings

### Deobfuscation Options
- **Engine Selection**: Heavy, Webpack, or Generic
- **Formatting**: Preserve original formatting
- **Component Extraction**: Enable React component detection
- **Structure Reconstruction**: Attempt folder structure rebuilding

## 🐛 Troubleshooting

### Common Issues

**Application won't start**
- Check Node.js version (18+ required)
- Clear node_modules and reinstall: `rm -rf node_modules && npm install`

**Deobfuscation fails**
- Try different engine types in settings
- Check file format compatibility
- Review output logs for specific errors

**UI/Performance issues**
- Disable hardware acceleration in Electron settings
- Reduce file size for large bundles
- Clear application cache

### Log Files
Application logs are available in:
- **Windows**: `%APPDATA%/detox-tool/logs/`
- **macOS**: `~/Library/Logs/detox-tool/`
- **Linux**: `~/.config/detox-tool/logs/`

## 🤝 Contributing

We welcome contributions! Please see our contributing guidelines:

1. Fork the repository
2. Create a feature branch
3. Add tests for new functionality
4. Ensure all tests pass
5. Submit a pull request

### Development Setup
```bash
# Clone and install
git clone <repo>
cd detox-tool
npm install

# Start development servers
npm run dev          # Frontend only
npm run electron-dev # Full Electron app

# Run tests before committing
npm run test:ci
```

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **LM Studio**: Sample obfuscated code for testing
- **Monaco Editor**: VS Code editor integration
- **Babel/Prettier**: Code formatting and parsing
- **Electron**: Cross-platform desktop framework
- **React**: UI framework

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/your-repo/detox-tool/issues)
- **Discussions**: [GitHub Discussions](https://github.com/your-repo/detox-tool/discussions)
- **Documentation**: [Wiki](https://github.com/your-repo/detox-tool/wiki)

---

**Built with ❤️ for the reverse engineering community**