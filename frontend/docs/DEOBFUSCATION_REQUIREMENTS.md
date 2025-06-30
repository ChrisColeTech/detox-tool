# Detox Tool - Deobfuscation Requirements

## 📋 Core Requirements

### What the Code Will Do

#### 1. **Pattern Detection & Analysis**
- **Input**: Obfuscated JavaScript code from LM Studio or other sources
- **Output**: Confidence-scored analysis of obfuscation type and patterns
- **Capability**: Identify specific obfuscation techniques used

#### 2. **Multi-Engine Deobfuscation**
- **Heavy Obfuscation Engine**: Handle complex patterns like hex variables, string arrays
- **Webpack Bundle Engine**: Specialized for webpack-minified code
- **Generic Formatting Engine**: Fallback for unknown patterns
- **Beautification Engine**: Clean formatting and readability improvement

#### 3. **React Component Reconstruction**
- **Component Extraction**: Identify React components within bundles
- **Structure Recreation**: Rebuild original folder structure where possible
- **JSX Reconstruction**: Convert minified JSX back to readable format
- **Import/Export Analysis**: Rebuild module dependencies

#### 4. **Source Map Integration**
- **Source Map Processing**: Use existing source maps when available
- **Mapping Reconstruction**: Attempt to recreate mappings for unmapped code
- **Original Name Recovery**: Restore original variable and function names

## 🔍 Pattern Identification Methods

Based on our analysis of `/mnt/c/Projects/LM Studio/resources/app/.webpack/main/index_beautified.js`, we identified these patterns:

### 1. **Heavy Obfuscation Patterns**
```javascript
// Pattern: Hex variable names
_0x44fd60, _0x1a2b3c, _0x5e7f8g

// Pattern: String arrays with decoders
const _0x1234 = ['encoded', 'string', 'array'];
const _0x5678 = function(_0xabc, _0xdef) {
    return _0x1234[_0xabc - 0x123];
};

// Pattern: Control flow obfuscation
if (!![] && !![]) { /* obfuscated logic */ }

// Pattern: Property access obfuscation
obj['property'] instead of obj.property
```

**Detection Strategy**:
- Regex patterns for hex variable naming: `/_0x[a-fA-F0-9]+/g`
- Count ratio of bracket notation vs dot notation
- Analyze string array density
- Check for boolean obfuscation patterns

### 2. **Webpack Bundle Patterns**
```javascript
// Pattern: Webpack runtime
__webpack_require__, webpackJsonp, webpackChunkName

// Pattern: Module definitions
(function(modules) { /* webpack bootstrap */ })

// Pattern: Dynamic imports
__webpack_require__.e(chunkId).then(__webpack_require__.bind(null, moduleId))

// Pattern: Hot module replacement
if (module.hot) { module.hot.accept(); }
```

**Detection Strategy**:
- Search for webpack-specific identifiers
- Analyze module wrapper patterns
- Identify chunk loading mechanisms
- Detect HMR patterns

### 3. **React Component Patterns**
```javascript
// Pattern: React.createElement calls
React.createElement('div', {className: 'component'}, children)

// Pattern: JSX transformation remnants
/*#__PURE__*/React.createElement

// Pattern: Component definitions
function Component(props) { return React.createElement(...) }

// Pattern: Hook usage
React.useState, React.useEffect, React.useMemo
```

**Detection Strategy**:
- Search for React API calls
- Identify component creation patterns
- Analyze hook usage patterns
- Detect JSX compilation artifacts

## 🛠️ Deobfuscation Methods

### 1. **String Array Deobfuscation**
```javascript
// Method: Extract string arrays and decoders
function extractStringArrays(code) {
    // Find array definitions: const _0x1234 = ['str1', 'str2']
    // Find decoder functions: function _0x5678(_0xabc, _0xdef)
    // Build mapping table: index -> decoded string
    // Replace all decoder calls with actual strings
}
```

### 2. **Variable Name Recovery**
```javascript
// Method: Intelligent variable renaming
function recoverVariableNames(code) {
    // Analyze variable usage patterns
    // Apply semantic naming based on context
    // Use React naming conventions where applicable
    // Preserve original names from source maps when available
}
```

### 3. **Control Flow Deobfuscation**
```javascript
// Method: Simplify obfuscated conditionals
function simplifyControlFlow(code) {
    // Replace !![] with true
    // Replace ![] with false
    // Simplify redundant conditional logic
    // Unwrap unnecessary closures
}
```

### 4. **Property Access Normalization**
```javascript
// Method: Convert bracket to dot notation
function normalizePropertyAccess(code) {
    // obj['property'] -> obj.property (when safe)
    // Preserve bracket notation for dynamic keys
    // Handle computed property names correctly
}
```

### 5. **React Component Reconstruction**
```javascript
// Method: Rebuild JSX from createElement calls
function reconstructJSX(code) {
    // Parse React.createElement calls
    // Convert to JSX syntax
    // Rebuild component hierarchy
    // Restore prop destructuring patterns
}
```

