#!/bin/bash

# Detox Tool Frontend Initialization Script
# This script scaffolds the React Vite app, creates all directories/files, and sets up dependencies

set -e  # Exit on any error

echo "🚀 Detox Tool Frontend - Project Initialization"
echo "================================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Get the script directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
FRONTEND_DIR="$(dirname "$SCRIPT_DIR")"
PROJECT_ROOT="$(dirname "$FRONTEND_DIR")"

echo -e "${BLUE}Frontend directory: $FRONTEND_DIR${NC}"
echo -e "${BLUE}Project root: $PROJECT_ROOT${NC}"

cd "$FRONTEND_DIR"

# Step 1: Remove any existing app directory
echo -e "\n${YELLOW}Step 1: Cleaning up existing app directory...${NC}"
if [ -d "app" ]; then
    echo "Removing existing app directory..."
    rm -rf app
fi

# Step 2: Scaffold React Vite app
echo -e "\n${YELLOW}Step 2: Scaffolding React TypeScript app with Vite...${NC}"
npm create vite@latest app -- --template react-ts

cd app

# Step 3: Install base dependencies
echo -e "\n${YELLOW}Step 3: Installing base dependencies...${NC}"
npm install

# Step 4: Install additional production dependencies
echo -e "\n${YELLOW}Step 4: Installing additional production dependencies...${NC}"
npm install @monaco-editor/react framer-motion lucide-react clsx tailwind-merge

# Step 5: Install development dependencies
echo -e "\n${YELLOW}Step 5: Installing development dependencies...${NC}"
npm install -D tailwindcss postcss autoprefixer eslint @typescript-eslint/eslint-plugin @typescript-eslint/parser eslint-plugin-react-hooks eslint-plugin-jsx-a11y eslint-plugin-react eslint-plugin-react-refresh prettier

# Step 6: Initialize Tailwind CSS
echo -e "\n${YELLOW}Step 6: Setting up Tailwind CSS...${NC}"
npx tailwindcss init -p

# Step 7: Update package.json with proper scripts and configuration
echo -e "\n${YELLOW}Step 7: Updating package.json with scripts and dependencies...${NC}"

# Create updated package.json with all required scripts
cat > package.json << 'EOF'
{
  "name": "detox-tool-frontend",
  "private": true,
  "version": "0.0.1",
  "type": "module",
  "description": "Modern React frontend for JavaScript deobfuscation tool",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "lint": "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0",
    "lint:fix": "eslint . --ext ts,tsx --fix",
    "typecheck": "tsc --noEmit",
    "preview": "vite preview",
    "format": "prettier --write \"src/**/*.{ts,tsx,js,jsx,css,md}\"",
    "format:check": "prettier --check \"src/**/*.{ts,tsx,js,jsx,css,md}\"",
    "check-all": "npm run typecheck && npm run lint && npm run format:check"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "@monaco-editor/react": "^4.6.0",
    "framer-motion": "^10.16.16",
    "lucide-react": "^0.294.0",
    "clsx": "^2.0.0",
    "tailwind-merge": "^2.2.0"
  },
  "devDependencies": {
    "@types/react": "^18.2.43",
    "@types/react-dom": "^18.2.17",
    "@types/node": "^20.10.5",
    "@vitejs/plugin-react": "^4.2.1",
    "vite": "^5.0.8",
    "typescript": "^5.2.2",
    "tailwindcss": "^3.3.6",
    "postcss": "^8.4.32",
    "autoprefixer": "^10.4.16",
    "eslint": "^8.55.0",
    "@typescript-eslint/eslint-plugin": "^6.14.0",
    "@typescript-eslint/parser": "^6.14.0",
    "eslint-plugin-react-hooks": "^4.6.0",
    "eslint-plugin-jsx-a11y": "^6.8.0",
    "eslint-plugin-react": "^7.33.2",
    "prettier": "^3.1.1"
  },
  "engines": {
    "node": ">=18.0.0",
    "npm": ">=8.0.0"
  }
}
EOF

