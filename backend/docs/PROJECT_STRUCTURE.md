# Detox-Tool Backend Project Structure

This document provides the complete project structure for the Detox-Tool backend application, including all current and planned components.

## Complete Project Tree

```
backend/
├── README.md                           # Quick overview and navigation
├── package.json                        # Dependencies and scripts
├── .gitignore                          # Git ignore rules (if local overrides needed)
│
├── app/                                # Application Code
│   ├── api/                           # API Layer
│   │   ├── routes/                    # API Route Definitions
│   │   │   ├── deobfuscation.routes.js    # Main deobfuscation endpoints
│   │   │   ├── analysis.routes.js         # Code analysis endpoints
│   │   │   ├── bundle.routes.js           # Bundle processing endpoints
│   │   │   ├── file.routes.js             # File management endpoints
│   │   │   ├── sourcemap.routes.js        # Source map endpoints
│   │   │   └── health.routes.js           # Health check endpoints
│   │   ├── controllers/               # Request Controllers
│   │   │   ├── DeobfuscationController.js # Main processing controller
│   │   │   ├── AnalysisController.js      # Analysis operations
│   │   │   ├── BundleController.js        # Bundle operations
│   │   │   ├── FileController.js          # File operations
│   │   │   ├── SourceMapController.js     # Source map operations
│   │   │   └── HealthController.js        # Health checks
│   │   ├── middleware/                # API Middleware
│   │   │   ├── auth.middleware.js         # Authentication middleware
│   │   │   ├── validation.middleware.js   # Request validation
│   │   │   ├── error.middleware.js        # Error handling
│   │   │   ├── logging.middleware.js      # Request logging
│   │   │   └── rateLimit.middleware.js    # Rate limiting
│   │   ├── validators/                # Request Validators
│   │   │   ├── deobfuscation.validator.js # Deobfuscation request validation
│   │   │   ├── file.validator.js          # File upload validation
│   │   │   └── common.validator.js        # Common validation rules
│   │   └── DeobfuscationAPI.js        # Main API entry point
│   │
│   ├── core/                          # Core Business Logic
│   │   ├── engines/                   # Deobfuscation Engines
│   │   │   ├── BaseEngine.js              # Abstract base engine
│   │   │   ├── HeavyObfuscationEngine.js  # Heavy obfuscation processor ✅
│   │   │   ├── GenericFormattingEngine.js # Generic formatting
│   │   │   ├── WebpackMinificationEngine.js # Webpack-specific processing
│   │   │   ├── ControlFlowEngine.js       # Control flow deobfuscation
│   │   │   └── ReactComponentEngine.js    # React component extraction
│   │   ├── processors/                # Core Processing Units
│   │   │   ├── StringArrayProcessor.js    # String array processing ✅
│   │   │   ├── VariableNameRecovery.js    # Variable name recovery ✅
│   │   │   ├── ControlFlowProcessor.js    # Control flow analysis
│   │   │   ├── DeadCodeProcessor.js       # Dead code elimination
│   │   │   ├── ComponentExtractor.js     # React component extraction
│   │   │   └── ScopeAnalyzer.js          # Scope and binding analysis
│   │   ├── analyzers/                 # Code Analysis
│   │   │   ├── PatternDetector.js         # Obfuscation pattern detection
│   │   │   ├── ComplexityAnalyzer.js      # Code complexity analysis
│   │   │   ├── SecurityAnalyzer.js        # Security vulnerability scanning
│   │   │   ├── MetricsCollector.js        # Code quality metrics
│   │   │   └── DependencyAnalyzer.js      # Dependency analysis
│   │   ├── transformers/              # Code Transformations
│   │   │   ├── ASTTransformer.js          # Abstract syntax tree operations
│   │   │   ├── ScopeTransformer.js        # Scope manipulation
│   │   │   ├── NameTransformer.js         # Variable/function renaming
│   │   │   └── StructureTransformer.js    # Code structure changes
│   │   └── DeobfuscationEngine.js     # Main orchestration engine
│   │
│   ├── services/                      # Business Services
│   │   ├── processing/                # Processing Services
│   │   │   ├── BundleSplitterService.js   # Bundle splitting logic
│   │   │   ├── SourceMapProcessorService.js # Source map processing
│   │   │   ├── FolderReconstructorService.js # File structure reconstruction
│   │   │   ├── BatchProcessorService.js   # Batch file processing
│   │   │   └── CacheService.js            # Processing cache management
│   │   ├── analysis/                  # Analysis Services
│   │   │   ├── CodeAnalysisService.js     # Code quality analysis
│   │   │   ├── VulnerabilityService.js    # Security vulnerability detection
│   │   │   ├── MetricsService.js          # Performance metrics
│   │   │   └── ReportingService.js        # Analysis reporting
│   │   ├── file/                      # File Management Services
│   │   │   ├── FileService.js             # File I/O operations
│   │   │   ├── UploadService.js           # File upload handling
│   │   │   ├── ValidationService.js       # File validation
│   │   │   └── CompressionService.js      # File compression/decompression
│   │   ├── integration/               # External Integration Services
│   │   │   ├── ElectronIPCService.js      # Electron IPC communication
│   │   │   ├── WebSocketService.js        # Real-time communication
│   │   │   ├── NotificationService.js     # User notifications
│   │   │   └── ExportService.js           # Data export functionality
│   │   └── monitoring/                # Monitoring & Logging Services
│   │       ├── LoggingService.js          # Application logging
│   │       ├── MetricsService.js          # Performance monitoring
│   │       ├── ErrorTrackingService.js    # Error tracking and reporting
│   │       └── HealthCheckService.js      # System health monitoring
│   │
│   ├── utils/                         # Utility Functions
│   │   ├── code/                      # Code Utilities
│   │   │   ├── BeautificationUtils.js     # Code formatting utilities
│   │   │   ├── ASTUtils.js                # AST manipulation helpers
│   │   │   ├── ParserUtils.js             # Code parsing utilities
│   │   │   └── ValidationUtils.js         # Code validation helpers
│   │   ├── file/                      # File Utilities
│   │   │   ├── FileUtils.js               # File system operations
│   │   │   ├── PathUtils.js               # Path manipulation
│   │   │   ├── CompressionUtils.js        # File compression utilities
│   │   │   └── TypeDetectionUtils.js      # File type detection
│   │   ├── security/                  # Security Utilities
│   │   │   ├── SanitizationUtils.js       # Input sanitization
│   │   │   ├── ValidationUtils.js         # Security validation
│   │   │   └── HashingUtils.js            # Hashing and checksums
│   │   ├── performance/               # Performance Utilities
│   │   │   ├── CacheUtils.js              # Caching utilities
│   │   │   ├── MemoryUtils.js             # Memory management
│   │   │   ├── ProfilerUtils.js           # Performance profiling
│   │   │   └── OptimizationUtils.js       # Code optimization helpers
│   │   └── common/                    # Common Utilities
│   │       ├── DateUtils.js               # Date/time operations
│   │       ├── StringUtils.js             # String manipulation
│   │       ├── ObjectUtils.js             # Object manipulation
│   │       ├── ArrayUtils.js              # Array operations
│   │       └── PromiseUtils.js            # Promise utilities
│   │
│   ├── config/                        # Configuration
│   │   ├── app.config.js              # Application configuration
│   │   ├── api.config.js              # API configuration
│   │   ├── database.config.js         # Database configuration (if needed)
│   │   ├── logging.config.js          # Logging configuration
│   │   ├── security.config.js         # Security settings
│   │   └── performance.config.js      # Performance settings
│   │
│   ├── models/                        # Data Models
│   │   ├── DeobfuscationResult.js     # Deobfuscation result model
│   │   ├── AnalysisReport.js          # Analysis report model
│   │   ├── ProcessingJob.js           # Background job model
│   │   ├── FileMetadata.js            # File metadata model
│   │   ├── ErrorReport.js             # Error report model
│   │   └── UserSession.js             # User session model
│   │
│   └── types/                         # Type Definitions
│       ├── api.types.js               # API request/response types
│       ├── engine.types.js            # Engine-specific types
│       ├── file.types.js              # File-related types
│       ├── processing.types.js        # Processing result types
│       └── common.types.js            # Common type definitions
│
├── test/                              # Test Suites
│   ├── unit/                          # Unit Tests
│   │   ├── core/                      # Core logic tests
│   │   │   ├── engines/               # Engine unit tests
│   │   │   ├── processors/            # Processor unit tests
│   │   │   └── analyzers/             # Analyzer unit tests
│   │   ├── services/                  # Service unit tests
│   │   ├── utils/                     # Utility unit tests
│   │   └── api/                       # API unit tests
│   ├── integration/                   # Integration Tests
│   │   ├── api.integration.test.js    # API integration tests
│   │   ├── engine.integration.test.js # Engine integration tests
│   │   └── service.integration.test.js # Service integration tests
│   ├── e2e/                          # End-to-End Tests
│   │   ├── deobfuscation.e2e.test.js # Complete deobfuscation workflows
│   │   ├── file.processing.e2e.test.js # File processing workflows
│   │   └── batch.processing.e2e.test.js # Batch processing workflows
│   ├── performance/                   # Performance Tests
│   │   ├── benchmark.test.js          # Performance benchmarks
│   │   ├── memory.test.js             # Memory usage tests
│   │   └── load.test.js               # Load testing
│   ├── phase1/                        # Phase 1 Tests (String Arrays) ✅
│   │   ├── StringArrayProcessor.test.js
│   │   ├── HeavyObfuscationEngine.integration.test.js
│   │   └── Phase1.demo.test.js
│   ├── phase2/                        # Phase 2 Tests (Variable Recovery) ✅
│   │   ├── VariableNameRecovery.test.js
│   │   └── Phase2.demo.test.js
│   ├── samples/                       # Test Sample Files
│   │   ├── obfuscated/                # Obfuscated code samples
│   │   ├── expected/                  # Expected deobfuscated results
│   │   ├── complex/                   # Complex test cases
│   │   └── edge-cases/                # Edge case samples
│   ├── fixtures/                      # Test Fixtures
│   │   ├── mock-data/                 # Mock data files
│   │   ├── test-files/                # Test file uploads
│   │   └── configurations/            # Test configurations
│   └── helpers/                       # Test Helpers
│       ├── test.utils.js              # Test utility functions
│       ├── mock.factory.js            # Mock object factory
│       ├── assertion.helpers.js       # Custom assertions
│       └── setup.js                   # Test setup and teardown
│
├── docs/                              # Documentation
│   ├── index.md                       # Documentation index ✅
│   ├── README.md                      # Backend overview ✅
│   ├── IMPLEMENTATION_PLAN.md         # 8-phase development plan ✅
│   ├── PROJECT_STRUCTURE.md           # This document ✅
│   ├── ARCHITECTURE.md                # Architecture guide and standards
│   ├── API_REFERENCE.md               # Complete API documentation
│   ├── DEVELOPMENT.md                 # Development guidelines
│   ├── TESTING.md                     # Testing standards and practices
│   ├── DEPLOYMENT.md                  # Deployment instructions
│   └── TROUBLESHOOTING.md             # Common issues and solutions
│
├── scripts/                           # Build and Utility Scripts
│   ├── build/                         # Build scripts
│   │   ├── build.js                   # Production build
│   │   ├── dev.js                     # Development build
│   │   └── clean.js                   # Clean build artifacts
│   ├── test/                          # Test scripts
│   │   ├── test-all.js                # Run all tests
│   │   ├── test-coverage.js           # Generate coverage reports
│   │   └── test-watch.js              # Watch mode testing
│   ├── database/                      # Database scripts (if needed)
│   │   ├── migrate.js                 # Database migrations
│   │   ├── seed.js                    # Seed data
│   │   └── backup.js                  # Database backup
│   └── utils/                         # Utility scripts
│       ├── generate-docs.js           # Generate documentation
│       ├── lint-fix.js                # Fix linting issues
│       └── security-audit.js          # Security audit
│
├── logs/                              # Application Logs (generated)
│   ├── app.log                        # Application logs
│   ├── error.log                      # Error logs
│   ├── access.log                     # API access logs
│   └── performance.log                # Performance logs
│
└── tmp/                               # Temporary Files (generated)
    ├── uploads/                       # Temporary uploaded files
    ├── processing/                    # Files being processed
    ├── cache/                         # Temporary cache files
    └── exports/                       # Temporary export files
```

