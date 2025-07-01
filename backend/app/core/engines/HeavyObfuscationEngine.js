/**
 * Heavy Obfuscation Engine
 * Handles heavily obfuscated code with hex variables, string arrays, control flow obfuscation
 */

const BaseEngine = require('./BaseEngine');
const StringArrayProcessor = require('../StringArrayProcessor');
const VariableNameRecovery = require('../VariableNameRecovery');
const ControlFlowProcessor = require('../processors/ControlFlowProcessor');
const DeadCodeProcessor = require('../processors/DeadCodeProcessor');
const ComplexityAnalyzer = require('../analyzers/ComplexityAnalyzer');

class HeavyObfuscationEngine extends BaseEngine {
    constructor() {
        super();
        this.codeType = 'heavy-obfuscated';
        this.capabilities = [
            'hex-variable-deobfuscation',
            'variable-name-recovery',
            'string-array-extraction',
            'string-array-decoding',
            'control-flow-deobfuscation',
            'bracket-notation-conversion',
            'dead-code-elimination',
            'complexity-analysis',
            'obfuscation-pattern-detection'
        ];
        this.stringArrayProcessor = new StringArrayProcessor();
        this.variableNameRecovery = new VariableNameRecovery();
        this.controlFlowProcessor = new ControlFlowProcessor();
        this.deadCodeProcessor = new DeadCodeProcessor();
        this.complexityAnalyzer = new ComplexityAnalyzer();
    }

    /**
     * Process heavily obfuscated code
     * @param {string} code - Obfuscated code
     * @param {Object} options - Processing options
     * @returns {Object} Processing result
     */
    async process(code, options = {}) {
        const steps = [];
        let processedCode = code;

        // Step 1: Process string arrays with full decoding
        const stringArrayResult = this._processStringArraysAdvanced(processedCode, steps);
        processedCode = stringArrayResult.code;

        // Step 2: Recover meaningful variable names from hex patterns
        const variableResult = this._processVariableNameRecovery(processedCode, steps);
        processedCode = variableResult.code;

        // Step 3: Convert bracket notation to dot notation
        processedCode = this._processBracketNotation(processedCode, steps);

        // Step 4: Simplify hex arithmetic
        processedCode = this._processHexArithmetic(processedCode, steps);

        // Step 5: Advanced control flow deobfuscation
        const controlFlowResult = await this._processControlFlowAdvanced(processedCode, steps);
        processedCode = controlFlowResult.code;

        // Step 6: Dead code elimination
        const deadCodeResult = await this._processDeadCode(processedCode, steps);
        processedCode = deadCodeResult.code;

        // Step 7: Clean up and format
        processedCode = this._formatCode(processedCode, steps);

        // Step 8: Analyze final complexity
        const complexityResult = await this._analyzeComplexity(processedCode);

        return {
            code: processedCode,
            codeType: this.codeType,
            steps,
            stringArrays: stringArrayResult.stringArrays,
            decodedStrings: stringArrayResult.decodedStrings,
            variableMappings: variableResult.variableMappings,
            meaningfulNames: variableResult.meaningfulNames,
            controlFlowMetrics: controlFlowResult.statistics,
            deadCodeMetrics: deadCodeResult.statistics,
            complexityAnalysis: complexityResult
        };
    }

    /**
     * Process string arrays with advanced decoding
     * @private
     */
    _processStringArraysAdvanced(code, steps) {
        // Reset the processor for new code
        this.stringArrayProcessor.reset();
        
        // Process string arrays using the dedicated processor
        const result = this.stringArrayProcessor.process(code);
        
        if (result.success) {
            // Add detailed steps from string array processing
            steps.push({
                name: "String Array Detection",
                description: `Found ${result.statistics.stringArraysFound} string arrays`,
                count: result.statistics.stringArraysFound,
                pattern: "obfuscated string arrays"
            });
            
            steps.push({
                name: "Decoder Function Detection", 
                description: `Found ${result.statistics.decoderFunctionsFound} decoder functions`,
                count: result.statistics.decoderFunctionsFound,
                pattern: "string array decoders"
            });
            
            steps.push({
                name: "String Array Decoding",
                description: `Decoded ${result.statistics.stringsDecoded} string references`,
                count: result.statistics.stringsDecoded,
                pattern: "function call replacements",
                reduction: result.statistics.codeReduction
            });
            
            return {
                code: result.decodedCode,
                stringArrays: result.stringArrays,
                decodedStrings: result.mappings
            };
        } else {
            // Fallback to basic detection if advanced processing fails
            steps.push({
                name: "String Array Processing",
                description: "Advanced processing failed, using basic detection",
                error: result.error,
                pattern: "fallback mode"
            });
            
            return {
                code: code,
                stringArrays: [],
                decodedStrings: []
            };
        }
    }

