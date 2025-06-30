# Detox-Tool Backend Architecture Guide

This document outlines the architectural principles, design patterns, coding standards, and best practices for the Detox-Tool backend application.

## Table of Contents

1. [Architectural Principles](#architectural-principles)
2. [Design Patterns](#design-patterns)
3. [Code Organization](#code-organization)
4. [Coding Standards](#coding-standards)
5. [Testing Standards](#testing-standards)
6. [Performance Guidelines](#performance-guidelines)
7. [Security Standards](#security-standards)
8. [Error Handling](#error-handling)
9. [Anti-Patterns to Avoid](#anti-patterns-to-avoid)
10. [Code Quality Metrics](#code-quality-metrics)

## Architectural Principles

### 1. Clean Architecture
We follow Clean Architecture principles with clear separation of concerns:

```
┌─────────────────────────────────────────────────┐
│                    API Layer                    │ ← Routes, Controllers, Middleware
├─────────────────────────────────────────────────┤
│                 Service Layer                   │ ← Business Services, Orchestration
├─────────────────────────────────────────────────┤
│                   Core Layer                    │ ← Engines, Processors, Business Logic
├─────────────────────────────────────────────────┤
│                 Utility Layer                   │ ← Utils, Helpers, Common Functions
└─────────────────────────────────────────────────┘
```

**Key Principles:**
- **Dependency Rule**: Dependencies point inward toward core business logic
- **Interface Segregation**: Small, focused interfaces
- **Dependency Injection**: Components depend on abstractions, not implementations
- **Single Responsibility**: Each module has one clear purpose

### 2. Modular Design
- **High Cohesion**: Related functionality grouped together
- **Loose Coupling**: Minimal dependencies between modules
- **Clear Interfaces**: Well-defined contracts between components
- **Pluggable Architecture**: Components can be easily replaced or extended

### 3. SOLID Principles
- **S**ingle Responsibility Principle
- **O**pen/Closed Principle
- **L**iskov Substitution Principle
- **I**nterface Segregation Principle
- **D**ependency Inversion Principle

## Design Patterns

### 1. Strategy Pattern
Used for deobfuscation engines and processors:

```javascript
// Base Engine Interface
class BaseEngine {
  async process(code, options) {
    throw new Error('Process method must be implemented');
  }
  
  getCapabilities() {
    throw new Error('GetCapabilities method must be implemented');
  }
}

// Concrete Implementations
class HeavyObfuscationEngine extends BaseEngine {
  async process(code, options) {
    // Heavy obfuscation specific logic
  }
}

class WebpackMinificationEngine extends BaseEngine {
  async process(code, options) {
    // Webpack specific logic
  }
}
```

### 2. Factory Pattern
Used for creating appropriate processors:

```javascript
class ProcessorFactory {
  static createProcessor(type, options = {}) {
    switch (type) {
      case 'string-array':
        return new StringArrayProcessor(options);
      case 'variable-recovery':
        return new VariableNameRecovery(options);
      case 'control-flow':
        return new ControlFlowProcessor(options);
      default:
        throw new Error(`Unknown processor type: ${type}`);
    }
  }
}
```

### 3. Observer Pattern
Used for progress tracking and notifications:

```javascript
class ProcessingJob extends EventEmitter {
  constructor(jobId) {
    super();
    this.jobId = jobId;
    this.progress = 0;
  }
  
  updateProgress(percentage, step) {
    this.progress = percentage;
    this.emit('progress', { jobId: this.jobId, percentage, step });
  }
  
  complete(result) {
    this.emit('completed', { jobId: this.jobId, result });
  }
}
```

### 4. Command Pattern
Used for batch operations and undo functionality:

```javascript
class DeobfuscationCommand {
  constructor(processor, code, options) {
    this.processor = processor;
    this.code = code;
    this.options = options;
    this.result = null;
  }
  
  async execute() {
    this.result = await this.processor.process(this.code, this.options);
    return this.result;
  }
  
  canUndo() {
    return this.result !== null;
  }
  
  undo() {
    return this.code; // Return original code
  }
}
```

### 5. Adapter Pattern
Used for integrating external libraries:

```javascript
class BabelASTAdapter {
  constructor(babelParser) {
    this.parser = babelParser;
  }
  
  parse(code) {
    return this.parser.parse(code, {
      sourceType: 'module',
      allowImportExportEverywhere: true,
      plugins: ['jsx', 'typescript']
    });
  }
  
  generate(ast) {
    return this.parser.generate(ast).code;
  }
}
```

## Code Organization

### 1. File Naming Conventions
- **Classes**: PascalCase (e.g., `StringArrayProcessor.js`)
- **Functions/Variables**: camelCase (e.g., `processCode`)
- **Constants**: SCREAMING_SNAKE_CASE (e.g., `MAX_PROCESSING_TIME`)
- **Directories**: kebab-case (e.g., `string-arrays`)

### 2. Module Structure
Each module should follow this structure:

```javascript
/**
 * ModuleName - Brief description
 * Detailed description of what this module does
 */

// External dependencies
const externalLib = require('external-lib');

// Internal dependencies  
const InternalModule = require('./InternalModule');

// Constants
const DEFAULT_OPTIONS = {
  timeout: 30000,
  retries: 3
};

// Main class
class ModuleName {
  constructor(options = {}) {
    this.options = { ...DEFAULT_OPTIONS, ...options };
    this.state = new Map();
  }
  
  // Public methods
  async publicMethod(param) {
    // Implementation
  }
  
  // Private methods
  _privateMethod(param) {
    // Implementation
  }
}

// Static methods
ModuleName.staticMethod = function() {
  // Implementation
};

// Export
module.exports = ModuleName;
```

### 3. Error Classes
Standardized error hierarchy:

```javascript
class DetoxToolError extends Error {
  constructor(message, code = 'GENERIC_ERROR', details = null) {
    super(message);
    this.name = this.constructor.name;
    this.code = code;
    this.details = details;
    this.timestamp = new Date().toISOString();
  }
}

class ProcessingError extends DetoxToolError {
  constructor(message, details = null) {
    super(message, 'PROCESSING_ERROR', details);
  }
}

class ValidationError extends DetoxToolError {
  constructor(message, field = null) {
    super(message, 'VALIDATION_ERROR', { field });
  }
}
```

## Coding Standards

### 1. Code Style
- **Indentation**: 2 spaces (no tabs)
- **Line Length**: 100 characters maximum
- **Semicolons**: Always use semicolons
- **Quotes**: Single quotes for strings, double quotes for JSX
- **Trailing Commas**: Use trailing commas in multiline objects/arrays

### 2. Function Guidelines
- **Function Length**: Maximum 50 lines
- **Parameter Count**: Maximum 5 parameters, use options object for more
- **Pure Functions**: Prefer pure functions when possible
- **Single Responsibility**: Each function should do one thing well

```javascript
// Good: Small, focused function
function validateCodeInput(code) {
  if (!code || typeof code !== 'string') {
    throw new ValidationError('Code must be a non-empty string');
  }
  
  if (code.length > MAX_CODE_LENGTH) {
    throw new ValidationError('Code exceeds maximum length');
  }
  
  return true;
}

// Bad: Large, multi-responsibility function
function processEverything(code, options, callback) {
  // 100+ lines of mixed validation, processing, and output logic
}
```

### 3. Class Guidelines
- **Class Size**: Maximum 300 lines
- **Method Count**: Maximum 20 methods per class
- **Constructor Complexity**: Keep constructors simple
- **Inheritance Depth**: Maximum 3 levels of inheritance

```javascript
// Good: Focused, single-responsibility class
class StringArrayProcessor {
  constructor(options = {}) {
    this.options = this._validateOptions(options);
    this.stringArrays = new Map();
    this.decoders = new Map();
  }
  
  async process(code) {
    this._reset();
    const ast = this._parseCode(code);
    const arrays = this._detectStringArrays(ast);
    const decoders = this._extractDecoders(ast);
    const mappings = this._buildMappings(arrays, decoders);
    return this._replaceReferences(code, ast, mappings);
  }
  
  // Other focused methods...
}
```

### 4. Documentation Standards
- **JSDoc Comments**: All public methods must have JSDoc
- **Inline Comments**: Explain complex logic, not obvious code
- **README Files**: Each major module should have README
- **Type Annotations**: Use JSDoc for type information

```javascript
/**
 * Processes obfuscated string arrays and replaces references with actual strings
 * @param {string} code - JavaScript code containing obfuscated string arrays
 * @param {Object} options - Processing options
 * @param {boolean} options.preserveArrays - Whether to keep original arrays
 * @param {number} options.maxArraySize - Maximum array size to process
 * @returns {Promise<Object>} Processing result with deobfuscated code
 * @throws {ProcessingError} When code parsing fails
 * @example
 * const processor = new StringArrayProcessor();
 * const result = await processor.process(obfuscatedCode);
 * console.log(result.deobfuscatedCode);
 */
async process(code, options = {}) {
  // Implementation
}
```

## Testing Standards

### 1. Test Structure
- **Test Files**: `*.test.js` suffix
- **Test Organization**: Mirror source directory structure
- **Describe Blocks**: Group related tests logically
- **Test Names**: Descriptive and specific

```javascript
describe('StringArrayProcessor', () => {
  let processor;
  
  beforeEach(() => {
    processor = new StringArrayProcessor();
  });
  
  describe('Constructor', () => {
    test('should initialize with default options', () => {
      expect(processor.options).toBeDefined();
      expect(processor.stringArrays.size).toBe(0);
    });
    
    test('should merge custom options with defaults', () => {
      const customProcessor = new StringArrayProcessor({ timeout: 5000 });
      expect(customProcessor.options.timeout).toBe(5000);
    });
  });
  
  describe('process()', () => {
    test('should detect and decode simple string arrays', async () => {
      const code = "var _0x123 = ['hello', 'world'];";
      const result = await processor.process(code);
      
      expect(result.success).toBe(true);
      expect(result.statistics.stringArraysFound).toBe(1);
    });
    
    test('should handle invalid JavaScript gracefully', async () => {
      const invalidCode = "invalid javascript {{{";
      const result = await processor.process(invalidCode);
      
      expect(result.success).toBe(false);
      expect(result.error).toContain('parsing');
    });
  });
});
```

### 2. Test Coverage Requirements
- **Minimum Coverage**: 80% lines, 75% branches
- **Critical Paths**: 95% coverage for core business logic
- **Unit Tests**: Test individual components in isolation
- **Integration Tests**: Test component interactions
- **End-to-End Tests**: Test complete workflows

### 3. Test Data Management
- **Fixtures**: Use test fixtures for complex data
- **Mocks**: Mock external dependencies
- **Test Isolation**: Each test should be independent
- **Setup/Teardown**: Use proper setup and cleanup

```javascript
// Test fixtures
const testFixtures = {
  simpleObfuscated: "var _0x123=['hello','world'];",
  complexObfuscated: require('./fixtures/complex-sample.js'),
  expectedOutput: require('./fixtures/expected-output.js')
};

// Mocking external dependencies
jest.mock('@babel/parser', () => ({
  parse: jest.fn().mockImplementation((code) => ({
    type: 'Program',
    body: []
  }))
}));
```

## Performance Guidelines

### 1. Memory Management
- **Object Pooling**: Reuse objects for frequent operations
- **Memory Leaks**: Avoid circular references and event listener leaks
- **Large Data**: Stream processing for large files
- **Garbage Collection**: Minimize object creation in hot paths

```javascript
// Good: Reuse objects
class ProcessorPool {
  constructor(size = 5) {
    this.processors = Array(size).fill(null).map(() => new StringArrayProcessor());
    this.available = [...this.processors];
  }
  
  acquire() {
    return this.available.pop() || new StringArrayProcessor();
  }
  
  release(processor) {
    processor.reset();
    this.available.push(processor);
  }
}

// Bad: Create new objects repeatedly
function processMultipleFiles(files) {
  return files.map(file => {
    const processor = new StringArrayProcessor(); // New object each time
    return processor.process(file.content);
  });
}
```

### 2. Asynchronous Processing
- **Non-blocking**: Use async/await for I/O operations
- **Concurrency**: Process multiple files in parallel when possible
- **Backpressure**: Handle overload gracefully
- **Timeouts**: Set reasonable timeouts for operations

```javascript
// Good: Parallel processing with concurrency control
async function processBatch(files, maxConcurrency = 3) {
  const semaphore = new Semaphore(maxConcurrency);
  
  const promises = files.map(async (file) => {
    await semaphore.acquire();
    try {
      return await processFile(file);
    } finally {
      semaphore.release();
    }
  });
  
  return Promise.all(promises);
}
```

### 3. Caching Strategy
- **Result Caching**: Cache processing results for identical inputs
- **AST Caching**: Cache parsed ASTs for reuse
- **Smart Invalidation**: Invalidate cache when options change
- **Memory Limits**: Implement cache size limits

```javascript
class CachedProcessor {
  constructor() {
    this.cache = new LRUCache({ max: 100, ttl: 1000 * 60 * 10 }); // 10 minutes
  }
  
  async process(code, options = {}) {
    const key = this._generateCacheKey(code, options);
    
    if (this.cache.has(key)) {
      return this.cache.get(key);
    }
    
    const result = await this._actualProcess(code, options);
    this.cache.set(key, result);
    return result;
  }
}
```

## Security Standards

### 1. Input Validation
- **Sanitization**: Sanitize all user inputs
- **Size Limits**: Enforce reasonable size limits
- **Type Checking**: Validate data types
- **Injection Prevention**: Prevent code injection attacks

```javascript
function validateCodeInput(code) {
  // Type validation
  if (typeof code !== 'string') {
    throw new ValidationError('Code must be a string');
  }
  
  // Size validation
  if (code.length > MAX_CODE_SIZE) {
    throw new ValidationError('Code exceeds maximum size limit');
  }
  
  // Content validation
  if (containsMaliciousPatterns(code)) {
    throw new SecurityError('Code contains potentially malicious patterns');
  }
  
  return sanitizeCode(code);
}
```

### 2. Error Information
- **No Sensitive Data**: Never expose sensitive information in errors
- **Sanitized Messages**: Provide helpful but safe error messages
- **Logging**: Log detailed errors internally, return generic messages to clients

```javascript
// Good: Safe error handling
try {
  const result = await processor.process(code);
  return result;
} catch (error) {
  // Log detailed error internally
  logger.error('Processing failed', { 
    error: error.message, 
    stack: error.stack,
    userId: req.user?.id 
  });
  
  // Return sanitized error to client
  return {
    success: false,
    error: {
      code: 'PROCESSING_FAILED',
      message: 'Unable to process the provided code'
    }
  };
}
```

### 3. Resource Limits
- **Processing Timeouts**: Prevent infinite loops
- **Memory Limits**: Prevent memory exhaustion
- **Rate Limiting**: Prevent abuse
- **Resource Monitoring**: Monitor and alert on resource usage

## Error Handling

### 1. Error Hierarchy
```javascript
class DetoxToolError extends Error {
  constructor(message, code, details) {
    super(message);
    this.name = this.constructor.name;
    this.code = code;
    this.details = details;
  }
}

class ValidationError extends DetoxToolError {}
class ProcessingError extends DetoxToolError {}
class SecurityError extends DetoxToolError {}
class ResourceError extends DetoxToolError {}
```

### 2. Error Recovery
- **Graceful Degradation**: Provide fallback mechanisms
- **Partial Results**: Return partial results when possible
- **Retry Logic**: Implement intelligent retry mechanisms
- **Circuit Breaker**: Prevent cascading failures

```javascript
class ResilientProcessor {
  constructor() {
    this.circuitBreaker = new CircuitBreaker();
    this.retryPolicy = new RetryPolicy({ maxAttempts: 3 });
  }
  
  async process(code, options = {}) {
    return this.retryPolicy.execute(async () => {
      return this.circuitBreaker.execute(async () => {
        try {
          return await this._processWithTimeout(code, options);
        } catch (error) {
          if (error instanceof ProcessingError) {
            // Try fallback processor
            return this._fallbackProcess(code, options);
          }
          throw error;
        }
      });
    });
  }
}
```

## Anti-Patterns to Avoid

### 1. God Objects/Monster Classes
```javascript
// Bad: God class doing everything
class EverythingProcessor {
  parseCode() { /* ... */ }
  detectPatterns() { /* ... */ }
  analyzeComplexity() { /* ... */ }
  generateReport() { /* ... */ }
  sendNotifications() { /* ... */ }
  logResults() { /* ... */ }
  // ... 50 more methods
}

// Good: Focused, single-responsibility classes
class CodeParser { /* parsing logic only */ }
class PatternDetector { /* pattern detection only */ }
class ComplexityAnalyzer { /* complexity analysis only */ }
```

### 2. Spaghetti Code
```javascript
// Bad: Deeply nested, hard to follow
function processCode(code) {
  if (code) {
    if (code.length > 0) {
      if (isValid(code)) {
        if (hasPatterns(code)) {
          // ... deeply nested logic
        }
      }
    }
  }
}

// Good: Early returns, clear flow
function processCode(code) {
  if (!code || code.length === 0) {
    throw new ValidationError('Code is required');
  }
  
  if (!isValid(code)) {
    throw new ValidationError('Code is not valid JavaScript');
  }
  
  if (!hasPatterns(code)) {
    return { code, processed: false };
  }
  
  return processPatterns(code);
}
```

### 3. Tight Coupling
```javascript
// Bad: Tightly coupled
class ProcessorA {
  process(code) {
    const processorB = new ProcessorB();
    const result = processorB.specificMethod(code);
    // Direct dependency on ProcessorB's implementation
  }
}

// Good: Loose coupling with dependency injection
class ProcessorA {
  constructor(dependency) {
    this.dependency = dependency;
  }
  
  process(code) {
    return this.dependency.process(code);
  }
}
```

### 4. Magic Numbers and Strings
```javascript
// Bad: Magic numbers
if (complexity > 10) {
  logger.warn('High complexity detected');
}

// Good: Named constants
const COMPLEXITY_THRESHOLD = 10;
const COMPLEXITY_WARNING = 'High complexity detected';

if (complexity > COMPLEXITY_THRESHOLD) {
  logger.warn(COMPLEXITY_WARNING);
}
```

## Code Quality Metrics

### 1. Complexity Metrics
- **Cyclomatic Complexity**: ≤ 10 per function
- **Cognitive Complexity**: ≤ 15 per function
- **Nesting Depth**: ≤ 4 levels
- **Function Length**: ≤ 50 lines

### 2. Quality Gates
- **Code Coverage**: ≥ 80%
- **Duplication**: ≤ 3%
- **Technical Debt**: ≤ 5% of total effort
- **Maintainability Index**: ≥ 70

### 3. Code Review Checklist
- [ ] Single Responsibility Principle followed
- [ ] Functions are small and focused
- [ ] Error handling is comprehensive
- [ ] Tests cover critical paths
- [ ] Documentation is complete
- [ ] Performance considerations addressed
- [ ] Security implications reviewed
- [ ] No code duplication
- [ ] Naming is clear and descriptive
- [ ] Dependencies are minimal and justified

## Implementation Guidelines

### 1. Development Workflow
1. **Design**: Create design document before coding
2. **Test-First**: Write tests before implementation
3. **Small Commits**: Make frequent, focused commits
4. **Code Review**: All code must be reviewed
5. **Documentation**: Update docs with code changes

### 2. Performance Monitoring
- **Metrics Collection**: Track processing times, memory usage
- **Alerting**: Set up alerts for performance degradation
- **Profiling**: Regular performance profiling
- **Optimization**: Continuous optimization based on metrics

### 3. Continuous Improvement
- **Regular Refactoring**: Scheduled refactoring sessions
- **Pattern Updates**: Evolve patterns based on learnings
- **Tool Updates**: Keep tools and dependencies current
- **Knowledge Sharing**: Regular architecture reviews

For implementation details and project structure, see [PROJECT_STRUCTURE.md](PROJECT_STRUCTURE.md) and [API_REFERENCE.md](API_REFERENCE.md).