## Component Status Legend

- ✅ **Implemented** - Component is complete and tested
- 🚧 **In Progress** - Currently being developed
- ⏳ **Planned** - Scheduled for future development
- 🔄 **Refactoring** - Needs improvement or restructuring

## Architecture Overview

### Core Layers

1. **API Layer** (`app/api/`) - HTTP endpoints, request handling, validation
2. **Core Layer** (`app/core/`) - Business logic, deobfuscation engines, processors
3. **Service Layer** (`app/services/`) - Reusable business services
4. **Utility Layer** (`app/utils/`) - Helper functions and utilities
5. **Configuration Layer** (`app/config/`) - Application configuration
6. **Data Layer** (`app/models/`) - Data models and types

### Key Principles

- **Separation of Concerns** - Each layer has distinct responsibilities
- **Dependency Injection** - Components depend on abstractions, not implementations
- **Single Responsibility** - Each class/module has one clear purpose
- **Open/Closed Principle** - Open for extension, closed for modification
- **Interface Segregation** - Small, focused interfaces
- **Clean Architecture** - Dependencies point inward toward core business logic

### Processing Flow

1. **Request** → API Routes → Controllers → Validation
2. **Processing** → Services → Core Engines → Processors
3. **Analysis** → Analyzers → Transformers → Utils
4. **Response** → Models → Serialization → API Response

## Current Implementation Status

### ✅ Completed (Phases 1-2)
- String Array Detection & Decoding
- Variable Name Recovery & Semantic Naming
- Heavy Obfuscation Engine Integration
- Comprehensive Test Framework
- Basic Project Structure

### 🚧 In Development (Phase 3+)
- Control Flow Deobfuscation
- React Component Extraction
- Webpack Bundle Splitting
- Source Map Integration
- File System Management
- Performance Optimization

See [IMPLEMENTATION_PLAN.md](IMPLEMENTATION_PLAN.md) for detailed development phases and [ARCHITECTURE.md](ARCHITECTURE.md) for coding standards and best practices.