/**
 * Variable Name Recovery System
 * Implements intelligent variable renaming to convert hex variables (_0x123abc) 
 * into meaningful, readable names based on context analysis
 */

const { parse } = require('@babel/parser');
const traverse = require('@babel/traverse').default;
const generate = require('@babel/generator').default;

class VariableNameRecovery {
    constructor() {
        this.hexVariables = new Map(); // Variable name -> analysis data
        this.variableMappings = new Map(); // Old name -> new name
        this.usageContext = new Map(); // Variable -> usage analysis
        this.scopeAnalysis = new Map(); // Variable -> scope information
        this.nameConflicts = new Set(); // Track naming conflicts
        this.reservedNames = new Set([
            // JavaScript reserved words
            'break', 'case', 'catch', 'class', 'const', 'continue', 'debugger', 'default',
            'delete', 'do', 'else', 'export', 'extends', 'finally', 'for', 'function',
            'if', 'import', 'in', 'instanceof', 'let', 'new', 'return', 'super', 'switch',
            'this', 'throw', 'try', 'typeof', 'var', 'void', 'while', 'with', 'yield',
            // Common global objects
            'window', 'document', 'console', 'Array', 'Object', 'String', 'Number',
            'Boolean', 'Date', 'RegExp', 'Error', 'Math', 'JSON', 'Promise',
            // React specific
            'React', 'Component', 'useState', 'useEffect', 'props', 'state', 'render'
        ]);
        
        // Naming strategies for different contexts
        this.namingStrategies = {
            function: ['handler', 'callback', 'fn', 'func', 'method'],
            variable: ['data', 'value', 'item', 'element', 'obj'],
            parameter: ['arg', 'param', 'input', 'val'],
            array: ['list', 'items', 'collection', 'array'],
            object: ['config', 'options', 'props', 'state'],
            string: ['text', 'str', 'message', 'content'],
            number: ['count', 'index', 'num', 'size'],
            boolean: ['flag', 'isValid', 'enabled', 'active'],
            event: ['event', 'evt', 'e'],
            element: ['el', 'element', 'node'],
            component: ['Component', 'Widget', 'View']
        };
    }

    /**
     * Main processing method - analyzes and recovers variable names
     * @param {string} code - JavaScript code to process
     * @param {Object} options - Processing options
     * @returns {Object} Processing result with renamed variables
     */
    process(code, options = {}) {
        try {
            // Step 1: Parse the code into an AST
            const ast = this._parseCode(code);
            
            // Step 2: Analyze hex variables and their usage
            const hexVariables = this.analyzeVariables(code, ast);
            
            // Step 3: Determine context for each variable
            const contextAnalysis = this.analyzeContext(ast);
            
            // Step 4: Generate semantic names
            const nameMappings = this.generateSemanticNames(hexVariables, contextAnalysis);
            
            // Step 5: Replace variables throughout the code
            const renamedCode = this.replaceVariables(code, ast, nameMappings);
            
            return {
                success: true,
                originalCode: code,
                renamedCode: renamedCode,
                hexVariables: Array.from(hexVariables.entries()),
                nameMappings: Array.from(nameMappings.entries()),
                statistics: {
                    hexVariablesFound: hexVariables.size,
                    variablesRenamed: nameMappings.size,
                    meaningfulNamesGenerated: this._countMeaningfulNames(nameMappings),
                    codeReduction: ((code.length - renamedCode.length) / code.length * 100).toFixed(2) + '%'
                }
            };
        } catch (error) {
            return {
                success: false,
                error: error.message,
                originalCode: code,
                renamedCode: code // Return original on failure
            };
        }
    }