### 6. **Module Structure Reconstruction**
```javascript
// Method: Rebuild ES6 modules from webpack bundles
function reconstructModules(code) {
    // Extract module definitions from webpack runtime
    // Identify import/export patterns
    // Rebuild file structure based on module paths
    // Generate separate files for each module
}
```

## 🔄 Processing Pipeline

### Stage 1: **Analysis**
1. **Input Validation**: Verify JavaScript syntax
2. **Pattern Detection**: Run all detection algorithms
3. **Confidence Scoring**: Rate each pattern's confidence level
4. **Engine Selection**: Choose appropriate deobfuscation strategy

### Stage 2: **Preprocessing**
1. **Code Parsing**: Build AST using Babel/Acorn
2. **Dependency Analysis**: Map variable and function relationships
3. **Scope Analysis**: Understand variable scoping
4. **Reference Tracking**: Track all variable references

### Stage 3: **Deobfuscation**
1. **String Array Processing**: Decode obfuscated strings first
2. **Variable Renaming**: Apply intelligent naming
3. **Control Flow Simplification**: Clean up logic
4. **Property Access Normalization**: Improve readability

### Stage 4: **Reconstruction**
1. **Component Extraction**: Identify React components
2. **Module Separation**: Split into logical files
3. **Structure Rebuilding**: Recreate folder hierarchy
4. **Import/Export Generation**: Rebuild module dependencies

### Stage 5: **Beautification**
1. **Code Formatting**: Apply consistent style
2. **Comment Insertion**: Add helpful comments
3. **Documentation Generation**: Create README files
4. **Final Validation**: Ensure code correctness

## 📊 Success Criteria

### 1. **Pattern Detection Accuracy**
- **Heavy Obfuscation**: 90%+ detection rate
- **Webpack Bundles**: 95%+ detection rate
- **React Components**: 85%+ detection rate
- **False Positives**: <5%

### 2. **Deobfuscation Quality**
- **String Recovery**: 100% success rate
- **Variable Naming**: 80%+ meaningful names
- **Control Flow**: 95%+ simplification success
- **Syntax Correctness**: 100% valid JavaScript output

### 3. **React Reconstruction**
- **Component Identification**: 90%+ accuracy
- **JSX Conversion**: 85%+ readable output
- **Hook Preservation**: 95%+ correct patterns
- **Prop Flow**: 80%+ accurate prop handling

### 4. **Performance Requirements**
- **Small Files** (<100KB): Process in <2 seconds
- **Medium Files** (100KB-1MB): Process in <10 seconds
- **Large Files** (1MB-10MB): Process in <30 seconds
- **Memory Usage**: <500MB for 10MB input

## 🧪 Testing Strategy

### 1. **Real Code Testing**
- **LM Studio Samples**: Use actual obfuscated files
- **Known Patterns**: Test with documented obfuscation types
- **Edge Cases**: Handle malformed or partially obfuscated code
- **Regression Testing**: Ensure fixes don't break existing functionality

### 2. **Validation Methods**
- **Syntax Validation**: Ensure output is valid JavaScript
- **Functionality Testing**: Compare behavior of original vs deobfuscated
- **Manual Review**: Human verification of critical components
- **Automated Metrics**: Measure readability improvements

### 3. **Performance Testing**
- **Load Testing**: Process large files efficiently
- **Memory Profiling**: Monitor memory usage patterns
- **Concurrency Testing**: Handle multiple files simultaneously
- **Error Handling**: Graceful failure on problematic inputs

## 🔧 Implementation Priorities

### Phase 1: **Core Engine** (Week 1-2)
1. ✅ Project structure and shell
2. 🔄 Pattern detection algorithms
3. 🔄 String array deobfuscation
4. 🔄 Basic variable renaming

### Phase 2: **Advanced Features** (Week 3-4)
1. 🔄 React component detection
2. 🔄 JSX reconstruction
3. 🔄 Module structure rebuilding
4. 🔄 Source map integration

### Phase 3: **Polish & Performance** (Week 5-6)
1. 🔄 Performance optimization
2. 🔄 Error handling improvements
3. 🔄 User interface enhancements
4. 🔄 Comprehensive testing

### Phase 4: **Advanced Capabilities** (Week 7-8)
1. 🔄 Machine learning pattern recognition
2. 🔄 Custom obfuscation handling
3. 🔄 Batch processing capabilities
4. 🔄 Export format options

## 📝 Technical Implementation Notes

### Libraries & Tools
- **AST Parsing**: Babel (@babel/parser, @babel/traverse, @babel/generator)
- **Fallback Parsing**: Acorn, Esprima
- **Code Formatting**: Prettier, js-beautify
- **Pattern Matching**: Custom regex patterns + AST analysis
- **File Processing**: Node.js fs/promises
- **UI Integration**: Monaco Editor for code display

### Data Structures
- **Pattern Registry**: Map<PatternType, DetectionFunction>
- **Confidence Scores**: WeightedResult<PatternType, number>
- **Deobfuscation Context**: StateObject with variable mappings
- **Module Graph**: DirectedGraph<ModuleId, Dependencies>

This comprehensive approach ensures we can handle the complex obfuscation patterns found in LM Studio and similar applications while providing meaningful, readable output that helps reverse engineering efforts.