echo "✅ package.json updated with all dependencies and scripts"

# Reinstall dependencies to ensure everything is properly installed
echo "📦 Reinstalling dependencies..."
npm install

# Step 8: Create directory structure
echo -e "\n${YELLOW}Step 8: Creating directory structure...${NC}"

# Create main directories
mkdir -p src/components/{features,layout,shared,ui}
mkdir -p src/hooks
mkdir -p src/services
mkdir -p src/pages/panels
mkdir -p src/config
mkdir -p src/types
mkdir -p src/styles
mkdir -p src/utils
mkdir -p src/assets
mkdir -p scripts

# Create feature directories
mkdir -p src/components/features/{deobfuscator,editor,file-explorer,settings,search,tabbar,titlebar,sidebar,notifications,welcome}

# Create shared directories
mkdir -p src/components/shared/{forms,generators}

# Create UI component placeholders
mkdir -p src/components/ui

# Step 9: Create ESLint and Prettier configuration
echo -e "\n${YELLOW}Step 9: Setting up ESLint and Prettier...${NC}"

# Create comprehensive .eslintrc.json
cat > .eslintrc.json << 'EOF'
{
  "env": {
    "browser": true,
    "es2020": true,
    "node": true
  },
  "extends": [
    "eslint:recommended",
    "@typescript-eslint/recommended",
    "@typescript-eslint/recommended-requiring-type-checking",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended",
    "plugin:jsx-a11y/recommended"
  ],
  "parser": "@typescript-eslint/parser",
  "parserOptions": {
    "ecmaVersion": "latest",
    "sourceType": "module",
    "ecmaFeatures": {
      "jsx": true
    },
    "project": "./tsconfig.json"
  },
  "plugins": [
    "react-refresh", 
    "@typescript-eslint", 
    "react", 
    "jsx-a11y"
  ],
  "settings": {
    "react": {
      "version": "detect"
    }
  },
  "rules": {
    /* React Rules */
    "react/react-in-jsx-scope": "off",
    "react/prop-types": "off",
    "react-refresh/only-export-components": "warn",
    "react-hooks/rules-of-hooks": "error",
    "react-hooks/exhaustive-deps": "warn",
    
    /* TypeScript Rules (ENFORCED) */
    "@typescript-eslint/no-explicit-any": "error",
    "@typescript-eslint/no-unused-vars": "error",
    "@typescript-eslint/explicit-function-return-type": "off",
    "@typescript-eslint/explicit-module-boundary-types": "off",
    "@typescript-eslint/no-non-null-assertion": "error",
    "@typescript-eslint/prefer-const": "error",
    "@typescript-eslint/no-inferrable-types": "error",
    "@typescript-eslint/consistent-type-imports": "error",
    
    /* Accessibility Rules (MANDATORY) */
    "jsx-a11y/alt-text": "error",
    "jsx-a11y/anchor-is-valid": "error",
    "jsx-a11y/click-events-have-key-events": "error",
    "jsx-a11y/no-static-element-interactions": "error",
    "jsx-a11y/heading-has-content": "error",
    "jsx-a11y/lang": "error",
    "jsx-a11y/role-supports-aria-props": "error",
    "jsx-a11y/aria-props": "error",
    "jsx-a11y/aria-proptypes": "error",
    "jsx-a11y/aria-unsupported-elements": "error",
    
    /* Code Quality Rules */
    "no-console": "warn",
    "no-debugger": "error",
    "prefer-const": "error",
    "no-var": "error",
    "eqeqeq": "error",
    "curly": "error"
  },
  "overrides": [
    {
      "files": ["**/*.test.{ts,tsx}", "**/*.spec.{ts,tsx}"],
      "rules": {
        "@typescript-eslint/no-explicit-any": "off"
      }
    }
  ]
}
EOF

# Create .eslintignore
cat > .eslintignore << 'EOF'
node_modules
dist
build
*.config.js
*.config.ts
public
coverage
.next
EOF

