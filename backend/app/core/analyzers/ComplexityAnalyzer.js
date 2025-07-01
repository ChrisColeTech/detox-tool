/**
 * Complexity Analyzer
 * Analyzes code complexity metrics including cyclomatic complexity,
 * cognitive complexity, nesting depth, and obfuscation indicators
 * 
 * @author Detox-Tool Development Team
 * @phase Phase 3 - Control Flow Deobfuscation
 * @version 1.0.0
 */

const { parse } = require('@babel/parser');
const traverse = require('@babel/traverse').default;
const t = require('@babel/types');

class ComplexityAnalyzer {
    constructor(options = {}) {
        this.options = {
            // Analysis options
            calculateCyclomaticComplexity: options.calculateCyclomaticComplexity !== false,
            calculateCognitiveComplexity: options.calculateCognitiveComplexity !== false,
            analyzeNestingDepth: options.analyzeNestingDepth !== false,
            detectObfuscationPatterns: options.detectObfuscationPatterns !== false,
            analyzeControlFlowMetrics: options.analyzeControlFlowMetrics !== false,
            trackFunctionMetrics: options.trackFunctionMetrics !== false,
            
            // Thresholds for complexity warnings
            cyclomaticComplexityThreshold: options.cyclomaticComplexityThreshold || 10,
            cognitiveComplexityThreshold: options.cognitiveComplexityThreshold || 15,
            nestingDepthThreshold: options.nestingDepthThreshold || 4,
            functionLengthThreshold: options.functionLengthThreshold || 50,
            
            // Analysis depth
            maxAnalysisDepth: options.maxAnalysisDepth || 20,
            includeDetailedMetrics: options.includeDetailedMetrics !== false,
            
            ...options
        };
        
        // Complexity metrics
        this.metrics = {
            overall: {
                cyclomaticComplexity: 0,
                cognitiveComplexity: 0,
                maxNestingDepth: 0,
                totalLines: 0,
                totalFunctions: 0,
                totalStatements: 0
            },
            functions: new Map(),
            obfuscationIndicators: {
                deepNesting: 0,
                complexControlFlow: 0,
                longFunctions: 0,
                highCyclomaticComplexity: 0,
                suspiciousPatterns: []
            },
            warnings: []
        };
        
        // Analysis state
        this.currentDepth = 0;
        this.currentFunction = null;
        this.scopeStack = [];
    }

    /**
     * Analyze code complexity
     * @param {string} code - JavaScript code to analyze
     * @param {Object} options - Analysis options
     * @returns {Object} Complexity analysis results
     */
    async analyze(code, options = {}) {
        const analysisOptions = { ...this.options, ...options };
        const result = {
            success: false,
            complexity: null,
            metrics: null,
            warnings: [],
            recommendations: [],
            metadata: {
                analysisTime: 0,
                linesAnalyzed: 0
            }
        };

        const startTime = Date.now();

        try {
            // Reset analysis state
            this._resetAnalysisState();

            // Parse the code
            const ast = parse(code, {
                sourceType: 'module',
                allowImportExportEverywhere: true,
                allowReturnOutsideFunction: true,
                plugins: ['jsx', 'typescript']
            });

            // Count total lines
            this.metrics.overall.totalLines = code.split('\n').length;
            result.metadata.linesAnalyzed = this.metrics.overall.totalLines;

            // Perform complexity analysis
            if (analysisOptions.calculateCyclomaticComplexity) {
                this._calculateCyclomaticComplexity(ast);
            }

            if (analysisOptions.calculateCognitiveComplexity) {
                this._calculateCognitiveComplexity(ast);
            }

            if (analysisOptions.analyzeNestingDepth) {
                this._analyzeNestingDepth(ast);
            }

            if (analysisOptions.detectObfuscationPatterns) {
                this._detectObfuscationPatterns(ast);
            }

            if (analysisOptions.analyzeControlFlowMetrics) {
                this._analyzeControlFlowMetrics(ast);
            }

            if (analysisOptions.trackFunctionMetrics) {
                this._trackFunctionMetrics(ast);
            }

            // Generate warnings and recommendations
            this._generateWarnings(analysisOptions);
            this._generateRecommendations();

            result.success = true;
            result.complexity = this._calculateOverallComplexity();
            result.metrics = { ...this.metrics };
            result.warnings = [...this.metrics.warnings];
            result.recommendations = this._getRecommendations();
            result.metadata.analysisTime = Date.now() - startTime;

        } catch (error) {
            result.success = false;
            result.error = {
                message: error.message,
                stack: error.stack,
                phase: 'complexity-analysis'
            };
        }

        return result;
    }

