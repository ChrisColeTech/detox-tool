#!/bin/bash

# Detox-Tool Backend Initialization Script
# This script scaffolds the complete backend application structure,
# installs all required dependencies, and sets up the development environment.

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Script directory and backend root
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BACKEND_ROOT="$(dirname "$SCRIPT_DIR")"

echo -e "${BLUE}🚀 Detox-Tool Backend Initialization${NC}"
echo -e "${BLUE}====================================${NC}"
echo ""
echo -e "Backend root: ${BACKEND_ROOT}"
echo -e "Script location: ${SCRIPT_DIR}"
echo ""

# Function to create directory if it doesn't exist
create_dir() {
    if [ ! -d "$1" ]; then
        mkdir -p "$1"
        echo -e "${GREEN}✅ Created directory: $1${NC}"
    else
        echo -e "${YELLOW}📁 Directory exists: $1${NC}"
    fi
}

# Function to create file with content if it doesn't exist
create_file() {
    local file_path="$1"
    local content="$2"
    local force="${3:-false}"
    
    if [ ! -f "$file_path" ] || [ "$force" = "true" ]; then
        echo "$content" > "$file_path"
        echo -e "${GREEN}✅ Created file: $file_path${NC}"
    else
        echo -e "${YELLOW}📄 File exists: $file_path${NC}"
    fi
}

# Navigate to backend root
cd "$BACKEND_ROOT"

echo -e "${BLUE}📁 Creating directory structure...${NC}"

# Create main app directories
create_dir "app"
create_dir "app/api"
create_dir "app/api/routes"
create_dir "app/api/controllers"
create_dir "app/api/middleware"
create_dir "app/api/validators"

create_dir "app/core"
create_dir "app/core/engines"
create_dir "app/core/processors"
create_dir "app/core/analyzers"
create_dir "app/core/transformers"

create_dir "app/services"
create_dir "app/services/processing"
create_dir "app/services/analysis"
create_dir "app/services/file"
create_dir "app/services/integration"
create_dir "app/services/monitoring"

create_dir "app/utils"
create_dir "app/utils/code"
create_dir "app/utils/file"
create_dir "app/utils/security"
create_dir "app/utils/performance"
create_dir "app/utils/common"

create_dir "app/config"
create_dir "app/models"
create_dir "app/types"

# Create test directories
create_dir "test/unit"
create_dir "test/unit/core"
create_dir "test/unit/core/engines"
create_dir "test/unit/core/processors"
create_dir "test/unit/core/analyzers"
create_dir "test/unit/services"
create_dir "test/unit/utils"
create_dir "test/unit/api"

create_dir "test/integration"
create_dir "test/e2e"
create_dir "test/performance"
create_dir "test/fixtures"
create_dir "test/fixtures/mock-data"
create_dir "test/fixtures/test-files"
create_dir "test/fixtures/configurations"
create_dir "test/helpers"

# Create additional directories
create_dir "test/samples/obfuscated"
create_dir "test/samples/expected"
create_dir "test/samples/complex"
create_dir "test/samples/edge-cases"

create_dir "scripts"
create_dir "scripts/build"
create_dir "scripts/test"
create_dir "scripts/database"
create_dir "scripts/utils"

create_dir "logs"
create_dir "tmp"
create_dir "tmp/uploads"
create_dir "tmp/processing"
create_dir "tmp/cache"
create_dir "tmp/exports"

echo ""
echo -e "${BLUE}📝 Creating package.json with all dependencies...${NC}"