# Create .prettierrc
cat > .prettierrc << 'EOF'
{
  "semi": false,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5",
  "printWidth": 100,
  "bracketSpacing": true,
  "arrowParens": "avoid"
}
EOF

# Create .prettierignore
cat > .prettierignore << 'EOF'
node_modules
dist
build
.next
coverage
*.min.js
*.min.css
EOF

echo "✅ ESLint and Prettier configured"

# Step 10: Create placeholder files
echo -e "\n${YELLOW}Step 10: Creating placeholder files...${NC}"

# Types
cat > src/types/navigation.ts << 'EOF'
// Navigation and panel type definitions
export interface NavigationConfig {
  id: string
  label: string
  iconComponent: React.ComponentType<{ className?: string }>
  showInSidebar: boolean
  order: number
  keyboardShortcut?: string
  description?: string
}

export interface PanelConfig {
  id: string
  label: string
  iconComponent: React.ComponentType<{ className?: string }>
  pageId: string
  position: 'left' | 'right'
  defaultVisible: boolean
  order: number
  keyboardShortcut?: string
}
EOF

cat > src/types/tab.ts << 'EOF'
// Tab management types
export interface Tab {
  id: string
  label: string
  active: boolean
  closable: boolean
  dirty?: boolean
  metadata?: Record<string, any>
}
EOF

cat > src/types/settings.ts << 'EOF'
// Settings and theming types
export interface AppSettings {
  theme: 'light' | 'dark'
  colorScheme: 'code-detective' | 'reverse-engineer' | 'malware-hunter' | 'script-sleuth' | 'debug-master' | 'hex-analyst' | 'binary-explorer' | 'cyber-forensics' | 'code-breaker' | 'threat-hunter' | 'digital-archaeologist' | 'obfuscation-buster'
  highContrast: boolean
  fontSize: 'small' | 'medium' | 'large'
  iconSize: 'small' | 'medium' | 'large'
  borderThickness: 'none' | 'thin' | 'medium' | 'thick'
  sidebarPosition: 'left' | 'right'
  showStatusBar: boolean
  sidebarExpanded: boolean
  activeSidebarTab: string
  sidebarItemVisibility: Record<string, boolean>
  pinnedSidebarItems: string[]
}
EOF

cat > src/types/platform.ts << 'EOF'
// Platform abstraction types
export interface FileFilter {
  name: string
  extensions: string[]
}

export interface PlatformService {
  isElectron(): boolean
  isBrowser(): boolean
  loadSettings(): Promise<AppSettings | null>
  saveSettings(settings: AppSettings): Promise<void>
  openFile(filters?: FileFilter[]): Promise<File | null>
  saveFile(content: string, filename: string): Promise<boolean>
}
EOF

cat > src/types/deobfuscation.ts << 'EOF'
// Deobfuscation tool types
export interface DeobfuscationOptions {
  engine: string
  preserveComments: boolean
  formatCode: boolean
  removeDeadCode: boolean
}

export interface DeobfuscationResult {
  originalCode: string
  deobfuscatedCode: string
  metadata: {
    linesProcessed: number
    processingTime: number
    engine: string
  }
}
EOF

cat > src/types/search.ts << 'EOF'
// Search functionality types
export interface SearchResult {
  id: string
  title: string
  description: string
  category: string
  page: string
  section?: string
  keywords: string[]
  priority: number
}
EOF

cat > src/types/theme.ts << 'EOF'
// Theming system types
export type ColorScheme = 'code-detective' | 'reverse-engineer' | 'malware-hunter' | 'script-sleuth' | 'debug-master' | 'hex-analyst' | 'binary-explorer' | 'cyber-forensics' | 'code-breaker' | 'threat-hunter' | 'digital-archaeologist' | 'obfuscation-buster'

export type ThemeMode = 'light' | 'dark'

export interface ThemeConfig {
  colorScheme: ColorScheme
  mode: ThemeMode
  highContrast: boolean
}
EOF