    /**
     * Calculate cyclomatic complexity
     * @private
     */
    _calculateCyclomaticComplexity(ast) {
        let complexity = 1; // Base complexity

        traverse(ast, {
            enter: (path) => {
                // Increment complexity for decision points
                if (this._isDecisionPoint(path.node)) {
                    complexity++;
                    
                    // Track per-function complexity
                    if (this.currentFunction) {
                        const funcMetrics = this.metrics.functions.get(this.currentFunction);
                        if (funcMetrics) {
                            funcMetrics.cyclomaticComplexity++;
                        }
                    }
                }
            },

            FunctionDeclaration: {
                enter: (path) => {
                    const funcName = path.node.id ? path.node.id.name : 'anonymous';
                    this.currentFunction = funcName;
                    this.metrics.functions.set(funcName, {
                        cyclomaticComplexity: 1,
                        cognitiveComplexity: 0,
                        nestingDepth: 0,
                        lineCount: this._calculateFunctionLines(path.node),
                        parameterCount: path.node.params.length,
                        returnStatements: 0
                    });
                },
                exit: () => {
                    this.currentFunction = null;
                }
            },

            FunctionExpression: {
                enter: (path) => {
                    const funcName = path.node.id ? path.node.id.name : `anonymous_${Date.now()}`;
                    this.currentFunction = funcName;
                    this.metrics.functions.set(funcName, {
                        cyclomaticComplexity: 1,
                        cognitiveComplexity: 0,
                        nestingDepth: 0,
                        lineCount: this._calculateFunctionLines(path.node),
                        parameterCount: path.node.params.length,
                        returnStatements: 0
                    });
                },
                exit: () => {
                    this.currentFunction = null;
                }
            }
        });

        this.metrics.overall.cyclomaticComplexity = complexity;
    }

    /**
     * Calculate cognitive complexity
     * @private
     */
    _calculateCognitiveComplexity(ast) {
        let cognitiveComplexity = 0;
        let nestingLevel = 0;

        traverse(ast, {
            enter: (path) => {
                const node = path.node;
                let increment = 0;

                // Base increments for control structures
                if (t.isIfStatement(node) || t.isConditionalExpression(node)) {
                    increment = 1 + nestingLevel;
                } else if (t.isSwitchStatement(node)) {
                    increment = 1 + nestingLevel;
                } else if (t.isForStatement(node) || t.isWhileStatement(node) || t.isDoWhileStatement(node)) {
                    increment = 1 + nestingLevel;
                } else if (t.isForInStatement(node) || t.isForOfStatement(node)) {
                    increment = 1 + nestingLevel;
                } else if (t.isTryStatement(node)) {
                    increment = 1 + nestingLevel;
                } else if (t.isCatchClause(node)) {
                    increment = 1 + nestingLevel;
                } else if (t.isLogicalExpression(node) && (node.operator === '&&' || node.operator === '||')) {
                    increment = 1; // Binary logical operators
                }

                cognitiveComplexity += increment;

                // Track per-function cognitive complexity
                if (this.currentFunction && increment > 0) {
                    const funcMetrics = this.metrics.functions.get(this.currentFunction);
                    if (funcMetrics) {
                        funcMetrics.cognitiveComplexity += increment;
                    }
                }

                // Track nesting level
                if (this._increasesNesting(node)) {
                    nestingLevel++;
                }
            },

            exit: (path) => {
                if (this._increasesNesting(path.node)) {
                    nestingLevel--;
                }
            }
        });

        this.metrics.overall.cognitiveComplexity = cognitiveComplexity;
    }

    /**
     * Analyze nesting depth
     * @private
     */
    _analyzeNestingDepth(ast) {
        let maxDepth = 0;
        let currentDepth = 0;

        traverse(ast, {
            enter: (path) => {
                if (this._increasesNesting(path.node)) {
                    currentDepth++;
                    maxDepth = Math.max(maxDepth, currentDepth);

                    // Track per-function nesting depth
                    if (this.currentFunction) {
                        const funcMetrics = this.metrics.functions.get(this.currentFunction);
                        if (funcMetrics) {
                            funcMetrics.nestingDepth = Math.max(funcMetrics.nestingDepth, currentDepth);
                        }
                    }
                }
            },

            exit: (path) => {
                if (this._increasesNesting(path.node)) {
                    currentDepth--;
                }
            }
        });

        this.metrics.overall.maxNestingDepth = maxDepth;
    }

