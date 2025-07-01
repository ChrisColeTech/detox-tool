/**
 * Dead Code Processor
 * Eliminates dead code and unreachable statements including unused variables,
 * unreachable code blocks, unused functions, and redundant expressions
 * 
 * @author Detox-Tool Development Team
 * @phase Phase 3 - Control Flow Deobfuscation
 * @version 1.0.0
 */

const { parse } = require('@babel/parser');
const traverse = require('@babel/traverse').default;
const generate = require('@babel/generator').default;
const t = require('@babel/types');

class DeadCodeProcessor {
    constructor(options = {}) {
        this.options = {
            // Dead code elimination options
            removeUnusedVariables: options.removeUnusedVariables !== false,
            removeUnusedFunctions: options.removeUnusedFunctions !== false,
            removeUnreachableCode: options.removeUnreachableCode !== false,
            removeRedundantExpressions: options.removeRedundantExpressions !== false,
            removeEmptyBlocks: options.removeEmptyBlocks !== false,
            removeUnusedImports: options.removeUnusedImports !== false,
            
            // Analysis options
            trackVariableUsage: options.trackVariableUsage !== false,
            analyzeControlFlow: options.analyzeControlFlow !== false,
            detectSideEffects: options.detectSideEffects !== false,
            
            // Safety options
            preserveFunctionDeclarations: options.preserveFunctionDeclarations || false,
            preserveExports: options.preserveExports !== false,
            preserveConsoleStatements: options.preserveConsoleStatements || false,
            maxIterations: options.maxIterations || 5,
            
            ...options
        };
        
        // Processing statistics
        this.statistics = {
            unusedVariablesRemoved: 0,
            unusedFunctionsRemoved: 0,
            unreachableCodeBlocksRemoved: 0,
            redundantExpressionsRemoved: 0,
            emptyBlocksRemoved: 0,
            unusedImportsRemoved: 0,
            totalBytesReduced: 0
        };
        
        // Usage tracking
        this.usageTracker = {
            variables: new Map(),
            functions: new Map(),
            imports: new Map(),
            exports: new Set()
        };
        
        // Control flow analysis
        this.reachabilityMap = new Map();
        this.sideEffectAnalysis = new Map();
    }

    /**
     * Process code for dead code elimination
     * @param {string} code - JavaScript code to process
     * @param {Object} options - Processing options
     * @returns {Object} Processing result with cleaned code and metadata
     */
    async process(code, options = {}) {
        const processingOptions = { ...this.options, ...options };
        const result = {
            success: false,
            deobfuscatedCode: code,
            originalCode: code,
            statistics: { ...this.statistics },
            metadata: {
                deadCodeFound: [],
                eliminationsApplied: [],
                warnings: [],
                processingTime: 0,
                iterations: 0
            }
        };

        const startTime = Date.now();
        const originalSize = code.length;

        try {
            // Reset processing state
            this._resetProcessingState();

            // Parse the code
            let ast = parse(code, {
                sourceType: 'module',
                allowImportExportEverywhere: true,
                allowReturnOutsideFunction: true,
                plugins: ['jsx', 'typescript']
            });

            // Iterative dead code elimination
            let iteration = 0;
            let changed = true;
            
            while (changed && iteration < processingOptions.maxIterations) {
                iteration++;
                changed = false;
                result.metadata.iterations = iteration;

                // Build usage maps
                if (processingOptions.trackVariableUsage) {
                    this._buildUsageMaps(ast);
                }

                // Analyze control flow reachability
                if (processingOptions.analyzeControlFlow) {
                    this._analyzeReachability(ast);
                }

                // Detect side effects
                if (processingOptions.detectSideEffects) {
                    this._analyzeSideEffects(ast);
                }

                // Apply dead code elimination transformations
                if (processingOptions.removeUnusedVariables) {
                    changed |= this._removeUnusedVariables(ast, result.metadata);
                }

                if (processingOptions.removeUnusedFunctions) {
                    changed |= this._removeUnusedFunctions(ast, result.metadata);
                }

                if (processingOptions.removeUnreachableCode) {
                    changed |= this._removeUnreachableCode(ast, result.metadata);
                }

                if (processingOptions.removeRedundantExpressions) {
                    changed |= this._removeRedundantExpressions(ast, result.metadata);
                }

                if (processingOptions.removeEmptyBlocks) {
                    changed |= this._removeEmptyBlocks(ast, result.metadata);
                }

                if (processingOptions.removeUnusedImports) {
                    changed |= this._removeUnusedImports(ast, result.metadata);
                }

                // Reset usage tracking for next iteration
                this._resetUsageTracking();
            }

            // Generate cleaned code
            const output = generate(ast, {
                compact: false,
                comments: true,
                retainLines: false
            });

            result.deobfuscatedCode = output.code;
            result.success = true;
            result.statistics = { ...this.statistics };
            result.statistics.totalBytesReduced = originalSize - output.code.length;
            result.metadata.processingTime = Date.now() - startTime;

        } catch (error) {
            result.success = false;
            result.error = {
                message: error.message,
                stack: error.stack,
                phase: 'dead-code-elimination'
            };
            result.metadata.warnings.push(`Dead code elimination failed: ${error.message}`);
        }

        return result;
    }