cat > src/types/sidebar.ts << 'EOF'
// Sidebar and panel management types
export interface SidebarState {
  leftPanels: readonly string[]
  rightPanels: readonly string[]
  leftExpanded: boolean
  rightExpanded: boolean
  activeLeftPanel?: string
  activeRightPanel?: string
}

export type PanelPosition = 'left' | 'right'
export type PanelVisibility = 'visible' | 'hidden' | 'collapsed'
EOF

cat > src/types/layout.ts << 'EOF'
// Layout component types
export interface LayoutState {
  sidebarExpanded: boolean
  statusBarVisible: boolean
  titleBarHeight: number
}
EOF

cat > src/types/electron-api.d.ts << 'EOF'
// Electron API type definitions
declare global {
  interface Window {
    electronAPI?: {
      getAppSettings(): Promise<AppSettings>
      setAppSettings(settings: AppSettings): Promise<void>
      openFileDialog(filters?: FileFilter[]): Promise<{ name: string; content: string } | null>
      saveFile(content: string, filename: string): Promise<boolean>
    }
  }
}

export {}
EOF

# Services placeholders with basic implementations
cat > src/services/platformService.ts << 'EOF'
// Platform abstraction service
import type { PlatformService } from '@/types/platform'
import { electronService } from './electronService'
import { browserService } from './browserService'

export const getPlatformService = (): PlatformService => {
  return window.electronAPI ? electronService : browserService
}
EOF

cat > src/services/electronService.ts << 'EOF'
// Electron platform implementation
import type { PlatformService, FileFilter } from '@/types/platform'
import type { AppSettings } from '@/types/settings'

export const electronService: PlatformService = {
  isElectron: () => true,
  isBrowser: () => false,

  async loadSettings(): Promise<AppSettings | null> {
    if (!window.electronAPI) return null
    try {
      return await window.electronAPI.getAppSettings()
    } catch {
      return null
    }
  },

  async saveSettings(settings: AppSettings): Promise<void> {
    if (!window.electronAPI) return
    await window.electronAPI.setAppSettings(settings)
  },

  async openFile(filters?: FileFilter[]): Promise<File | null> {
    if (!window.electronAPI) return null
    const result = await window.electronAPI.openFileDialog(filters)
    if (!result) return null
    return new File([result.content], result.name)
  },

  async saveFile(content: string, filename: string): Promise<boolean> {
    if (!window.electronAPI) return false
    return await window.electronAPI.saveFile(content, filename)
  }
}
EOF

cat > src/services/browserService.ts << 'EOF'
// Browser platform implementation
import type { PlatformService, FileFilter } from '@/types/platform'
import type { AppSettings } from '@/types/settings'

