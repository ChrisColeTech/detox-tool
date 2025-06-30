# Detox-Tool Backend

The backend deobfuscation engine for the Detox-Tool project.

## Documentation

All comprehensive documentation has been moved to the `docs/` folder:

- **[Backend Status & Overview](docs/README.md)** - Complete status assessment, current capabilities, and missing features
- **[Implementation Plan](docs/IMPLEMENTATION_PLAN.md)** - 8-phase development plan with detailed breakdown

## Quick Start

```bash
# Install dependencies
npm install

# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Run specific phase tests
npm test -- test/phase1/
npm test -- test/phase2/
```

## Current Status

✅ **Phase 1: String Array Deobfuscation Engine** - COMPLETE  
✅ **Phase 2: Variable Name Recovery System** - COMPLETE  
🚧 **Phase 3: Control Flow Deobfuscation** - In Progress

## Core Features

- **Heavy Obfuscation Engine** with string array decoding and variable recovery
- **Intelligent variable name recovery** with semantic naming strategies
- **React/DOM/Event pattern recognition** for specialized naming
- **Comprehensive test suite** with 97%+ code coverage
- **Performance optimized** for large codebases

## Project Structure

For the complete project structure including all planned components and services, see [docs/PROJECT_STRUCTURE.md](docs/PROJECT_STRUCTURE.md).

See [docs/README.md](docs/README.md) for detailed capabilities and status.