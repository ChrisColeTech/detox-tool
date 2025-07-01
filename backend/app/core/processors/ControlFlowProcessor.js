/**
 * Control Flow Processor
 * Detects and simplifies control flow obfuscation patterns including
 * conditional chains, switch statement obfuscation, and goto-style control flow
 * 
 * @author Detox-Tool Development Team
 * @phase Phase 3 - Control Flow Deobfuscation
 * @version 1.0.0
 */

const { parse } = require('@babel/parser');
const traverse = require('@babel/traverse').default;
const generate = require('@babel/generator').default;
const t = require('@babel/types');

class ControlFlowProcessor {
    constructor(options = {}) {
        this.options = {
            // Control flow processing options
            simplifyConditionals: options.simplifyConditionals !== false,
            unwrapSwitchObfuscation: options.unwrapSwitchObfuscation !== false,
            eliminateGotoPatterns: options.eliminateGotoPatterns !== false,
            flattenNestedBlocks: options.flattenNestedBlocks !== false,
            optimizeControlFlow: options.optimizeControlFlow !== false,
            
            // Analysis options
            trackControlFlowPaths: options.trackControlFlowPaths !== false,
            detectControlFlowObfuscation: options.detectControlFlowObfuscation !== false,
            
            // Safety options
            preserveOriginalLogic: options.preserveOriginalLogic !== false,
            maxProcessingDepth: options.maxProcessingDepth || 10,
            
            ...options
        };
        
        // Processing statistics
        this.statistics = {
            conditionalsSimplified: 0,
            switchStatementsUnwrapped: 0,
            gotoPatternsParsed: 0,
            blocksFlattened: 0,
            controlFlowPathsAnalyzed: 0,
            obfuscationPatternsDetected: 0
        };
        
        // Control flow pattern matchers
        this.patterns = {
            switchObfuscation: /switch\s*\(\s*[^)]+\s*\)\s*\{[^}]*case\s+[\d\w'"]+\s*:[^}]*\}/g,
            gotoPattern: /while\s*\(\s*!!\s*\[\s*\]\s*\)\s*\{[^}]*switch[^}]*\}/g,
            conditionalChain: /if\s*\([^)]*\)\s*\{[^}]*\}\s*else\s*if\s*\([^)]*\)\s*\{[^}]*\}/g,
            nestedBlocks: /\{\s*\{[^}]*\}\s*\}/g,
            obfuscatedLoop: /for\s*\(\s*[^;]*;\s*[^;]*;\s*[^)]*\)\s*\{[^}]*if[^}]*break[^}]*\}/g
        };
        
        // State tracking
        this.controlFlowMap = new Map();
        this.processedNodes = new Set();
    }

    /**
     * Process code for control flow deobfuscation
     * @param {string} code - JavaScript code to process
     * @param {Object} options - Processing options
     * @returns {Object} Processing result with deobfuscated code and metadata
     */
    async process(code, options = {}) {
        const processingOptions = { ...this.options, ...options };
        const result = {
            success: false,
            deobfuscatedCode: code,
            originalCode: code,
            statistics: { ...this.statistics },
            metadata: {
                controlFlowPatternsFound: [],
                simplificationsApplied: [],
                warnings: [],
                processingTime: 0
            }
        };

        const startTime = Date.now();

        try {
            // Reset processing state
            this._resetProcessingState();

            // Parse the code
            const ast = parse(code, {
                sourceType: 'module',
                allowImportExportEverywhere: true,
                allowReturnOutsideFunction: true,
                plugins: ['jsx', 'typescript']
            });

            // Apply control flow deobfuscation transformations
            if (processingOptions.detectControlFlowObfuscation) {
                this._detectControlFlowPatterns(ast, result.metadata);
            }

            if (processingOptions.simplifyConditionals) {
                this._simplifyConditionals(ast, result.metadata);
            }

            if (processingOptions.unwrapSwitchObfuscation) {
                this._unwrapSwitchObfuscation(ast, result.metadata);
            }

            if (processingOptions.eliminateGotoPatterns) {
                this._eliminateGotoPatterns(ast, result.metadata);
            }

            if (processingOptions.flattenNestedBlocks) {
                this._flattenNestedBlocks(ast, result.metadata);
            }

            if (processingOptions.optimizeControlFlow) {
                this._optimizeControlFlow(ast, result.metadata);
            }

            // Generate deobfuscated code
            const output = generate(ast, {
                compact: false,
                comments: true,
                retainLines: false
            });

            result.deobfuscatedCode = output.code;
            result.success = true;
            result.statistics = { ...this.statistics };
            result.metadata.processingTime = Date.now() - startTime;

        } catch (error) {
            result.success = false;
            result.error = {
                message: error.message,
                stack: error.stack,
                phase: 'control-flow-processing'
            };
            result.metadata.warnings.push(`Control flow processing failed: ${error.message}`);
        }

        return result;
    }

    /**
     * Detect control flow obfuscation patterns
     * @private
     */
    _detectControlFlowPatterns(ast, metadata) {
        const patterns = [];

        traverse(ast, {
            // Detect switch-based control flow obfuscation
            SwitchStatement: (path) => {
                const switchNode = path.node;
                if (this._isSwitchObfuscation(switchNode)) {
                    patterns.push({
                        type: 'switch-obfuscation',
                        location: switchNode.loc,
                        complexity: switchNode.cases.length
                    });
                    this.statistics.obfuscationPatternsDetected++;
                }
            },

            // Detect while-true loops with control flow
            WhileStatement: (path) => {
                const whileNode = path.node;
                if (this._isGotoPattern(whileNode)) {
                    patterns.push({
                        type: 'goto-pattern',
                        location: whileNode.loc,
                        complexity: this._calculateGotoComplexity(whileNode)
                    });
                    this.statistics.obfuscationPatternsDetected++;
                }
            },

            // Detect deeply nested conditional chains
            IfStatement: (path) => {
                const depth = this._calculateConditionalDepth(path);
                if (depth > 3) {
                    patterns.push({
                        type: 'deep-conditional-chain',
                        location: path.node.loc,
                        depth: depth
                    });
                    this.statistics.obfuscationPatternsDetected++;
                }
            }
        });

        metadata.controlFlowPatternsFound = patterns;
    }

    /**
     * Simplify conditional statements
     * @private
     */
    _simplifyConditionals(ast, metadata) {
        const simplifications = [];

        traverse(ast, {
            IfStatement: (path) => {
                const simplified = this._simplifyIfStatement(path.node);
                if (simplified) {
                    path.replaceWith(simplified);
                    simplifications.push('if-statement-simplified');
                    this.statistics.conditionalsSimplified++;
                }
            },

            ConditionalExpression: (path) => {
                const simplified = this._simplifyTernaryExpression(path.node);
                if (simplified) {
                    path.replaceWith(simplified);
                    simplifications.push('ternary-expression-simplified');
                    this.statistics.conditionalsSimplified++;
                }
            }
        });

        metadata.simplificationsApplied.push(...simplifications);
    }

    /**
     * Unwrap switch statement obfuscation
     * @private
     */
    _unwrapSwitchObfuscation(ast, metadata) {
        const unwrapped = [];

        traverse(ast, {
            SwitchStatement: (path) => {
                if (this._isSwitchObfuscation(path.node)) {
                    const linearCode = this._linearizeSwitchStatement(path.node);
                    if (linearCode) {
                        path.replaceWith(linearCode);
                        unwrapped.push('switch-obfuscation-unwrapped');
                        this.statistics.switchStatementsUnwrapped++;
                    }
                }
            }
        });

        metadata.simplificationsApplied.push(...unwrapped);
    }

    /**
     * Eliminate goto-style patterns
     * @private
     */
    _eliminateGotoPatterns(ast, metadata) {
        const eliminated = [];

        traverse(ast, {
            WhileStatement: (path) => {
                if (this._isGotoPattern(path.node)) {
                    const linearCode = this._linearizeGotoPattern(path.node);
                    if (linearCode) {
                        path.replaceWith(linearCode);
                        eliminated.push('goto-pattern-eliminated');
                        this.statistics.gotoPatternsParsed++;
                    }
                }
            }
        });

        metadata.simplificationsApplied.push(...eliminated);
    }

    /**
     * Flatten nested blocks
     * @private
     */
    _flattenNestedBlocks(ast, metadata) {
        const flattened = [];

        traverse(ast, {
            BlockStatement: (path) => {
                const flattening = this._flattenBlockStatement(path.node);
                if (flattening.modified) {
                    path.replaceWith(flattening.result);
                    flattened.push('nested-blocks-flattened');
                    this.statistics.blocksFlattened++;
                }
            }
        });

        metadata.simplificationsApplied.push(...flattened);
    }

    /**
     * Optimize control flow
     * @private
     */
    _optimizeControlFlow(ast, metadata) {
        const optimizations = [];

        traverse(ast, {
            // Remove unreachable code after return/break/continue
            'ReturnStatement|BreakStatement|ContinueStatement': (path) => {
                const unreachable = this._removeUnreachableCode(path);
                if (unreachable.length > 0) {
                    optimizations.push('unreachable-code-removed');
                }
            },

            // Optimize empty control structures
            'IfStatement|WhileStatement|ForStatement': (path) => {
                if (this._isEmptyControlStructure(path.node)) {
                    path.remove();
                    optimizations.push('empty-control-structure-removed');
                }
            }
        });

        metadata.simplificationsApplied.push(...optimizations);
    }

    /**
     * Check if switch statement is obfuscated
     * @private
     */
    _isSwitchObfuscation(switchNode) {
        // Check for common obfuscation patterns in switch statements
        if (switchNode.cases.length < 3) return false;
        
        // Check for numeric case labels with non-sequential values
        const caseValues = switchNode.cases
            .filter(c => c.test && t.isNumericLiteral(c.test))
            .map(c => c.test.value);
        
        if (caseValues.length === 0) return false;
        
        // Check if values are non-sequential (obfuscation indicator)
        caseValues.sort((a, b) => a - b);
        for (let i = 1; i < caseValues.length; i++) {
            if (caseValues[i] - caseValues[i-1] !== 1) {
                return true; // Non-sequential case values indicate obfuscation
            }
        }
        
        return false;
    }

    /**
     * Check if while statement is a goto pattern
     * @private
     */
    _isGotoPattern(whileNode) {
        // Check for while(true) or while(!![]) patterns with switch inside
        if (!whileNode.test) return false;
        
        // Check for common goto pattern: while(true) or while(!![])
        const isInfiniteLoop = (
            (t.isBooleanLiteral(whileNode.test) && whileNode.test.value === true) ||
            (t.isUnaryExpression(whileNode.test) && whileNode.test.operator === '!' && 
             t.isUnaryExpression(whileNode.test.argument) && whileNode.test.argument.operator === '!' &&
             t.isArrayExpression(whileNode.test.argument.argument) && 
             whileNode.test.argument.argument.elements.length === 0)
        );
        
        if (!isInfiniteLoop) return false;
        
        // Check if body contains switch statement (goto pattern indicator)
        if (t.isBlockStatement(whileNode.body)) {
            return whileNode.body.body.some(stmt => t.isSwitchStatement(stmt));
        }
        
        return false;
    }

    /**
     * Simplify if statement
     * @private
     */
    _simplifyIfStatement(ifNode) {
        // Simplify always-true or always-false conditions
        if (t.isBooleanLiteral(ifNode.test)) {
            if (ifNode.test.value === true) {
                return ifNode.consequent;
            } else {
                return ifNode.alternate || t.blockStatement([]);
            }
        }
        
        // Simplify double negation: if (!!condition)
        if (t.isUnaryExpression(ifNode.test) && ifNode.test.operator === '!' &&
            t.isUnaryExpression(ifNode.test.argument) && ifNode.test.argument.operator === '!') {
            return t.ifStatement(ifNode.test.argument.argument, ifNode.consequent, ifNode.alternate);
        }
        
        return null;
    }

    /**
     * Simplify ternary expression
     * @private
     */
    _simplifyTernaryExpression(ternaryNode) {
        // Simplify always-true or always-false conditions
        if (t.isBooleanLiteral(ternaryNode.test)) {
            return ternaryNode.test.value ? ternaryNode.consequent : ternaryNode.alternate;
        }
        
        return null;
    }

    /**
     * Linearize switch statement obfuscation
     * @private
     */
    _linearizeSwitchStatement(switchNode) {
        // Convert obfuscated switch to linear block statement
        const statements = [];
        
        // Sort cases by their numeric values for linearization
        const sortedCases = switchNode.cases
            .filter(c => c.test && t.isNumericLiteral(c.test))
            .sort((a, b) => a.test.value - b.test.value);
        
        // Convert each case to sequential statements
        for (const caseNode of sortedCases) {
            if (caseNode.consequent) {
                statements.push(...caseNode.consequent.filter(stmt => !t.isBreakStatement(stmt)));
            }
        }
        
        return statements.length > 0 ? t.blockStatement(statements) : null;
    }

    /**
     * Linearize goto pattern
     * @private
     */
    _linearizeGotoPattern(whileNode) {
        // Extract linear execution order from goto pattern
        if (!t.isBlockStatement(whileNode.body)) return null;
        
        const statements = [];
        
        // Find switch statement in while body
        const switchStmt = whileNode.body.body.find(stmt => t.isSwitchStatement(stmt));
        if (switchStmt) {
            // Linearize the switch cases
            const linearized = this._linearizeSwitchStatement(switchStmt);
            if (linearized) {
                statements.push(...linearized.body);
            }
        }
        
        return statements.length > 0 ? t.blockStatement(statements) : null;
    }

    /**
     * Flatten block statement
     * @private
     */
    _flattenBlockStatement(blockNode) {
        let modified = false;
        const flattenedStatements = [];
        
        for (const stmt of blockNode.body) {
            if (t.isBlockStatement(stmt) && stmt.body.length === 1) {
                // Flatten single-statement blocks
                flattenedStatements.push(stmt.body[0]);
                modified = true;
            } else if (t.isBlockStatement(stmt) && 
                       stmt.body.every(s => !t.isVariableDeclaration(s) || s.kind !== 'let' && s.kind !== 'const')) {
                // Flatten blocks without block-scoped declarations
                flattenedStatements.push(...stmt.body);
                modified = true;
            } else {
                flattenedStatements.push(stmt);
            }
        }
        
        return {
            modified,
            result: modified ? t.blockStatement(flattenedStatements) : blockNode
        };
    }

    /**
     * Calculate conditional depth
     * @private
     */
    _calculateConditionalDepth(path) {
        let depth = 0;
        let current = path;
        
        while (current && current.isIfStatement()) {
            depth++;
            current = current.get('alternate');
            if (current && current.isIfStatement()) {
                // Continue counting nested if-else-if chains
            } else {
                break;
            }
        }
        
        return depth;
    }

    /**
     * Calculate goto pattern complexity
     * @private
     */
    _calculateGotoComplexity(whileNode) {
        let complexity = 1;
        
        if (t.isBlockStatement(whileNode.body)) {
            // Count switch cases as complexity indicators
            const switchStmt = whileNode.body.body.find(stmt => t.isSwitchStatement(stmt));
            if (switchStmt) {
                complexity += switchStmt.cases.length;
            }
        }
        
        return complexity;
    }

    /**
     * Remove unreachable code after control flow statements
     * @private
     */
    _removeUnreachableCode(path) {
        const removed = [];
        const parent = path.parent;
        
        if (t.isBlockStatement(parent)) {
            const statements = parent.body;
            const currentIndex = statements.indexOf(path.node);
            
            if (currentIndex !== -1 && currentIndex < statements.length - 1) {
                // Remove statements after return/break/continue
                const unreachableCount = statements.length - currentIndex - 1;
                statements.splice(currentIndex + 1);
                removed.push(`${unreachableCount} unreachable statements`);
            }
        }
        
        return removed;
    }

    /**
     * Check if control structure is empty
     * @private
     */
    _isEmptyControlStructure(node) {
        if (t.isIfStatement(node)) {
            return this._isEmptyStatement(node.consequent) && 
                   (!node.alternate || this._isEmptyStatement(node.alternate));
        }
        
        if (t.isWhileStatement(node) || t.isForStatement(node)) {
            return this._isEmptyStatement(node.body);
        }
        
        return false;
    }

    /**
     * Check if statement is empty
     * @private
     */
    _isEmptyStatement(stmt) {
        if (t.isBlockStatement(stmt)) {
            return stmt.body.length === 0;
        }
        return t.isEmptyStatement(stmt);
    }

    /**
     * Reset processing state
     * @private
     */
    _resetProcessingState() {
        this.controlFlowMap.clear();
        this.processedNodes.clear();
        this.statistics = {
            conditionalsSimplified: 0,
            switchStatementsUnwrapped: 0,
            gotoPatternsParsed: 0,
            blocksFlattened: 0,
            controlFlowPathsAnalyzed: 0,
            obfuscationPatternsDetected: 0
        };
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
                'conditional-simplification',
                'switch-obfuscation-unwrapping',
                'goto-pattern-elimination',
                'nested-block-flattening',
                'control-flow-optimization',
                'obfuscation-pattern-detection'
            ],
            description: "Detects and simplifies control flow obfuscation patterns",
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

module.exports = ControlFlowProcessor;