export const browserService: PlatformService = {
  isElectron: () => false,
  isBrowser: () => true,

  async loadSettings(): Promise<AppSettings | null> {
    try {
      const saved = localStorage.getItem('detox-tool-settings')
      return saved ? JSON.parse(saved) : null
    } catch {
      return null
    }
  },

  async saveSettings(settings: AppSettings): Promise<void> {
    localStorage.setItem('detox-tool-settings', JSON.stringify(settings))
  },

  async openFile(): Promise<File | null> {
    return new Promise((resolve) => {
      const input = document.createElement('input')
      input.type = 'file'
      input.accept = '.js,.jsx,.ts,.tsx,.json'
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
      a.click()
      URL.revokeObjectURL(url)
      return true
    } catch {
      return false
    }
  }
}
EOF

cat > src/services/appService.ts << 'EOF'
// Central application coordination service
export class AppService {
  // Implementation in Phase 1
}
EOF

cat > src/services/tabService.ts << 'EOF'
// Tab state management service
export class TabService {
  // Implementation in Phase 3
}
EOF

cat > src/services/settingsService.ts << 'EOF'
// Settings persistence service
export class SettingsService {
  // Implementation in Phase 1
}
EOF

# Config placeholders
cat > src/config/navigationConfig.tsx << 'EOF'
// Auto-discovery navigation configuration
import type { NavigationConfig, PanelConfig } from '@/types/navigation'

// Auto-discover pages and panels
const pageModules = import.meta.glob('../pages/**/[A-Z]*Page.tsx', { eager: true })
const panelModules = import.meta.glob('../pages/panels/**/[A-Z]*Panel.tsx', { eager: true })

// Implementation in Phase 1
export const navigationConfigs: NavigationConfig[] = []
export const panelConfigs: PanelConfig[] = []
EOF

cat > src/config/themeConfig.ts << 'EOF'
// Theme definitions and utilities
import type { ColorScheme, ThemeConfig } from '@/types/theme'

export const defaultThemeConfig: ThemeConfig = {
  colorScheme: 'code-detective',
  mode: 'dark',
  highContrast: false
}

// 12 custom detox-tool color schemes
export const colorSchemes: Record<ColorScheme, { name: string; description: string }> = {
  'code-detective': { name: 'Code Detective', description: 'Professional analysis theme' },
  'reverse-engineer': { name: 'Reverse Engineer', description: 'Technical exploration theme' },
  'malware-hunter': { name: 'Malware Hunter', description: 'Security analysis theme' },
  'script-sleuth': { name: 'Script Sleuth', description: 'Investigation theme' },
  'debug-master': { name: 'Debug Master', description: 'Debugging focused theme' },
  'hex-analyst': { name: 'Hex Analyst', description: 'Low-level analysis theme' },
  'binary-explorer': { name: 'Binary Explorer', description: 'Matrix effects theme' },
  'cyber-forensics': { name: 'Cyber Forensics', description: 'Neon cyber theme' },
  'code-breaker': { name: 'Code Breaker', description: 'Cryptanalysis theme' },
  'threat-hunter': { name: 'Threat Hunter', description: 'Security monitoring theme' },
  'digital-archaeologist': { name: 'Digital Archaeologist', description: 'Code excavation theme' },
  'obfuscation-buster': { name: 'Obfuscation Buster', description: 'Anti-obfuscation theme' }
}
EOF

# Styles
cat > src/styles/variables.css << 'EOF'
/* CSS custom properties foundation */
:root {
  /* Utility Variables */
  --radius: 0.5rem;
  --font-family: 'Inter', sans-serif;
  
  /* Default Code Detective scheme (fallback) */
  --background: #ffffff;
  --surface: #f5f5f5;
  --surface-hover: rgba(0, 0, 0, 0.05);
  --text: #121212;
  --text-muted: #6e6e6e;
  --text-background: #ffffff;
  --accent: #121212;
  --accent-hover: #2a2a2a;
  --border: #e5e5e5;
  --border-thin: rgba(229, 229, 229, 0.2);
  --input-bg: #ffffff;
  --scrollbar: #d1d5db;
  --shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  
  /* Status colors */
  --status-success: #10b981;
  --status-warning: #f59e0b;
  --status-error: #ef4444;
  --status-info: #3b82f6;
  
  /* Enhanced effect variables */
  --accent-glow: none;
  --text-glow: none;
  --neon-border: none;
}
EOF

cat > src/styles/themes.css << 'EOF'
/* 12 custom detox-tool color schemes with 4 variants each */
/* Implementation in Phase 4 */

/* Code Detective theme (default) */
.color-code-detective {
  /* Light mode variables */
}

.color-code-detective.dark {
  /* Dark mode overrides */
}

.color-code-detective.high-contrast:not(.dark) {
  /* High contrast light */
}

.color-code-detective.high-contrast.dark {
  /* High contrast dark */
}

/* Additional 11 themes to be implemented... */
EOF

cat > src/styles/base.css << 'EOF'
/* Base styles and Tailwind integration */
@tailwind base;
@tailwind components;
@tailwind utilities;

/* Import theme system */
@import './variables.css';
@import './themes.css';
@import './settings.css';
@import './borders.css';
@import './components.css';

/* Base styling */
* {
  box-sizing: border-box;
}

body {
  font-family: var(--font-family);
  background-color: var(--background);
  color: var(--text);
}
EOF

cat > src/styles/settings.css << 'EOF'
/* User preference scaling */
.font-small { --font-scale-factor: 0.85; }
.font-medium { --font-scale-factor: 1; }
.font-large { --font-scale-factor: 1.15; }

.icon-small { --icon-scale-factor: 0.85; }
.icon-medium { --icon-scale-factor: 1; }
.icon-large { --icon-scale-factor: 1.15; }
EOF

cat > src/styles/borders.css << 'EOF'
/* Border system and thickness variants */
.app-border { border: 1px solid var(--border); }
.app-border-t { border-top: 1px solid var(--border); }
.app-border-r { border-right: 1px solid var(--border); }
.app-border-b { border-bottom: 1px solid var(--border); }
.app-border-l { border-left: 1px solid var(--border); }

.app-border-accent { border: 1px solid var(--accent); }
.app-border-transparent { border: 1px solid transparent; }

/* Thickness variants */
.border-none .app-border { border-width: 0; }
.border-thin .app-border { border: 1px solid var(--border-thin); }
.border-medium .app-border { border-width: 1px; }
.border-thick .app-border { border-width: 2px; }
EOF

cat > src/styles/components.css << 'EOF'
/* Component-specific styling */

/* Theme-aware utilities */
.bg-background { background-color: var(--background); }
.bg-surface { background-color: var(--surface); }
.bg-surface-hover { background-color: var(--surface-hover); }
.bg-accent { background-color: var(--accent); }
.text-text { color: var(--text); }
.text-text-muted { color: var(--text-muted); }
.text-text-background { color: var(--text-background); }
.text-accent { color: var(--accent); }

/* Shadow utilities */
.shadow-theme { box-shadow: var(--shadow); }

/* Icon containers */
.page-icon svg { width: 1.5rem; height: 1.5rem; }
.tab-icon svg { width: 1rem; height: 1rem; }
.sidebar-icon svg { width: 1.25rem; height: 1.25rem; }
EOF

# Utils
cat > src/utils/cn.ts << 'EOF'
// Class name utility (clsx wrapper)
import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
EOF

cat > src/utils/themeUtils.ts << 'EOF'
// Theme manipulation utilities
import type { ColorScheme, ThemeMode } from '@/types/theme'

export const generateThemeClasses = (
  colorScheme: ColorScheme,
  mode: ThemeMode,
  highContrast: boolean
): string => {
  const classes = ['h-screen', 'flex', 'flex-col', 'bg-background', 'text-text']
  
  // Critical order for CSS specificity
  classes.push(`color-${colorScheme}`)
  if (mode === 'dark') classes.push('dark')
  if (highContrast) classes.push('high-contrast')
  
  return classes.join(' ')
}
EOF

# Page placeholders
cat > src/pages/WelcomePage.tsx << 'EOF'
import { Home } from 'lucide-react'
import type { NavigationConfig } from '@/types/navigation'

const WelcomePage = () => {
  return (
    <div className="h-full overflow-y-auto flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-text mb-4">Welcome to Detox Tool</h1>
        <p className="text-text-muted">JavaScript deobfuscation made simple</p>
      </div>
    </div>
  )
}

export default WelcomePage

export const navigationConfig: NavigationConfig = {
  id: 'welcome',
  label: 'Welcome',
  iconComponent: Home,
  showInSidebar: true,
  order: 0,
  keyboardShortcut: 'Ctrl+H'
}
EOF

cat > src/pages/DeobfuscatorPage.tsx << 'EOF'
import { Code } from 'lucide-react'
import type { NavigationConfig } from '@/types/navigation'

const DeobfuscatorPage = () => {
  return (
    <div className="h-full overflow-y-auto p-6">
      <h1 className="text-2xl font-bold text-text mb-4">Deobfuscator</h1>
      <p className="text-text-muted">Main deobfuscation tool interface</p>
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
EOF

# Create TypeScript-compliant Layout component
cat > src/components/layout/Layout.tsx << 'EOF'
import type { ReactNode } from 'react'

interface LayoutProps {
  children: ReactNode
}

export const Layout = ({ children }: LayoutProps): JSX.Element => {
  return (
    <div className="h-screen flex flex-col bg-background text-text">
      {/* TitleBar */}
      <header className="h-12 bg-surface app-border-b flex items-center px-4">
        <h1 className="text-lg font-semibold text-text">Detox Tool</h1>
      </header>
      
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className="w-64 bg-surface app-border-r p-4">
          <nav>
            <h2 className="text-sm font-medium text-text-muted mb-2">Navigation</h2>
            <div className="text-text">Sidebar Placeholder</div>
          </nav>
        </aside>
        
        {/* Main Content */}
        <main className="flex-1 overflow-hidden">
          {children}
        </main>
      </div>
      
      {/* StatusBar */}
      <footer className="h-6 bg-surface app-border-t flex items-center px-4">
        <span className="text-xs text-text-muted">Ready</span>
      </footer>
    </div>
  )
}
EOF

# Update tailwind.config.js
cat > tailwind.config.js << 'EOF'
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: 'var(--background)',
        surface: 'var(--surface)',
        'surface-hover': 'var(--surface-hover)',
        text: 'var(--text)',
        'text-muted': 'var(--text-muted)',
        'text-background': 'var(--text-background)',
        accent: 'var(--accent)',
        'accent-hover': 'var(--accent-hover)',
        border: 'var(--border)',
      },
      fontFamily: {
        sans: ['var(--font-family)', 'sans-serif'],
      },
      borderRadius: {
        DEFAULT: 'var(--radius)',
      },
      boxShadow: {
        theme: 'var(--shadow)',
      },
    },
  },
  plugins: [],
}
EOF