    /**
     * Analyze variables to find hex patterns and collect basic information
     * @param {string} code - JavaScript code
     * @param {Object} ast - Parsed AST
     * @returns {Map} Map of variable names to analysis data
     */
    analyzeVariables(code, ast) {
        const hexVariables = new Map();
        
        // Traverse AST to find all variable declarations and usages
        traverse(ast, {
            // Variable declarations
            VariableDeclarator: (path) => {
                const name = path.node.id.name;
                if (this._isHexVariable(name)) {
                    hexVariables.set(name, {
                        name: name,
                        type: 'variable',
                        declaration: path.node,
                        init: path.node.init,
                        scope: path.scope,
                        usages: []
                    });
                }
            },
            
            // Function declarations and expressions
            'FunctionDeclaration|FunctionExpression': (path) => {
                // Handle function name (for declarations)
                const name = path.node.id?.name;
                if (name && this._isHexVariable(name)) {
                    hexVariables.set(name, {
                        name: name,
                        type: 'function',
                        declaration: path.node,
                        params: path.node.params,
                        scope: path.scope,
                        usages: []
                    });
                }
                
                // Handle function parameters
                if (path.node.params) {
                    path.node.params.forEach(param => {
                        if (param.name && this._isHexVariable(param.name)) {
                            hexVariables.set(param.name, {
                                name: param.name,
                                type: 'parameter',
                                declaration: param,
                                scope: path.scope,
                                usages: []
                            });
                        }
                    });
                }
            },
            
            // Identifier references
            Identifier: (path) => {
                const name = path.node.name;
                if (this._isHexVariable(name) && !path.isDeclaration()) {
                    if (hexVariables.has(name)) {
                        hexVariables.get(name).usages.push({
                            path: path,
                            context: this._getUsageContext(path),
                            parent: path.parent
                        });
                    } else {
                        // Variable used but not declared in this scope
                        hexVariables.set(name, {
                            name: name,
                            type: 'reference',
                            declaration: null,
                            scope: path.scope,
                            usages: [{
                                path: path,
                                context: this._getUsageContext(path),
                                parent: path.parent
                            }]
                        });
                    }
                }
            }
        });

        this.hexVariables = hexVariables;
        return hexVariables;
    }

    /**
     * Analyze context and usage patterns for each variable
     * @param {Object} ast - Parsed AST
     * @returns {Map} Context analysis for each variable
     */
    analyzeContext(ast) {
        const contextAnalysis = new Map();
        
        this.hexVariables.forEach((variableData, variableName) => {
            const context = {
                type: variableData.type,
                inferredType: this._inferVariableType(variableData),
                usagePatterns: this._analyzeUsagePatterns(variableData),
                semanticContext: this._getSemanticContext(variableData),
                scope: this._analyzeScopeContext(variableData),
                frequency: variableData.usages.length
            };
            
            contextAnalysis.set(variableName, context);
        });
        
        this.usageContext = contextAnalysis;
        return contextAnalysis;
    }

    /**
     * Generate semantic names based on context analysis
     * @param {Map} hexVariables - Hex variables to rename
     * @param {Map} contextAnalysis - Context analysis results
     * @returns {Map} Mapping from old names to new names
     */
    generateSemanticNames(hexVariables, contextAnalysis) {
        const nameMappings = new Map();
        const usedNames = new Set(this.reservedNames);
        
        // Sort variables by usage frequency (most used first)
        const sortedVariables = Array.from(hexVariables.entries()).sort((a, b) => {
            const aUsages = a[1].usages.length;
            const bUsages = b[1].usages.length;
            return bUsages - aUsages;
        });
        
        for (const [oldName, variableData] of sortedVariables) {
            const context = contextAnalysis.get(oldName);
            const newName = this._generateContextualName(oldName, context, usedNames);
            
            if (newName && newName !== oldName) {
                nameMappings.set(oldName, newName);
                usedNames.add(newName);
            }
        }
        
        this.variableMappings = nameMappings;
        return nameMappings;
    }

    /**
     * Replace variables throughout the code
     * @param {string} code - Original code
     * @param {Object} ast - Parsed AST
     * @param {Map} nameMappings - Variable name mappings
     * @returns {string} Code with renamed variables
     */
    replaceVariables(code, ast, nameMappings) {
        // Create a new AST with renamed variables
        const renamedAst = JSON.parse(JSON.stringify(ast)); // Deep clone
        
        traverse(renamedAst, {
            Identifier: (path) => {
                const oldName = path.node.name;
                if (nameMappings.has(oldName)) {
                    path.node.name = nameMappings.get(oldName);
                }
            }
        });
        
        // Generate code from the modified AST
        const result = generate(renamedAst, {
            retainLines: false,
            compact: false,
            minified: false,
            comments: true
        });
        
        return result.code;
    }

    /**
     * Check if a variable name follows hex obfuscation pattern
     * @private
     */
    _isHexVariable(name) {
        if (!name || typeof name !== 'string') return false;
        
        // Match patterns like _0x123abc, _0x1a2b, etc.
        // Also match patterns like _0xabcd, _0xdef0, _0xfed1, _0xcba9
        return /^_0x[a-fA-F0-9]+$/.test(name) || 
               /^_[a-fA-F0-9]{4,}$/.test(name);
    }