    /**
     * Process variable name recovery with semantic naming
     * @private
     */
    _processVariableNameRecovery(code, steps) {
        // Reset the processor for new code
        this.variableNameRecovery.reset();
        
        // Process variable recovery using the dedicated processor
        const result = this.variableNameRecovery.process(code);
        
        if (result.success) {
            // Add detailed steps from variable recovery processing
            steps.push({
                name: "Hex Variable Detection",
                description: `Found ${result.statistics.hexVariablesFound} hex variables`,
                count: result.statistics.hexVariablesFound,
                pattern: "_0x hex patterns"
            });
            
            steps.push({
                name: "Context Analysis",
                description: "Analyzed variable usage patterns and context",
                count: result.statistics.hexVariablesFound,
                pattern: "semantic context detection"
            });
            
            steps.push({
                name: "Variable Name Recovery",
                description: `Renamed ${result.statistics.variablesRenamed} variables with meaningful names`,
                count: result.statistics.variablesRenamed,
                pattern: "hex -> semantic naming",
                reduction: result.statistics.codeReduction
            });
            
            return {
                code: result.renamedCode,
                variableMappings: result.nameMappings,
                meaningfulNames: result.statistics.meaningfulNamesGenerated
            };
        } else {
            // Fallback to basic detection if advanced processing fails
            steps.push({
                name: "Variable Name Recovery",
                description: "Advanced variable recovery failed, variables preserved",
                error: result.error,
                pattern: "fallback mode"
            });
            
            return {
                code: code,
                variableMappings: [],
                meaningfulNames: 0
            };
        }
    }

    /**
     * Convert bracket notation to dot notation
     * @private
     */
    _processBracketNotation(code, steps) {
        const bracketNotationPattern = /\['([^']+)'\]/g;
        const matches = [...code.matchAll(bracketNotationPattern)];
        
        if (matches.length > 0) {
            steps.push({
                name: "Bracket Notation Conversion",
                description: "Converted bracket notation to dot notation",
                count: matches.length,
                pattern: "['property'] -> .property"
            });
            
            // Apply the conversion
            return code.replace(bracketNotationPattern, '.$1');
        }