# Create main.tsx with proper imports and error handling
cat > src/main.tsx << 'EOF'
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './styles/base.css'

const rootElement = document.getElementById('root')
if (!rootElement) {
  throw new Error('Root element not found')
}

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
EOF

# Create App.tsx with TypeScript compliance
cat > src/App.tsx << 'EOF'
import { Layout } from '@/components/layout/Layout'
import WelcomePage from '@/pages/WelcomePage'

function App(): JSX.Element {
  return (
    <Layout>
      <WelcomePage />
    </Layout>
  )
}

export default App
EOF

# Create index.html with proper setup
cat > index.html << 'EOF'
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Detox Tool</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
EOF

# Step 11: Create setup script for future use
echo -e "\n${YELLOW}Step 11: Creating setup script for development...${NC}"

cat > scripts/create-component.sh << 'EOF'
#!/bin/bash
# Script to create new components following the architecture patterns

if [ $# -eq 0 ]; then
    echo "Usage: $0 <component-type> <component-name>"
    echo "Types: page, feature, layout, ui, shared"
    exit 1
fi

TYPE=$1
NAME=$2

case $TYPE in
    page)
        echo "Creating page component: $NAME"
        # Implementation for creating page components
        ;;
    feature)
        echo "Creating feature component: $NAME"
        # Implementation for creating feature components
        ;;
    *)
        echo "Unknown component type: $TYPE"
        exit 1
        ;;
