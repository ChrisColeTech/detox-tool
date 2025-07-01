# Scripts Directory

This directory contains all executable scripts for the Detox Tool frontend project.

## Structure

### `/cli/` - Node.js CLI Tools
- **ScaffoldGenerator.cjs** - Core scaffold generation engine from task-writer
- **DirectoryScanner.cjs** - Directory scanning utility
- **generate-component-scripts.js** - Generates core component scripts (layout, hooks, services, UI)
- **generate-missing-components.js** - Generates additional scripts (pages, sidebar, menu, contexts)
- **generate-missing-feature-components.js** - Generates feature scripts (spotlight, tabbar, welcome, settings)
- **generate-shared-forms.js** - Generates shared form component scripts
- **test-*.js** - Testing utilities for the generation system

### Root Scripts - Bash Executables
- **init-project-complete.sh** - Complete project initialization script
- **run-all-component-scripts.sh** - Master script to run all component generators
- **create-detox-*.sh** - Individual component generation scripts (22 total)

## Usage

### Initial Setup (run from detox-tool root)
```bash
# 1. Initialize complete project structure
bash frontend/scripts/init-project-complete.sh

# 2. Generate all components from task-writer
bash frontend/scripts/run-all-component-scripts.sh
```

### Generate New Scripts (run from frontend/scripts)
```bash
# Generate new component scripts from task-writer source
node cli/generate-component-scripts.js
node cli/generate-missing-components.js
node cli/generate-missing-feature-components.js
```

## ScaffoldGenerator Configuration

All generators use these standard options:
- `supportedFileTypes: ['.tsx', '.ts', '.jsx', '.js']`
- `excludeNodeModules: true`
- `createDirectoriesOnly: false`
- `includeContent: true`

## Script Categories

- **Layout**: TitleBar, Sidebar, StatusBar, LayoutMainContent
- **Features**: Settings, Search, FileTree, Welcome, Tabbar
- **UI**: Button, Modal, Toast, Card, LoadingSpinner
- **Shared**: Forms, Generators, Common utilities
- **Core**: Services, Hooks, Types, Contexts
- **Config**: Navigation, Themes, Settings

All scripts follow the task-writer architecture and generate production-ready React TypeScript components with complete file contents from the source.