    /**
     * Parse JavaScript code with error handling
     * @private
     */
    _parseCode(code) {
        try {
            return parse(code, {
                sourceType: 'module',
                allowImportExportEverywhere: true,
                allowReturnOutsideFunction: true,
                plugins: [
                    'jsx',
                    'typescript',
                    'decorators-legacy',
                    'functionBind',
                    'exportDefaultFrom',
                    'throwExpressions',
                    'dynamicImport',
                    'objectRestSpread',
                    'asyncGenerators'
                ]
            });
        } catch (error) {
            // Try parsing as script if module parsing fails
            return parse(code, {
                sourceType: 'script',
                allowReturnOutsideFunction: true,
                plugins: ['jsx']
            });
        }
    }

    /**
     * Get usage context for a variable reference
     * @private
     */
    _getUsageContext(path) {
        const parent = path.parent;
        
        if (!parent) return 'unknown';
        
        switch (parent.type) {
            case 'CallExpression':
                return path.node === parent.callee ? 'function_call' : 'argument';
            case 'MemberExpression':
                return path.node === parent.object ? 'object_access' : 'property';
            case 'AssignmentExpression':
                return path.node === parent.left ? 'assignment_target' : 'assignment_value';
            case 'BinaryExpression':
                return 'binary_operation';
            case 'ReturnStatement':
                return 'return_value';
            case 'IfStatement':
                return 'condition';
            case 'ForStatement':
                return 'loop';
            case 'ArrayExpression':
                return 'array_element';
            case 'ObjectExpression':
                return 'object_property';
            default:
                return 'reference';
        }
    }

    /**
     * Infer the type of a variable based on its initialization and usage
     * @private
     */
    _inferVariableType(variableData) {
        // Check initialization value
        if (variableData.init) {
            const init = variableData.init;
            
            switch (init.type) {
                case 'StringLiteral':
                    return 'string';
                case 'NumericLiteral':
                    return 'number';
                case 'BooleanLiteral':
                    return 'boolean';
                case 'ArrayExpression':
                    return 'array';
                case 'ObjectExpression':
                    return 'object';
                case 'FunctionExpression':
                case 'ArrowFunctionExpression':
                    return 'function';
                case 'CallExpression':
                    return this._inferFromCallExpression(init);
                default:
                    return 'unknown';
            }
        }
        
        // Infer from usage patterns
        return this._inferFromUsagePatterns(variableData);
    }

    /**
     * Analyze usage patterns for a variable
     * @private
     */
    _analyzeUsagePatterns(variableData) {
        const patterns = {
            asFunctionCall: 0,
            asObjectAccess: 0,
            asAssignmentTarget: 0,
            asParameter: 0,
            asReturnValue: 0,
            asCondition: 0
        };
        
        variableData.usages.forEach(usage => {
            switch (usage.context) {
                case 'function_call':
                    patterns.asFunctionCall++;
                    break;
                case 'object_access':
                    patterns.asObjectAccess++;
                    break;
                case 'assignment_target':
                    patterns.asAssignmentTarget++;
                    break;
                case 'argument':
                    patterns.asParameter++;
                    break;
                case 'return_value':
                    patterns.asReturnValue++;
                    break;
                case 'condition':
                    patterns.asCondition++;
                    break;
            }
        });
        
        return patterns;
    }

    /**
     * Get semantic context from surrounding code
     * @private
     */
    _getSemanticContext(variableData) {
        const context = {
            isReactRelated: false,
            isDOMRelated: false,
            isEventRelated: false,
            isDataRelated: false,
            isUtilityFunction: false
        };
        
        // Check initialization for React patterns
        if (variableData.init) {
            const initCode = generate(variableData.init).code;
            if (/React\.createElement|jsx/.test(initCode)) {
                context.isReactRelated = true;
            }
        }
        
        // For functions, check the entire function body for React patterns
        if (variableData.type === 'function' && variableData.declaration) {
            const funcCode = generate(variableData.declaration).code;
            if (/React\.createElement|jsx|Component|useState|useEffect/.test(funcCode)) {
                context.isReactRelated = true;
            }
        }
        
        // Analyze based on usage and surrounding code
        variableData.usages.forEach(usage => {
            const parent = usage.parent;
            
            // Check for React patterns
            if (this._isReactContext(parent)) {
                context.isReactRelated = true;
            }
            
            // Check for DOM patterns
            if (this._isDOMContext(parent)) {
                context.isDOMRelated = true;
            }
            
            // Check for event patterns
            if (this._isEventContext(parent)) {
                context.isEventRelated = true;
            }
        });
        
        return context;
    }