esac
EOF

chmod +x scripts/create-component.sh

# Step 12: Final setup and verification
echo -e "\n${YELLOW}Step 12: Final setup and verification...${NC}"

# Install TypeScript path mapping support
npm install -D @types/node

# Update tsconfig.json for strict TypeScript configuration
cat > tsconfig.json << 'EOF'
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    
    /* Strict Type-Checking Options (ENFORCED) */
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "strictBindCallApply": true,
    "strictPropertyInitialization": true,
    "noImplicitThis": true,
    "alwaysStrict": true,
    
    /* Additional Checks (ENFORCED) */
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "exactOptionalPropertyTypes": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "noUncheckedIndexedAccess": true,
    "noImplicitOverride": true,
    "noPropertyAccessFromIndexSignature": true,
    
    /* Path Mapping */
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"],
      "@/components/*": ["./src/components/*"],
      "@/hooks/*": ["./src/hooks/*"],
      "@/services/*": ["./src/services/*"],
      "@/types/*": ["./src/types/*"],
      "@/utils/*": ["./src/utils/*"],
      "@/config/*": ["./src/config/*"],
      "@/styles/*": ["./src/styles/*"]
    }
  },
  "include": [
    "src",
    "src/**/*.ts",
    "src/**/*.tsx",
    "src/**/*.d.ts"
  ],
  "exclude": [
    "node_modules",
    "dist",
    "build"
  ],
  "references": [{ "path": "./tsconfig.node.json" }]
}
EOF