# Create comprehensive package.json
cat > package.json << 'EOF'
{
  "name": "detox-tool-backend",
  "version": "1.0.0",
  "description": "Backend services for JavaScript deobfuscation with comprehensive processing engines",
  "main": "app/api/DeobfuscationAPI.js",
  "type": "commonjs",
  "engines": {
    "node": ">=16.0.0",
    "npm": ">=8.0.0"
  },
  "scripts": {
    "start": "node app/api/DeobfuscationAPI.js",
    "dev": "nodemon app/api/DeobfuscationAPI.js",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "test:unit": "jest test/unit",
    "test:integration": "jest test/integration",
    "test:e2e": "jest test/e2e",
    "test:performance": "jest test/performance",
    "test:phase1": "jest --testPathPattern=phase1",
    "test:phase2": "jest --testPathPattern=phase2",
    "test:phase3": "jest --testPathPattern=phase3",
    "test:verbose": "jest --verbose",
    "test:debug": "node --inspect-brk node_modules/.bin/jest --runInBand",
    "lint": "eslint app/ test/ --ext .js,.json",
    "lint:fix": "eslint app/ test/ --ext .js,.json --fix",
    "typecheck": "jsdoc -c jsdoc.json --dry-run",
    "format": "prettier --write \"app/**/*.js\" \"test/**/*.js\"",
    "format:check": "prettier --check \"app/**/*.js\" \"test/**/*.js\"",
    "build": "node scripts/build/build.js",
    "build:dev": "node scripts/build/dev.js",
    "clean": "node scripts/build/clean.js",
    "docs:generate": "node scripts/utils/generate-docs.js",
    "security:audit": "npm audit && node scripts/utils/security-audit.js",
    "benchmark": "node test/performance/benchmark.test.js",
    "validate": "npm run lint && npm run typecheck && npm run test:coverage"
  },
  "keywords": [
    "deobfuscation",
    "javascript",
    "pattern-detection",
    "string-arrays",
    "variable-recovery",
    "control-flow",
    "react-components",
    "webpack-bundles",
    "source-maps",
    "ast-manipulation",
    "code-analysis",
    "security-scanning"
  ],
  "author": "Detox-Tool Development Team",
  "license": "MIT",
  "dependencies": {
    "@babel/generator": "^7.23.6",
    "@babel/parser": "^7.23.6",
    "@babel/traverse": "^7.23.6",
    "@babel/core": "^7.23.6",
    "@babel/preset-env": "^7.23.6",
    "acorn": "^8.11.3",
    "escodegen": "^2.1.0",
    "esprima": "^4.0.1",
    "recast": "^0.23.4",
    "js-beautify": "^1.15.1",
    "prettier": "^3.1.1",
    "source-map": "^0.7.4",
    "webpack-sources": "^3.2.3",
    "typescript": "^5.3.3",
    "express": "^4.18.2",
    "cors": "^2.8.5",
    "helmet": "^7.1.0",
    "compression": "^1.7.4",
    "express-rate-limit": "^7.1.5",
    "express-validator": "^7.0.1",
    "multer": "^1.4.5-lts.1",
    "ws": "^8.14.2",
    "uuid": "^9.0.1",
    "lodash": "^4.17.21",
    "moment": "^2.29.4",
    "chalk": "^4.1.2",
    "debug": "^4.3.4",
    "winston": "^3.11.0",
    "pino": "^8.16.2",
    "eventemitter3": "^5.0.1",
    "async": "^3.2.5",
    "p-limit": "^3.1.0",
    "p-queue": "^6.6.2",
    "lru-cache": "^10.1.0",
    "node-cache": "^5.1.2",
    "crypto": "^1.0.1",
    "fs-extra": "^11.2.0",
    "glob": "^10.3.10",
    "mime-types": "^2.1.35",
    "archiver": "^6.0.1",
    "unzipper": "^0.10.14"
  },
  "devDependencies": {
    "jest": "^29.7.0",
    "supertest": "^6.3.3",
    "nodemon": "^3.0.2",
    "eslint": "^8.55.0",
    "eslint-config-standard": "^17.1.0",
    "eslint-plugin-import": "^2.29.0",
    "eslint-plugin-node": "^11.1.0",
    "eslint-plugin-promise": "^6.1.1",
    "eslint-plugin-jest": "^27.6.0",
    "eslint-plugin-security": "^2.1.0",
    "jsdoc": "^4.0.2",
    "@types/node": "^20.10.5",
    "@types/jest": "^29.5.8",
    "husky": "^8.0.3",
    "lint-staged": "^15.2.0",
    "cross-env": "^7.0.3",
    "rimraf": "^5.0.5",
    "concurrently": "^8.2.2",
    "wait-on": "^7.2.0",
    "nock": "^13.4.0",
    "sinon": "^17.0.1",
    "nyc": "^15.1.0",
    "codecov": "^3.8.3"
  },
  "jest": {
    "testEnvironment": "node",
    "collectCoverage": true,
    "coverageDirectory": "coverage",
    "coverageReporters": [
      "text",
      "lcov",
      "html",
      "json"
    ],
    "testMatch": [
      "**/test/**/*.js",
      "**/*.test.js"
    ],
    "collectCoverageFrom": [
      "app/**/*.js",
      "!**/node_modules/**",
      "!**/coverage/**",
      "!**/test/**",
      "!**/logs/**",
      "!**/tmp/**",
      "!**/docs/**",
      "!**/scripts/**"
    ],
    "coverageThreshold": {
      "global": {
        "branches": 80,
        "functions": 80,
        "lines": 80,
        "statements": 80
      }
    },
    "setupFilesAfterEnv": [
      "<rootDir>/test/helpers/setup.js"
    ],
    "testTimeout": 30000,
    "maxWorkers": "50%",
    "verbose": false
  },
  "lint-staged": {
    "*.js": [
      "eslint --fix",
      "prettier --write"
    ]
  },
  "husky": {
    "hooks": {
      "pre-commit": "lint-staged",
      "pre-push": "npm run validate"
    }
  },
  "eslintConfig": {
    "extends": [
      "standard",
      "plugin:jest/recommended",
      "plugin:security/recommended"
    ],
    "env": {
      "node": true,
      "jest": true,
      "es2022": true
    },
    "parserOptions": {
      "ecmaVersion": 2022,
      "sourceType": "module"
    },
    "rules": {
      "no-console": "warn",
      "no-debugger": "error",
      "no-unused-vars": "error",
      "prefer-const": "error",
      "no-var": "error",
      "object-shorthand": "error",
      "prefer-template": "error",
      "template-curly-spacing": "error",
      "max-len": [
        "error",
        {
          "code": 100,
          "ignoreUrls": true,
          "ignoreStrings": true
        }
      ],
      "complexity": [
        "error",
        10
      ],
      "max-depth": [
        "error",
        4
      ],
      "max-lines-per-function": [
        "error",
        50
      ]
    }
  }
}
EOF

