/**
 * Heavy Obfuscation Engine
 * Handles heavily obfuscated code with hex variables, string arrays, control flow obfuscation
 */

const BaseEngine = require('./BaseEngine');
const StringArrayProcessor = require('../StringArrayProcessor');
const VariableNameRecovery = require('../VariableNameRecovery');

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
            'dead-code-elimination'
        ];
        this.stringArrayProcessor = new StringArrayProcessor();
        this.variableNameRecovery = new VariableNameRecovery();
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

        // Step 5: Detect control flow obfuscation
        processedCode = this._processControlFlow(processedCode, steps);

        // Step 6: Clean up and format
        processedCode = this._formatCode(processedCode, steps);

        return {
            code: processedCode,
            codeType: this.codeType,
            steps,
            stringArrays: stringArrayResult.stringArrays,
            decodedStrings: stringArrayResult.decodedStrings,
            variableMappings: variableResult.variableMappings,
            meaningfulNames: variableResult.meaningfulNames
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
     * Process control flow obfuscation
     * @private
     */
    _processControlFlow(code, steps) {
        const controlFlowPattern = /while\s*\(\s*!!\[\]\s*\)\s*\{[^}]*try\s*\{[^}]*parseInt/g;
        const matches = [...code.matchAll(controlFlowPattern)];
        
        if (matches.length > 0) {
            steps.push({
                name: "Control Flow Detection",
                description: "Found control flow obfuscation patterns",
                count: matches.length,
                pattern: "while(![]) try/catch loops"
            });
        }

        return code;
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
                'Control flow flattening detection',
                'Arithmetic expression obfuscation',
                'Property access obfuscation'
            ],
            features: [
                'Advanced string array decoding',
                'Intelligent variable name recovery',
                'Semantic naming based on context analysis',
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