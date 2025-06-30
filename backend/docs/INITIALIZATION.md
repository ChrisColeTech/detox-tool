# Backend Initialization Scripts

This directory contains initialization scripts that will scaffold the complete Detox-Tool backend application according to the [PROJECT_STRUCTURE.md](PROJECT_STRUCTURE.md) specification.

## Available Scripts

### 🐧 Linux/macOS: `init-backend.sh`
```bash
# Make executable (if needed)
chmod +x docs/init-backend.sh

# Run the initialization
./docs/init-backend.sh
```

### 🪟 Windows: `init-backend.ps1`
```powershell
# Run the initialization
powershell -ExecutionPolicy Bypass -File docs/init-backend.ps1

# Or with force flag to overwrite existing files
powershell -ExecutionPolicy Bypass -File docs/init-backend.ps1 -Force
```

## What the Scripts Do

### 1. 📁 **Directory Structure Creation**
Creates the complete backend directory structure including:
- **Application code** (`app/`) - API, core engines, services, utilities
- **Test suites** (`test/`) - Unit, integration, e2e, performance tests
- **Build scripts** (`scripts/`) - Build, test, and utility scripts
- **Temporary directories** (`logs/`, `tmp/`) - Runtime generated content

### 2. 📦 **Package Management**
- **Comprehensive package.json** with all required dependencies
- **Production dependencies**: Express, Babel, AST libraries, processing tools
- **Development dependencies**: Jest, ESLint, Prettier, Nodemon, testing tools
- **Scripts configuration**: Test, lint, build, development commands
- **Jest configuration**: Coverage thresholds, test patterns, setup files

### 3. 🔧 **Development Tools Setup**
- **ESLint configuration** with Standard JS style and security rules
- **Prettier configuration** for consistent code formatting
- **JSDoc configuration** for documentation generation
- **Nodemon configuration** for development server auto-restart
- **Husky git hooks** for pre-commit validation

### 4. 📝 **Placeholder Source Files**
Creates essential placeholder files:
- **Main API entry point** (`app/api/DeobfuscationAPI.js`)
- **Configuration files** (`app/config/app.config.js`)
- **Test setup helpers** (`test/helpers/setup.js`)
- **Core processor stubs** for future phase implementation
- **Build and utility scripts**

### 5. 🧪 **Testing Framework**
- **Jest test runner** with comprehensive configuration
- **Coverage reporting** (HTML, LCOV, JSON formats)
- **Test helpers and utilities** for consistent testing
- **Performance benchmarking** setup
- **Setup verification tests** to ensure proper initialization

## Dependencies Installed

### Core Processing Dependencies
```json
{
  "@babel/parser": "AST parsing and code generation",
  "@babel/traverse": "AST traversal and manipulation", 
  "@babel/generator": "Code generation from AST",
  "recast": "AST manipulation with source fidelity",
  "source-map": "Source map processing",
  "webpack-sources": "Webpack bundle parsing",
  "prettier": "Code formatting",
  "js-beautify": "Fallback code formatting"
}
```

### API & Server Dependencies
```json
{
  "express": "Web framework",
  "cors": "Cross-origin resource sharing",
  "helmet": "Security headers",
  "compression": "Response compression",
  "express-rate-limit": "Rate limiting",
  "express-validator": "Request validation",
  "multer": "File upload handling",
  "ws": "WebSocket support"
}
```

### Development & Testing Tools
```json
{
  "jest": "Testing framework",
  "eslint": "Code linting",
  "prettier": "Code formatting",
  "nodemon": "Development server",
  "husky": "Git hooks",
  "supertest": "API testing"
}
```

## Post-Initialization Verification

After running the initialization script, verify the setup:

```bash
# Check that all tests pass
npm test

# Verify code quality
npm run lint

# Start development server
npm run dev

# Check API health endpoint
curl http://localhost:3001/health
```

Expected health check response:
```json
{
  "status": "healthy",
  "timestamp": "2024-06-30T13:00:00.000Z",
  "version": "1.0.0"
}
```

## Available NPM Scripts

| Script | Description |
|--------|-------------|
| `npm start` | Start production server |
| `npm run dev` | Start development server with auto-restart |
| `npm test` | Run all tests |
| `npm run test:coverage` | Run tests with coverage report |
| `npm run test:unit` | Run unit tests only |
| `npm run test:integration` | Run integration tests only |
| `npm run test:e2e` | Run end-to-end tests |
| `npm run test:performance` | Run performance benchmarks |
| `npm run lint` | Check code quality |
| `npm run lint:fix` | Fix linting issues automatically |
| `npm run format` | Format code with Prettier |
| `npm run validate` | Run full validation (lint + typecheck + test) |
| `npm run build` | Build for production |
| `npm run clean` | Clean build artifacts |

## Development Workflow

1. **Initialize the backend**: Run the appropriate init script
2. **Verify setup**: `npm test` and `npm run lint`
3. **Start development**: `npm run dev`
4. **Follow Phase 3**: Begin implementing Control Flow Deobfuscation
5. **Quality gates**: Use `npm run validate` before commits

## Phase Implementation Status

After initialization:
- ✅ **Phase 1**: String Array Deobfuscation - **COMPLETE**
- ✅ **Phase 2**: Variable Name Recovery - **COMPLETE**  
- 🚧 **Phase 3**: Control Flow Deobfuscation - **Ready for development**
- ⏳ **Phases 4-12**: Placeholder files created, ready for implementation

## Troubleshooting

### Common Issues

**Permission denied on Linux/macOS:**
```bash
chmod +x docs/init-backend.sh
```

**PowerShell execution policy on Windows:**
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

**Node version compatibility:**
- Requires Node.js >=16.0.0
- Requires npm >=8.0.0

**Package installation failures:**
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Verification Commands

```bash
# Check Node and npm versions
node --version
npm --version

# Verify all dependencies installed
npm list --depth=0

# Test the complete setup
npm run validate
```

## Next Steps

1. **Run initialization script** for your platform
2. **Verify setup** with `npm test`
3. **Review architecture**: Read [ARCHITECTURE.md](ARCHITECTURE.md)
4. **Begin Phase 3**: Start Control Flow Deobfuscation implementation
5. **Follow development standards** outlined in the architecture guide

The initialization creates a production-ready development environment following industry best practices for Node.js applications, with comprehensive testing, linting, and build tools configured.