    /**
     * Build usage maps for variables, functions, and imports
     * @private
     */
    _buildUsageMaps(ast) {
        const scope = new Map();
        
        traverse(ast, {
            // Track variable declarations
            VariableDeclarator: (path) => {
                if (t.isIdentifier(path.node.id)) {
                    const name = path.node.id.name;
                    this.usageTracker.variables.set(name, {
                        declared: true,
                        used: false,
                        path: path,
                        hasInitializer: !!path.node.init
                    });
                }
            },

            // Track function declarations
            FunctionDeclaration: (path) => {
                if (path.node.id) {
                    const name = path.node.id.name;
                    this.usageTracker.functions.set(name, {
                        declared: true,
                        used: false,
                        path: path,
                        isExported: this._isExported(path)
                    });
                }
            },

            // Track import declarations
            ImportDeclaration: (path) => {
                for (const specifier of path.node.specifiers) {
                    if (t.isImportSpecifier(specifier) || t.isImportDefaultSpecifier(specifier)) {
                        const name = specifier.local.name;
                        this.usageTracker.imports.set(name, {
                            declared: true,
                            used: false,
                            path: path,
                            source: path.node.source.value
                        });
                    }
                }
            },

            // Track variable and function usage
            ReferencedIdentifier: (path) => {
                const name = path.node.name;
                
                // Mark variable as used
                if (this.usageTracker.variables.has(name)) {
                    const varInfo = this.usageTracker.variables.get(name);
                    varInfo.used = true;
                    this.usageTracker.variables.set(name, varInfo);
                }
                
                // Mark function as used
                if (this.usageTracker.functions.has(name)) {
                    const funcInfo = this.usageTracker.functions.get(name);
                    funcInfo.used = true;
                    this.usageTracker.functions.set(name, funcInfo);
                }
                
                // Mark import as used
                if (this.usageTracker.imports.has(name)) {
                    const importInfo = this.usageTracker.imports.get(name);
                    importInfo.used = true;
                    this.usageTracker.imports.set(name, importInfo);
                }
            },

            // Track exports
            ExportDeclaration: (path) => {
                if (t.isExportNamedDeclaration(path.node) && path.node.declaration) {
                    if (t.isFunctionDeclaration(path.node.declaration) && path.node.declaration.id) {
                        this.usageTracker.exports.add(path.node.declaration.id.name);
                    } else if (t.isVariableDeclaration(path.node.declaration)) {
                        for (const declarator of path.node.declaration.declarations) {
                            if (t.isIdentifier(declarator.id)) {
                                this.usageTracker.exports.add(declarator.id.name);
                            }
                        }
                    }
                }
            }
        });
    }

    /**
     * Analyze reachability of code blocks
     * @private
     */
    _analyzeReachability(ast) {
        traverse(ast, {
            // Analyze blocks after control flow statements
            'ReturnStatement|ThrowStatement|BreakStatement|ContinueStatement': (path) => {
                const parent = path.parent;
                if (t.isBlockStatement(parent)) {
                    const statements = parent.body;
                    const currentIndex = statements.indexOf(path.node);
                    
                    // Mark subsequent statements as unreachable
                    for (let i = currentIndex + 1; i < statements.length; i++) {
                        this.reachabilityMap.set(statements[i], false);
                    }
                }
            },

            // Analyze conditional statements
            IfStatement: (path) => {
                const test = path.node.test;
                
                // If condition is always false, consequent is unreachable
                if (t.isBooleanLiteral(test) && test.value === false) {
                    this.reachabilityMap.set(path.node.consequent, false);
                }
                
                // If condition is always true, alternate is unreachable
                if (t.isBooleanLiteral(test) && test.value === true && path.node.alternate) {
                    this.reachabilityMap.set(path.node.alternate, false);
                }
            }
        });
    }