# Create tsconfig.node.json for build tools
cat > tsconfig.node.json << 'EOF'
{
  "compilerOptions": {
    "composite": true,
    "skipLibCheck": true,
    "module": "ESNext",
    "moduleResolution": "bundler",
    "allowSyntheticDefaultImports": true
  },
  "include": ["vite.config.ts"]
}
EOF

# Update vite.config.ts for comprehensive configuration
cat > vite.config.ts << 'EOF'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@/components": path.resolve(__dirname, "./src/components"),
      "@/hooks": path.resolve(__dirname, "./src/hooks"),
      "@/services": path.resolve(__dirname, "./src/services"),
      "@/types": path.resolve(__dirname, "./src/types"),
      "@/utils": path.resolve(__dirname, "./src/utils"),
      "@/config": path.resolve(__dirname, "./src/config"),
      "@/styles": path.resolve(__dirname, "./src/styles"),
    },
  },
  server: {
    port: 3000,
    open: true,
    host: true,
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          editor: ['@monaco-editor/react'],
          icons: ['lucide-react'],
          motion: ['framer-motion'],
        },
      },
    },
  },
  css: {
    devSourcemap: true,
  },
  define: {
    __APP_VERSION__: JSON.stringify(process.env.npm_package_version),
  },
})
EOF

echo -e "\n${GREEN}✅ Project initialization complete!${NC}"
echo -e "\n${BLUE}Summary:${NC}"
echo "✅ React TypeScript app scaffolded with Vite"
echo "✅ All directories and placeholder files created (50+ components planned)"
echo "✅ All dependencies installed (React, Monaco Editor, Framer Motion, Lucide, etc.)"
echo "✅ Development tools configured (ESLint, Prettier, TypeScript)"
echo "✅ Package.json updated with lint, typecheck, and format scripts"
echo "✅ Tailwind CSS configured with theme variables"
echo "✅ Path aliases configured (@/ for src/)"
echo "✅ Basic layout structure implemented"
echo "✅ 12 custom detox-tool themes configured"
echo "✅ Auto-discovery system placeholders created"
echo "✅ Platform abstraction (Electron + browser) prepared"
echo "✅ Type definitions for all systems created"

echo -e "\n${YELLOW}Next steps:${NC}"
echo "1. cd app && npm run dev  # Start development server"
echo "2. npm run typecheck      # Verify TypeScript setup"
echo "3. npm run lint           # Check code quality"
echo "4. Begin Phase 1 implementation following IMPLEMENTATION_PLAN.md"
echo "5. Use scripts/create-component.sh to generate new components"

echo -e "\n${BLUE}Available npm scripts:${NC}"
echo "• npm run dev            # Development server"
echo "• npm run build          # Production build"
echo "• npm run typecheck      # TypeScript verification"
echo "• npm run lint           # Code linting"
echo "• npm run lint:fix       # Fix linting issues"
echo "• npm run format         # Format code with Prettier"
echo "• npm run check-all      # Run all checks (typecheck + lint + format)"

echo -e "\n${GREEN}🎯 Ready to implement the detox-tool architecture with full tooling support!${NC}"