    /**
     * Detect obfuscation patterns
     * @private
     */
    _detectObfuscationPatterns(ast) {
        const patterns = this.metrics.obfuscationIndicators;

        traverse(ast, {
            // Detect excessive nesting (obfuscation indicator)
            enter: (path) => {
                if (this._increasesNesting(path.node)) {
                    this.currentDepth++;
                    if (this.currentDepth > this.options.nestingDepthThreshold) {
                        patterns.deepNesting++;
                    }
                }
            },

            exit: (path) => {
                if (this._increasesNesting(path.node)) {
                    this.currentDepth--;
                }
            },

            // Detect suspicious control flow patterns
            SwitchStatement: (path) => {
                const caseCount = path.node.cases.length;
                if (caseCount > 10) {
                    patterns.complexControlFlow++;
                    patterns.suspiciousPatterns.push({
                        type: 'large-switch',
                        location: path.node.loc,
                        details: `Switch with ${caseCount} cases`
                    });
                }
            },

            // Detect obfuscated while loops
            WhileStatement: (path) => {
                if (t.isBooleanLiteral(path.node.test) && path.node.test.value === true) {
                    patterns.suspiciousPatterns.push({
                        type: 'infinite-while-loop',
                        location: path.node.loc,
                        details: 'Potential goto pattern'
                    });
                }
            },

            // Detect excessive function parameters (obfuscation indicator)
            Function: (path) => {
                if (path.node.params.length > 10) {
                    patterns.suspiciousPatterns.push({
                        type: 'excessive-parameters',
                        location: path.node.loc,
                        details: `Function with ${path.node.params.length} parameters`
                    });
                }
            }
        });
    }

    /**
     * Analyze control flow metrics
     * @private
     */
    _analyzeControlFlowMetrics(ast) {
        let totalStatements = 0;
        let totalFunctions = 0;

        traverse(ast, {
            Statement: () => {
                totalStatements++;
            },

            Function: () => {
                totalFunctions++;
            },

            ReturnStatement: (path) => {
                if (this.currentFunction) {
                    const funcMetrics = this.metrics.functions.get(this.currentFunction);
                    if (funcMetrics) {
                        funcMetrics.returnStatements++;
                    }
                }
            }
        });

        this.metrics.overall.totalStatements = totalStatements;
        this.metrics.overall.totalFunctions = totalFunctions;
    }

    /**
     * Track function-specific metrics
     * @private
     */
    _trackFunctionMetrics(ast) {
        traverse(ast, {
            FunctionDeclaration: (path) => {
                const funcName = path.node.id ? path.node.id.name : 'anonymous';
                const metrics = this.metrics.functions.get(funcName);
                
                if (metrics) {
                    // Check for long functions
                    if (metrics.lineCount > this.options.functionLengthThreshold) {
                        this.metrics.obfuscationIndicators.longFunctions++;
                    }

                    // Check for high cyclomatic complexity
                    if (metrics.cyclomaticComplexity > this.options.cyclomaticComplexityThreshold) {
                        this.metrics.obfuscationIndicators.highCyclomaticComplexity++;
                    }
                }
            }
        });
    }

    /**
     * Check if node is a decision point for cyclomatic complexity
     * @private
     */
    _isDecisionPoint(node) {
        return t.isIfStatement(node) ||
               t.isWhileStatement(node) ||
               t.isForStatement(node) ||
               t.isForInStatement(node) ||
               t.isForOfStatement(node) ||
               t.isDoWhileStatement(node) ||
               t.isSwitchCase(node) ||
               t.isCatchClause(node) ||
               t.isConditionalExpression(node) ||
               (t.isLogicalExpression(node) && (node.operator === '&&' || node.operator === '||'));
    }

    /**
     * Check if node increases nesting level
     * @private
     */
    _increasesNesting(node) {
        return t.isIfStatement(node) ||
               t.isWhileStatement(node) ||
               t.isForStatement(node) ||
               t.isForInStatement(node) ||
               t.isForOfStatement(node) ||
               t.isDoWhileStatement(node) ||
               t.isSwitchStatement(node) ||
               t.isTryStatement(node) ||
               t.isCatchClause(node) ||
               t.isFunction(node);
    }

    /**
     * Calculate function line count
     * @private
     */
    _calculateFunctionLines(funcNode) {
        if (funcNode.loc) {
            return funcNode.loc.end.line - funcNode.loc.start.line + 1;
        }
        return 0;
    }