    /**
     * Analyze side effects in expressions and statements
     * @private
     */
    _analyzeSideEffects(ast) {
        traverse(ast, {
            // Expressions with potential side effects
            CallExpression: (path) => {
                this.sideEffectAnalysis.set(path.node, true);
            },
            
            NewExpression: (path) => {
                this.sideEffectAnalysis.set(path.node, true);
            },
            
            AssignmentExpression: (path) => {
                this.sideEffectAnalysis.set(path.node, true);
            },
            
            UpdateExpression: (path) => {
                this.sideEffectAnalysis.set(path.node, true);
            },

            // Member expressions that might have getters/setters
            MemberExpression: (path) => {
                if (path.isReferencedIdentifier()) {
                    this.sideEffectAnalysis.set(path.node, true);
                }
            }
        });
    }

    /**
     * Remove unused variables
     * @private
     */
    _removeUnusedVariables(ast, metadata) {
        let changed = false;
        const removals = [];

        for (const [name, info] of this.usageTracker.variables) {
            if (!info.used && !this.usageTracker.exports.has(name)) {
                // Check if variable has side effects in initializer
                if (info.hasInitializer && this._hasInitializerSideEffects(info.path.node.init)) {
                    continue; // Keep variables with side-effect initializers
                }

                try {
                    info.path.remove();
                    removals.push(`variable '${name}'`);
                    this.statistics.unusedVariablesRemoved++;
                    changed = true;
                } catch (error) {
                    metadata.warnings.push(`Failed to remove unused variable '${name}': ${error.message}`);
                }
            }
        }

        if (removals.length > 0) {
            metadata.eliminationsApplied.push(`Removed unused variables: ${removals.join(', ')}`);
        }

        return changed;
    }

    /**
     * Remove unused functions
     * @private
     */
    _removeUnusedFunctions(ast, metadata) {
        let changed = false;
        const removals = [];

        for (const [name, info] of this.usageTracker.functions) {
            if (!info.used && !info.isExported && !this.usageTracker.exports.has(name)) {
                if (this.options.preserveFunctionDeclarations) {
                    continue; // Skip if preservation is enabled
                }

                try {
                    info.path.remove();
                    removals.push(`function '${name}'`);
                    this.statistics.unusedFunctionsRemoved++;
                    changed = true;
                } catch (error) {
                    metadata.warnings.push(`Failed to remove unused function '${name}': ${error.message}`);
                }
            }
        }

        if (removals.length > 0) {
            metadata.eliminationsApplied.push(`Removed unused functions: ${removals.join(', ')}`);
        }

        return changed;
    }

    /**
     * Remove unreachable code
     * @private
     */
    _removeUnreachableCode(ast, metadata) {
        let changed = false;
        const removals = [];

        for (const [node, isReachable] of this.reachabilityMap) {
            if (!isReachable) {
                try {
                    // Find the path for this node and remove it
                    traverse(ast, {
                        enter(path) {
                            if (path.node === node) {
                                path.remove();
                                removals.push('unreachable block');
                                changed = true;
                                path.stop();
                            }
                        }
                    });
                    this.statistics.unreachableCodeBlocksRemoved++;
                } catch (error) {
                    metadata.warnings.push(`Failed to remove unreachable code: ${error.message}`);
                }
            }
        }

        if (removals.length > 0) {
            metadata.eliminationsApplied.push(`Removed ${removals.length} unreachable code blocks`);
        }

        return changed;
    }

    /**
     * Remove redundant expressions
     * @private
     */
    _removeRedundantExpressions(ast, metadata) {
        let changed = false;
        const removals = [];

        traverse(ast, {
            // Remove expressions with no side effects used as statements
            ExpressionStatement: (path) => {
                const expr = path.node.expression;
                
                // Skip if expression has side effects
                if (this.sideEffectAnalysis.has(expr)) {
                    return;
                }
                
                // Remove redundant expressions like standalone literals, identifiers
                if (t.isLiteral(expr) || (t.isIdentifier(expr) && !this.sideEffectAnalysis.has(expr))) {
                    path.remove();
                    removals.push('redundant expression');
                    this.statistics.redundantExpressionsRemoved++;
                    changed = true;
                }
            },

            // Simplify boolean expressions
            BinaryExpression: (path) => {
                const { left, right, operator } = path.node;
                
                // Simplify true && expr -> expr
                if (operator === '&&' && t.isBooleanLiteral(left) && left.value === true) {
                    path.replaceWith(right);
                    removals.push('simplified boolean AND');
                    changed = true;
                }
                
                // Simplify false || expr -> expr
                if (operator === '||' && t.isBooleanLiteral(left) && left.value === false) {
                    path.replaceWith(right);
                    removals.push('simplified boolean OR');
                    changed = true;
                }
            }
        });

        if (removals.length > 0) {
            metadata.eliminationsApplied.push(`Removed ${removals.length} redundant expressions`);
        }

        return changed;
    }