        return code;
    }

    /**
     * Process hex arithmetic expressions
     * @private
     */
    _processHexArithmetic(code, steps) {
        const hexArithmeticPattern = /parseInt\([^)]+\)\s*\/\s*0x[a-f0-9]+/g;
        const matches = [...code.matchAll(hexArithmeticPattern)];
        
        if (matches.length > 0) {
            steps.push({
                name: "Hex Arithmetic Detection",
                description: "Found complex hex arithmetic expressions",
                count: matches.length,
                pattern: "parseInt()/0x operations"
            });
        }

        return code;
    }

    /**
     * Process control flow obfuscation with advanced processor
     * @private
     */
    async _processControlFlowAdvanced(code, steps) {
        this.controlFlowProcessor.reset();
        
        const result = await this.controlFlowProcessor.process(code, {
            simplifyConditionals: true,
            unwrapSwitchObfuscation: true,
            eliminateGotoPatterns: true,
            flattenNestedBlocks: true,
            optimizeControlFlow: true
        });
        
        if (result.success) {
            steps.push({
                name: "Advanced Control Flow Deobfuscation",
                description: `Applied ${result.metadata.simplificationsApplied.length} control flow simplifications`,
                count: result.statistics.conditionalsSimplified + result.statistics.switchStatementsUnwrapped + result.statistics.gotoPatternsParsed,
                pattern: "conditional/switch/goto simplification",
                details: result.metadata.simplificationsApplied
            });
            
            if (result.metadata.controlFlowPatternsFound.length > 0) {
                steps.push({
                    name: "Obfuscation Pattern Detection",
                    description: `Detected ${result.metadata.controlFlowPatternsFound.length} obfuscation patterns`,
                    count: result.metadata.controlFlowPatternsFound.length,
                    pattern: "obfuscation patterns",
                    patterns: result.metadata.controlFlowPatternsFound.map(p => p.type)
                });
            }
            
            return {
                code: result.deobfuscatedCode,
                statistics: result.statistics
            };
        } else {
            steps.push({
                name: "Control Flow Processing",
                description: "Advanced processing failed, code preserved",
                error: result.error?.message,
                pattern: "fallback mode"
            });
            
            return {
                code: code,
                statistics: {}
            };
        }
    }

    /**
     * Process dead code elimination
     * @private
     */
    async _processDeadCode(code, steps) {
        this.deadCodeProcessor.reset();
        
        const result = await this.deadCodeProcessor.process(code, {
            removeUnusedVariables: true,
            removeUnusedFunctions: true,
            removeUnreachableCode: true,
            removeRedundantExpressions: true,
            removeEmptyBlocks: true,
            removeUnusedImports: true
        });
        
        if (result.success) {
            const totalEliminations = result.statistics.unusedVariablesRemoved + 
                                    result.statistics.unusedFunctionsRemoved + 
                                    result.statistics.unreachableCodeBlocksRemoved;
            
            if (totalEliminations > 0) {
                steps.push({
                    name: "Dead Code Elimination",
                    description: `Removed ${totalEliminations} dead code elements`,
                    count: totalEliminations,
                    pattern: "unused/unreachable code removal",
                    reduction: result.statistics.totalBytesReduced,
                    details: result.metadata.eliminationsApplied
                });
            }
            
            return {
                code: result.deobfuscatedCode,
                statistics: result.statistics
            };
        } else {
            steps.push({
                name: "Dead Code Elimination",
                description: "Dead code processing failed, code preserved",
                error: result.error?.message,
                pattern: "fallback mode"
            });
            
            return {
                code: code,
                statistics: {}
            };
        }
    }

    /**
     * Analyze code complexity
     * @private
     */
    async _analyzeComplexity(code) {
        this.complexityAnalyzer.reset();
        
        const result = await this.complexityAnalyzer.analyze(code, {
            calculateCyclomaticComplexity: true,
            calculateCognitiveComplexity: true,
            analyzeNestingDepth: true,
            detectObfuscationPatterns: true
        });
        
        if (result.success) {
            return {
                complexity: result.complexity,
                metrics: result.metrics,
                warnings: result.warnings,
                recommendations: result.recommendations
            };
        } else {
            return {
                complexity: { score: 0, level: 'unknown' },
                metrics: {},
                warnings: [`Complexity analysis failed: ${result.error?.message}`],
                recommendations: []
            };
        }
    }

    /**
     * Format and clean up code
     * @private
     */
    _formatCode(code, steps) {
        const formatted = code
            .replace(/\s+/g, ' ')
            .replace(/;\s*}/g, ';\n}')
            .replace(/{\s*/g, '{\n  ')
            .replace(/;\s*(?=[a-zA-Z_$])/g, ';\n  ');

        steps.push({
            name: "Code Formatting",
            description: "Applied basic code formatting and cleanup",
            count: 1,
            pattern: "whitespace normalization"
        });

        return formatted;
    }

    /**
     * Get specific capabilities for heavy obfuscation
     */
    getCapabilities() {
        return {
            type: this.codeType,
            patterns: [
                'Hex variable names (_0x123abc)',
                'String array obfuscation with full decoding',
                'Decoder function extraction and resolution',
                'Control flow flattening and switch obfuscation',
                'Goto-style control flow patterns',
                'Deep conditional chains and nesting',
                'Arithmetic expression obfuscation',
                'Property access obfuscation',
                'Dead code and unreachable statements'
            ],
            features: [
                'Advanced string array decoding',
                'Intelligent variable name recovery',
                'Semantic naming based on context analysis',
                'Control flow deobfuscation and simplification',
                'Switch statement unwrapping and linearization',
                'Goto pattern elimination',
                'Dead code elimination and optimization',
                'Complexity analysis and obfuscation detection',
                'Multiple decoder function support',
                'Automatic reference replacement',
                'Code cleanup and optimization',
                'Detailed processing statistics'
            ],
            limitations: [
                'Complex control flow may require manual review',
                'Dynamic property access resolution is limited',
                'Runtime-dependent obfuscation cannot be fully resolved'
            ]
        };
    }
}

module.exports = HeavyObfuscationEngine;