echo -e "${GREEN}✅ Created comprehensive package.json${NC}"

echo ""
echo -e "${BLUE}📝 Creating configuration files...${NC}"

# Create ESLint configuration
create_file ".eslintrc.js" 'module.exports = {
  extends: [
    "standard",
    "plugin:jest/recommended",
    "plugin:security/recommended"
  ],
  env: {
    node: true,
    jest: true,
    es2022: true
  },
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: "module"
  },
  rules: {
    "no-console": "warn",
    "no-debugger": "error",
    "no-unused-vars": "error",
    "prefer-const": "error",
    "no-var": "error",
    "object-shorthand": "error",
    "prefer-template": "error",
    "template-curly-spacing": "error",
    "max-len": ["error", { "code": 100, "ignoreUrls": true, "ignoreStrings": true }],
    "complexity": ["error", 10],
    "max-depth": ["error", 4],
    "max-lines-per-function": ["error", 50]
  }
};'

# Create Prettier configuration
create_file ".prettierrc" '{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 100,
  "tabWidth": 2,
  "useTabs": false,
  "bracketSpacing": true,
  "arrowParens": "avoid",
  "endOfLine": "lf"
}'

# Create JSDoc configuration
create_file "jsdoc.json" '{
  "source": {
    "include": ["./app"],
    "includePattern": "\\.(js)$",
    "exclude": ["node_modules/"]
  },
  "opts": {
    "destination": "./docs/api/"
  },
  "plugins": ["plugins/markdown"]
}'

# Create nodemon configuration
create_file "nodemon.json" '{
  "watch": ["app"],
  "ext": "js,json",
  "ignore": ["test/*", "docs/*", "logs/*", "tmp/*"],
  "exec": "node app/api/DeobfuscationAPI.js",
  "env": {
    "NODE_ENV": "development"
  },
  "delay": 1000
}'

echo ""
echo -e "${BLUE}📝 Creating placeholder source files...${NC}"

# Create main API entry point
create_file "app/api/DeobfuscationAPI.js" '/**
 * Deobfuscation API
 * Main API interface for Electron IPC communication and HTTP endpoints
 */

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const compression = require("compression");
const rateLimit = require("express-rate-limit");

class DeobfuscationAPI {
  constructor() {
    this.app = express();
    this.port = process.env.PORT || 3001;
    this.setupMiddleware();
    this.setupRoutes();
  }

  setupMiddleware() {
    this.app.use(helmet());
    this.app.use(cors());
    this.app.use(compression());
    this.app.use(express.json({ limit: "50mb" }));
    this.app.use(express.urlencoded({ extended: true, limit: "50mb" }));

    // Rate limiting
    const limiter = rateLimit({
      windowMs: 1 * 60 * 1000, // 1 minute
      max: 100, // limit each IP to 100 requests per windowMs
      message: "Too many requests from this IP"
    });
    this.app.use("/api/", limiter);
  }

  setupRoutes() {
    // Health check
    this.app.get("/health", (req, res) => {
      res.json({
        status: "healthy",
        timestamp: new Date().toISOString(),
        version: "1.0.0"
      });
    });

    // API routes will be added here as they are implemented
    this.app.use("/api/v1", this.createApiRoutes());
  }