    /**
     * Remove empty blocks
     * @private
     */
    _removeEmptyBlocks(ast, metadata) {
        let changed = false;
        const removals = [];

        traverse(ast, {
            BlockStatement: (path) => {
                if (path.node.body.length === 0) {
                    // Don't remove function bodies or try/catch blocks
                    const parent = path.parent;
                    if (t.isFunction(parent) || t.isTryStatement(parent) || t.isCatchClause(parent)) {
                        return;
                    }

                    path.remove();
                    removals.push('empty block');
                    this.statistics.emptyBlocksRemoved++;
                    changed = true;
                }
            }
        });

        if (removals.length > 0) {
            metadata.eliminationsApplied.push(`Removed ${removals.length} empty blocks`);
        }

        return changed;
    }

    /**
     * Remove unused imports
     * @private
     */
    _removeUnusedImports(ast, metadata) {
        let changed = false;
        const removals = [];

        for (const [name, info] of this.usageTracker.imports) {
            if (!info.used) {
                try {
                    // Remove the entire import declaration if it only has this specifier
                    const importDecl = info.path.node;
                    if (importDecl.specifiers.length === 1) {
                        info.path.remove();
                        removals.push(`import from '${info.source}'`);
                    } else {
                        // Remove just this specifier
                        const specifierIndex = importDecl.specifiers.findIndex(spec => 
                            spec.local && spec.local.name === name
                        );
                        if (specifierIndex !== -1) {
                            importDecl.specifiers.splice(specifierIndex, 1);
                            removals.push(`import '${name}' from '${info.source}'`);
                        }
                    }
                    this.statistics.unusedImportsRemoved++;
                    changed = true;
                } catch (error) {
                    metadata.warnings.push(`Failed to remove unused import '${name}': ${error.message}`);
                }
            }
        }

        if (removals.length > 0) {
            metadata.eliminationsApplied.push(`Removed unused imports: ${removals.join(', ')}`);
        }

        return changed;
    }

    /**
     * Check if initializer has side effects
     * @private
     */
    _hasInitializerSideEffects(init) {
        if (!init) return false;
        
        // Check common side-effect patterns
        return t.isCallExpression(init) || 
               t.isNewExpression(init) || 
               t.isAwaitExpression(init) ||
               this.sideEffectAnalysis.has(init);
    }

    /**
     * Check if function is exported
     * @private
     */
    _isExported(path) {
        let current = path;
        while (current) {
            if (t.isExportDeclaration(current.parent)) {
                return true;
            }
            current = current.parentPath;
        }
        return false;
    }

    /**
     * Reset processing state
     * @private
     */
    _resetProcessingState() {
        this._resetUsageTracking();
        this.reachabilityMap.clear();
        this.sideEffectAnalysis.clear();
        this.statistics = {
            unusedVariablesRemoved: 0,
            unusedFunctionsRemoved: 0,
            unreachableCodeBlocksRemoved: 0,
            redundantExpressionsRemoved: 0,
            emptyBlocksRemoved: 0,
            unusedImportsRemoved: 0,
            totalBytesReduced: 0
        };
    }

    /**
     * Reset usage tracking
     * @private
     */
    _resetUsageTracking() {
        this.usageTracker.variables.clear();
        this.usageTracker.functions.clear();
        this.usageTracker.imports.clear();
        this.usageTracker.exports.clear();
    }

    /**
     * Get processing statistics
     * @returns {Object} Current processing statistics
     */
    getStatistics() {
        return { ...this.statistics };
    }

    /**
     * Get component status and capabilities
     * @returns {Object} Status information
     */
    getStatus() {
        return {
            implemented: true,
            phase: "Phase 3",
            version: "1.0.0",
            capabilities: [
                'unused-variable-removal',
                'unused-function-removal',
                'unreachable-code-elimination',
                'redundant-expression-removal',
                'empty-block-removal',
                'unused-import-removal',
                'side-effect-analysis',
                'reachability-analysis'
            ],
            description: "Eliminates dead code and unreachable statements",
            statistics: this.getStatistics()
        };
    }

    /**
     * Reset component state
     */
    reset() {
        this._resetProcessingState();
    }
}

module.exports = DeadCodeProcessor;