    /**
     * Generate a contextual name for a variable
     * @private
     */
    _generateContextualName(oldName, context, usedNames) {
        let baseName = '';
        
        // Determine base name from context
        if (context.type === 'function') {
            baseName = this._getFunctionBaseName(context);
        } else if (context.inferredType) {
            baseName = this._getTypeBaseName(context.inferredType, context);
        } else {
            baseName = this._getGenericBaseName(context);
        }
        
        // Ensure uniqueness
        let finalName = baseName;
        let counter = 1;
        
        while (usedNames.has(finalName) || this.reservedNames.has(finalName)) {
            finalName = `${baseName}${counter}`;
            counter++;
        }
        
        return finalName;
    }

    /**
     * Get base name for functions
     * @private
     */
    _getFunctionBaseName(context) {
        if (context.semanticContext.isReactRelated) {
            // Check if it's likely a React component (returns createElement)
            // Any React-related function should be considered a component
            return 'Component';
        }
        if (context.semanticContext.isDOMRelated) {
            return 'domHandler';
        }
        if (context.semanticContext.isEventRelated) {
            return 'eventHandler';
        }
        
        // Based on usage patterns
        if (context.usagePatterns.asFunctionCall > 0) {
            return 'callback';
        }
        
        return 'func';
    }

    /**
     * Get base name for typed variables
     * @private
     */
    _getTypeBaseName(type, context) {
        const strategies = this.namingStrategies[type] || ['value'];
        
        // Choose based on semantic context
        if (context.semanticContext.isReactRelated) {
            if (type === 'object') return 'props';
            if (type === 'function') return 'component';
        }
        
        if (context.semanticContext.isDOMRelated) {
            if (type === 'object') return 'element';
            if (type === 'string') return 'selector';
        }
        
        return strategies[0];
    }

    /**
     * Get generic base name
     * @private
     */
    _getGenericBaseName(context) {
        if (context.usagePatterns.asObjectAccess > 0) {
            return 'obj';
        }
        if (context.usagePatterns.asFunctionCall > 0) {
            return 'fn';
        }
        if (context.usagePatterns.asParameter > 0) {
            return 'param';
        }
        
        return 'var';
    }

    /**
     * Helper methods for context detection
     * @private
     */
    _isReactContext(node) {
        if (!node) return false;
        
        const code = generate(node).code;
        return /React|Component|jsx|useState|useEffect/.test(code);
    }

    _isDOMContext(node) {
        if (!node) return false;
        
        const code = generate(node).code;
        return /document|window|element|querySelector/.test(code);
    }

    _isEventContext(node) {
        if (!node) return false;
        
        const code = generate(node).code;
        return /event|click|change|submit|load/.test(code);
    }

    _inferFromCallExpression(init) {
        const callee = init.callee;
        if (callee && callee.name) {
            if (/Array|map|filter|reduce/.test(callee.name)) return 'array';
            if (/Object|assign|keys/.test(callee.name)) return 'object';
            if (/String|charAt|substring/.test(callee.name)) return 'string';
            if (/Number|parseInt|parseFloat/.test(callee.name)) return 'number';
        }
        return 'unknown';
    }

    _inferFromUsagePatterns(variableData) {
        const patterns = this._analyzeUsagePatterns(variableData);
        
        if (patterns.asFunctionCall > 0) return 'function';
        if (patterns.asObjectAccess > 0) return 'object';
        if (patterns.asCondition > 0) return 'boolean';
        
        return 'unknown';
    }

    _analyzeScopeContext(variableData) {
        const scope = variableData.scope;
        return {
            type: scope?.type || 'unknown',
            level: this._getScopeLevel(scope),
            isGlobal: scope?.type === 'global'
        };
    }

    _getScopeLevel(scope) {
        let level = 0;
        let current = scope;
        
        while (current && current.parent) {
            level++;
            current = current.parent;
        }
        
        return level;
    }

    _countMeaningfulNames(nameMappings) {
        let meaningful = 0;
        
        nameMappings.forEach((newName, oldName) => {
            // Consider a name meaningful if it's not just a generic placeholder
            if (!/^(var|fn|obj|param)\d*$/.test(newName)) {
                meaningful++;
            }
        });
        
        return meaningful;
    }

    /**
     * Get processing statistics
     * @returns {Object} Statistics about the processing
     */
    getStatistics() {
        return {
            hexVariablesDetected: this.hexVariables.size,
            variableMappingsCreated: this.variableMappings.size,
            contextAnalysisCompleted: this.usageContext.size,
            nameConflictsResolved: this.nameConflicts.size
        };
    }

    /**
     * Reset internal state for new processing
     */
    reset() {
        this.hexVariables.clear();
        this.variableMappings.clear();
        this.usageContext.clear();
        this.scopeAnalysis.clear();
        this.nameConflicts.clear();
    }
}

module.exports = VariableNameRecovery;