  createApiRoutes() {
    const router = express.Router();
    
    // Placeholder routes - will be implemented in phases
    router.post("/deobfuscate", (req, res) => {
      res.status(501).json({
        success: false,
        error: { code: "NOT_IMPLEMENTED", message: "Endpoint not implemented yet" }
      });
    });

    return router;
  }

  start() {
    this.app.listen(this.port, () => {
      console.log(`🚀 Detox-Tool Backend API listening on port ${this.port}`);
      console.log(`📊 Health check: http://localhost:${this.port}/health`);
    });
  }
}

// Start server if this file is run directly
if (require.main === module) {
  const api = new DeobfuscationAPI();
  api.start();
}

module.exports = DeobfuscationAPI;'

# Create configuration files
create_file "app/config/app.config.js" '/**
 * Application Configuration
 * Main configuration settings for the Detox-Tool backend
 */

module.exports = {
  app: {
    name: "detox-tool-backend",
    version: "1.0.0",
    environment: process.env.NODE_ENV || "development",
    port: process.env.PORT || 3001
  },
  
  processing: {
    timeout: 30000, // 30 seconds
    maxFileSize: 50 * 1024 * 1024, // 50MB
    maxConcurrency: 3,
    cacheEnabled: true,
    cacheTTL: 10 * 60 * 1000 // 10 minutes
  },

  security: {
    rateLimit: {
      windowMs: 1 * 60 * 1000, // 1 minute
      max: 100 // requests per window
    },
    cors: {
      origin: process.env.CORS_ORIGIN || "*",
      credentials: true
    }
  },

  logging: {
    level: process.env.LOG_LEVEL || "info",
    file: {
      enabled: true,
      path: "./logs/app.log"
    },
    console: {
      enabled: true,
      colorize: true
    }
  }
};'

# Create test setup file
create_file "test/helpers/setup.js" '/**
 * Test Setup and Helpers
 * Global test configuration and helper functions
 */

// Set test environment
process.env.NODE_ENV = "test";

// Global test helpers
global.testHelpers = {
  // Test data generators
  generateHexVariable: (prefix = "_0x") => {
    const hex = Math.random().toString(16).substring(2, 8);
    return `${prefix}${hex}`;
  },

  generateObfuscatedCode: (stringCount = 3) => {
    const strings = Array.from({ length: stringCount }, (_, i) => `"string${i}"`);
    const arrayName = global.testHelpers.generateHexVariable();
    return `var ${arrayName} = [${strings.join(", ")}];`;
  },

  // Common test utilities
  expectProcessingResult: (result) => {
    expect(result).toBeDefined();
    expect(result).toHaveProperty("success");
    if (result.success) {
      expect(result).toHaveProperty("deobfuscatedCode");
      expect(result).toHaveProperty("statistics");
    } else {
      expect(result).toHaveProperty("error");
    }
  }
};

// Jest global setup
beforeAll(() => {
  console.log("🧪 Test suite starting...");
});

afterAll(() => {
  console.log("✅ Test suite completed");
});'

# Create basic placeholder files for key components
create_file "app/core/processors/ControlFlowProcessor.js" '/**
 * Control Flow Processor
 * Handles control flow deobfuscation and simplification
 * 
 * @status: Phase 3 - Not yet implemented
 */

class ControlFlowProcessor {
  constructor(options = {}) {
    this.options = options;
  }

  async process(code, options = {}) {
    throw new Error("ControlFlowProcessor not yet implemented - Phase 3");
  }
}

module.exports = ControlFlowProcessor;'

create_file "app/core/processors/ComponentExtractor.js" '/**
 * Component Extractor
 * Extracts React components from obfuscated bundles
 * 
 * @status: Phase 4 - Not yet implemented
 */

class ComponentExtractor {
  constructor(options = {}) {
    this.options = options;
  }

  async extract(code, options = {}) {
    throw new Error("ComponentExtractor not yet implemented - Phase 4");
  }
}

module.exports = ComponentExtractor;'

create_file "app/services/processing/CacheService.js" '/**
 * Cache Service
 * Manages processing result caching for performance optimization
 * 
 * @status: Phase 11 - Not yet implemented
 */

class CacheService {
  constructor(options = {}) {
    this.options = options;
  }

  get(key) {
    throw new Error("CacheService not yet implemented - Phase 11");
  }

  set(key, value, ttl) {
    throw new Error("CacheService not yet implemented - Phase 11");
  }
}

module.exports = CacheService;'

# Create build scripts
create_file "scripts/build/build.js" '/**
 * Production Build Script
 */