    /**
     * Generate warnings based on complexity thresholds
     * @private
     */
    _generateWarnings(options) {
        const { overall, functions } = this.metrics;

        // Overall complexity warnings
        if (overall.cyclomaticComplexity > options.cyclomaticComplexityThreshold) {
            this.metrics.warnings.push({
                type: 'high-cyclomatic-complexity',
                message: `High overall cyclomatic complexity: ${overall.cyclomaticComplexity}`,
                severity: 'warning'
            });
        }

        if (overall.cognitiveComplexity > options.cognitiveComplexityThreshold) {
            this.metrics.warnings.push({
                type: 'high-cognitive-complexity',
                message: `High cognitive complexity: ${overall.cognitiveComplexity}`,
                severity: 'warning'
            });
        }

        if (overall.maxNestingDepth > options.nestingDepthThreshold) {
            this.metrics.warnings.push({
                type: 'deep-nesting',
                message: `Deep nesting detected: ${overall.maxNestingDepth} levels`,
                severity: 'warning'
            });
        }

        // Function-specific warnings
        for (const [funcName, metrics] of functions) {
            if (metrics.cyclomaticComplexity > options.cyclomaticComplexityThreshold) {
                this.metrics.warnings.push({
                    type: 'function-complexity',
                    message: `Function '${funcName}' has high cyclomatic complexity: ${metrics.cyclomaticComplexity}`,
                    severity: 'warning'
                });
            }

            if (metrics.lineCount > options.functionLengthThreshold) {
                this.metrics.warnings.push({
                    type: 'long-function',
                    message: `Function '${funcName}' is too long: ${metrics.lineCount} lines`,
                    severity: 'info'
                });
            }
        }
    }

    /**
     * Generate recommendations for improvement
     * @private
     */
    _generateRecommendations() {
        const recommendations = [];
        const { overall, obfuscationIndicators } = this.metrics;

        if (overall.cyclomaticComplexity > this.options.cyclomaticComplexityThreshold) {
            recommendations.push('Consider breaking down complex control structures');
        }

        if (overall.maxNestingDepth > this.options.nestingDepthThreshold) {
            recommendations.push('Consider extracting nested code into separate functions');
        }

        if (obfuscationIndicators.longFunctions > 0) {
            recommendations.push('Consider splitting long functions into smaller, focused functions');
        }

        if (obfuscationIndicators.suspiciousPatterns.length > 0) {
            recommendations.push('Suspicious obfuscation patterns detected - consider further deobfuscation');
        }

        this.recommendations = recommendations;
    }

    /**
     * Calculate overall complexity score
     * @private
     */
    _calculateOverallComplexity() {
        const { overall } = this.metrics;
        
        // Weighted complexity score
        const cyclomaticWeight = 0.4;
        const cognitiveWeight = 0.4;
        const nestingWeight = 0.2;
        
        const normalizedCyclomatic = Math.min(overall.cyclomaticComplexity / this.options.cyclomaticComplexityThreshold, 2);
        const normalizedCognitive = Math.min(overall.cognitiveComplexity / this.options.cognitiveComplexityThreshold, 2);
        const normalizedNesting = Math.min(overall.maxNestingDepth / this.options.nestingDepthThreshold, 2);
        
        const complexityScore = (
            normalizedCyclomatic * cyclomaticWeight +
            normalizedCognitive * cognitiveWeight +
            normalizedNesting * nestingWeight
        ) * 100;

        return {
            score: Math.round(complexityScore),
            level: this._getComplexityLevel(complexityScore),
            breakdown: {
                cyclomatic: Math.round(normalizedCyclomatic * 100),
                cognitive: Math.round(normalizedCognitive * 100),
                nesting: Math.round(normalizedNesting * 100)
            }
        };
    }

    /**
     * Get complexity level description
     * @private
     */
    _getComplexityLevel(score) {
        if (score < 50) return 'low';
        if (score < 100) return 'medium';
        if (score < 150) return 'high';
        return 'very-high';
    }

    /**
     * Get recommendations
     * @returns {Array} List of recommendations
     */
    _getRecommendations() {
        return this.recommendations || [];
    }

    /**
     * Reset analysis state
     * @private
     */
    _resetAnalysisState() {
        this.metrics = {
            overall: {
                cyclomaticComplexity: 0,
                cognitiveComplexity: 0,
                maxNestingDepth: 0,
                totalLines: 0,
                totalFunctions: 0,
                totalStatements: 0
            },
            functions: new Map(),
            obfuscationIndicators: {
                deepNesting: 0,
                complexControlFlow: 0,
                longFunctions: 0,
                highCyclomaticComplexity: 0,
                suspiciousPatterns: []
            },
            warnings: []
        };
        
        this.currentDepth = 0;
        this.currentFunction = null;
        this.scopeStack = [];
        this.recommendations = [];
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
                'cyclomatic-complexity-analysis',
                'cognitive-complexity-analysis',
                'nesting-depth-analysis',
                'obfuscation-pattern-detection',
                'control-flow-metrics',
                'function-metrics-tracking',
                'complexity-warnings',
                'improvement-recommendations'
            ],
            description: "Analyzes code complexity and control flow patterns",
            metrics: this.metrics.overall
        };
    }

    /**
     * Reset component state
     */
    reset() {
        this._resetAnalysisState();
    }
}

module.exports = ComplexityAnalyzer;