const fs = require("fs-extra");
const path = require("path");

console.log("🏗️  Building Detox-Tool Backend for production...");

async function build() {
  try {
    // Clean previous build
    await fs.remove("dist");
    
    // Copy source files
    await fs.copy("app", "dist/app");
    await fs.copy("package.json", "dist/package.json");
    
    console.log("✅ Build completed successfully");
  } catch (error) {
    console.error("❌ Build failed:", error);
    process.exit(1);
  }
}

build();'

create_file "scripts/build/clean.js" '/**
 * Clean Build Artifacts Script
 */

const fs = require("fs-extra");

console.log("🧹 Cleaning build artifacts...");

async function clean() {
  try {
    await Promise.all([
      fs.remove("dist"),
      fs.remove("coverage"),
      fs.remove("logs"),
      fs.remove("tmp")
    ]);
    
    console.log("✅ Cleanup completed");
  } catch (error) {
    console.error("❌ Cleanup failed:", error);
  }
}

clean();'

echo ""
echo -e "${BLUE}📦 Installing all dependencies...${NC}"

# Install all dependencies
npm install

echo ""
echo -e "${BLUE}🔧 Setting up development tools...${NC}"

# Initialize husky (if not already done)
if command -v husky &> /dev/null; then
    npx husky install
    echo -e "${GREEN}✅ Husky git hooks configured${NC}"
fi

# Create initial test to verify setup
create_file "test/setup.test.js" '/**
 * Setup Verification Test
 * Ensures the backend initialization was successful
 */

describe("Backend Setup Verification", () => {
  test("should have all required directories", () => {
    const fs = require("fs");
    const path = require("path");
    
    const requiredDirs = [
      "app",
      "app/api",
      "app/core",
      "app/services",
      "app/utils",
      "test",
      "docs"
    ];
    
    requiredDirs.forEach(dir => {
      const dirPath = path.join(__dirname, "..", dir);
      expect(fs.existsSync(dirPath)).toBe(true);
    });
  });

  test("should have package.json with all required dependencies", () => {
    const packageJson = require("../package.json");
    
    // Check key dependencies
    expect(packageJson.dependencies).toHaveProperty("@babel/parser");
    expect(packageJson.dependencies).toHaveProperty("express");
    expect(packageJson.devDependencies).toHaveProperty("jest");
    expect(packageJson.devDependencies).toHaveProperty("eslint");
  });

  test("should have configuration files", () => {
    const fs = require("fs");
    const path = require("path");
    
    const configFiles = [
      ".eslintrc.js",
      ".prettierrc",
      "jsdoc.json",
      "nodemon.json"
    ];
    
    configFiles.forEach(file => {
      const filePath = path.join(__dirname, "..", file);
      expect(fs.existsSync(filePath)).toBe(true);
    });
  });
});'

echo ""
echo -e "${GREEN}🎉 Backend initialization completed successfully!${NC}"
echo ""
echo -e "${BLUE}📋 Summary:${NC}"
echo -e "   ✅ Complete directory structure created"
echo -e "   ✅ Package.json with all dependencies configured"
echo -e "   ✅ Development tools setup (ESLint, Prettier, Husky)"
echo -e "   ✅ Test framework configured with Jest"
echo -e "   ✅ Build scripts and configuration files created"
echo -e "   ✅ All packages installed ($(npm list --depth=0 2>/dev/null | grep -c -E '^[├└]' || echo 'many') packages)"
echo ""
echo -e "${BLUE}🚀 Next steps:${NC}"
echo -e "   1. Run ${YELLOW}npm test${NC} to verify setup"
echo -e "   2. Run ${YELLOW}npm run dev${NC} to start development server"
echo -e "   3. Run ${YELLOW}npm run lint${NC} to check code quality"
echo -e "   4. Begin Phase 3 development: Control Flow Deobfuscation"
echo ""
echo -e "${BLUE}📚 Available commands:${NC}"
echo -e "   ${YELLOW}npm run dev${NC}           - Start development server"
echo -e "   ${YELLOW}npm test${NC}              - Run all tests"
echo -e "   ${YELLOW}npm run test:coverage${NC} - Run tests with coverage"
echo -e "   ${YELLOW}npm run lint${NC}          - Check code quality"
echo -e "   ${YELLOW}npm run format${NC}        - Format code with Prettier"
echo -e "   ${YELLOW}npm run validate${NC}      - Run full validation (lint + typecheck + test)"
echo ""
echo -e "${GREEN}🎯 The backend is now ready for development!${NC}"